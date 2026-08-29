import Phaser from "phaser";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { AnchorRegistry, ScreenRect } from "../bridge/anchors";
import { getGameboardWorldBounds, type WorldRect } from "./coordinates";
import { DPR } from "./rendering";

/**
 * Viewport parity with the DOM farm:
 * - base magnification is PIXEL_SCALE (2.625) — one source pixel renders at
 *   2.625 CSS px at user zoom 1, exactly like GRID_WIDTH_PX = 16 * 2.625.
 *   The camera additionally zooms by DPR because the backing store is at
 *   physical resolution (core/rendering.ts) — camera/pointer maths below are
 *   in BUFFER pixels; only the anchor projection converts to CSS px;
 * - user zoom multiplies that, clamped 0.5..1 (ZoomProvider's pinch range);
 * - drag to pan (react-indiana-drag-scroll's role), wheel or pinch to zoom;
 * - the viewport is clamped to the gameboard (84x56 tiles + expansion margin);
 * - position survives an interior visit via sessionStorage, one-shot restore,
 *   mirroring islandScroll.ts; first visit centres the land base (the
 *   scrollIntoView(GenesisBlock) behaviour).
 *
 * Also owns the anchor projection: whenever the camera moves or zooms, every
 * registered world anchor is reprojected so overlay UI tracks the world.
 */

const CAMERA_STORAGE_KEY = "sunflower-land:phaser-farm-camera";

/**
 * Visits get their own slot so a visited farm's scroll position doesn't
 * carry back onto the home farm (and vice versa) [islandScroll.ts parity].
 */
const storageKey = (visiting: boolean) =>
  visiting ? `${CAMERA_STORAGE_KEY}:visit` : CAMERA_STORAGE_KEY;

const MIN_USER_ZOOM = 0.5;
const MAX_USER_ZOOM = 1;
const WHEEL_ZOOM_SENSITIVITY = 0.001;

/**
 * Dead zone before a press turns into a pan, in CSS px (scaled by DPR into
 * buffer px). Finger jitter during fast taps stays a tap; a deliberate drag
 * crosses it immediately.
 */
const PAN_DEAD_ZONE_CSS_PX = 6;

type SavedCamera = { scrollX: number; scrollY: number; userZoom: number };

export class FarmCameraController {
  private userZoom = 1;

  /** Set while landscaping drags a ghost/item so panning doesn't fight it. */
  panSuspended = false;

  /** Pinch baseline, captured when a second pointer goes down. */
  private pinchStartDistance = 0;
  private pinchStartZoom = 1;

  /** True once the current gesture has left the tap dead zone. */
  private panArmed = false;

  private detachInput: (() => void) | undefined;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly anchors: AnchorRegistry,
  ) {}

  attach(expansionCount: number) {
    this.setExpansionCount(expansionCount);
    this.applyZoom();

    if (!this.restore()) {
      this.scene.cameras.main.centerOn(0, 0);
    }

    this.anchors.setProjection((world) => this.projectWorldRect(world));

    const input = this.scene.input;
    input.addPointer(1); // two active pointers for pinch

    const onPointerDown = () => {
      this.panArmed = false;
      const [first, second] = this.activePointers();
      if (first && second) {
        this.pinchStartDistance = Phaser.Math.Distance.Between(
          first.x,
          first.y,
          second.x,
          second.y,
        );
        this.pinchStartZoom = this.userZoom;
      }
    };

    const onPointerMove = (pointer: Phaser.Input.Pointer) => {
      const [first, second] = this.activePointers();

      if (first && second) {
        const distance = Phaser.Math.Distance.Between(
          first.x,
          first.y,
          second.x,
          second.y,
        );
        if (this.pinchStartDistance > 0) {
          this.setUserZoom(
            this.pinchStartZoom * (distance / this.pinchStartDistance),
          );
        }
        return;
      }

      if (!pointer.isDown || this.panSuspended) return;

      // Tap dead zone: don't start panning until the pointer has clearly
      // moved from where it went down — fast taps jitter a few px and were
      // turning into mini drags.
      if (!this.panArmed) {
        const travelled = Phaser.Math.Distance.Between(
          pointer.x,
          pointer.y,
          pointer.downX,
          pointer.downY,
        );
        if (travelled < PAN_DEAD_ZONE_CSS_PX * DPR) return;
        this.panArmed = true;
      }

      const camera = this.scene.cameras.main;
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
      this.anchors.reprojectAll();
    };

    const onWheel = (
      _pointer: Phaser.Input.Pointer,
      _objects: Phaser.GameObjects.GameObject[],
      _deltaX: number,
      deltaY: number,
    ) => {
      this.setUserZoom(this.userZoom - deltaY * WHEEL_ZOOM_SENSITIVITY);
    };

    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown);
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
    input.on(Phaser.Input.Events.POINTER_WHEEL, onWheel);

    const onResize = () => this.anchors.reprojectAll();
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, onResize);

    this.detachInput = () => {
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown);
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
      input.off(Phaser.Input.Events.POINTER_WHEEL, onWheel);
      this.scene.scale.off(Phaser.Scale.Events.RESIZE, onResize);
    };

    this.anchors.reprojectAll();
  }

  /** Re-clamp the viewport when land expands (bounds grow with the board). */
  setExpansionCount(expansionCount: number) {
    const bounds = getGameboardWorldBounds(expansionCount);
    this.scene.cameras.main.setBounds(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
    );
  }

  getUserZoom() {
    return this.userZoom;
  }

  setUserZoom(zoom: number) {
    const clamped = Phaser.Math.Clamp(zoom, MIN_USER_ZOOM, MAX_USER_ZOOM);
    if (clamped === this.userZoom) return;
    this.userZoom = clamped;
    this.applyZoom();
    this.anchors.reprojectAll();
  }

  /** Persist viewport for the next farm mount (called on scene shutdown). */
  save() {
    const camera = this.scene.cameras.main;
    const saved: SavedCamera = {
      scrollX: camera.scrollX,
      scrollY: camera.scrollY,
      userZoom: this.userZoom,
    };
    try {
      sessionStorage.setItem(
        storageKey(this.isVisiting()),
        JSON.stringify(saved),
      );
    } catch {
      // Storage failures must never block navigation.
    }
  }

  destroy() {
    this.save();
    this.detachInput?.();
    this.detachInput = undefined;
  }

  private restore(): boolean {
    try {
      const key = storageKey(this.isVisiting());
      const raw = sessionStorage.getItem(key);
      if (!raw) return false;
      sessionStorage.removeItem(key);

      const saved = JSON.parse(raw) as SavedCamera;
      this.userZoom = Phaser.Math.Clamp(
        saved.userZoom,
        MIN_USER_ZOOM,
        MAX_USER_ZOOM,
      );
      this.applyZoom();
      this.scene.cameras.main.setScroll(saved.scrollX, saved.scrollY);
      return true;
    } catch {
      try {
        sessionStorage.removeItem(storageKey(this.isVisiting()));
      } catch {
        // ignore
      }
      return false;
    }
  }

  private isVisiting(): boolean {
    return !!(this.scene as { visitingActive?: boolean }).visitingActive;
  }

  private applyZoom() {
    this.scene.cameras.main.setZoom(DPR * PIXEL_SCALE * this.userZoom);
  }

  private activePointers(): [
    Phaser.Input.Pointer | undefined,
    Phaser.Input.Pointer | undefined,
  ] {
    const down = [this.scene.input.pointer1, this.scene.input.pointer2].filter(
      (pointer): pointer is Phaser.Input.Pointer => !!pointer?.isDown,
    );
    return [down[0], down[1]];
  }

  /**
   * World rect (source px) -> screen rect in CSS px relative to the canvas.
   * camera.width/zoom/scroll are all in BUFFER pixels; the canvas is
   * CSS-squeezed by 1/DPR, so the final divide converts buffer px -> CSS px.
   *
   * Derived from scroll + zoom directly, NOT camera.worldView — worldView only
   * refreshes during render, so it's stale in the same tick as a centerOn or
   * setZoom. Zoom is applied around the camera's midpoint:
   * screen = (world - midpoint) * zoom + viewportSize / 2.
   */
  private projectWorldRect(world: WorldRect): ScreenRect {
    const camera = this.scene.cameras.main;
    const midX = camera.scrollX + camera.width / 2;
    const midY = camera.scrollY + camera.height / 2;

    const bufferLeft = (world.x - midX) * camera.zoom + camera.width / 2;
    const bufferTop = (world.y - midY) * camera.zoom + camera.height / 2;
    const bufferWidth = world.width * camera.zoom;
    const bufferHeight = world.height * camera.zoom;

    const visible =
      bufferLeft + bufferWidth >= 0 &&
      bufferLeft <= camera.width &&
      bufferTop + bufferHeight >= 0 &&
      bufferTop <= camera.height;

    return {
      left: bufferLeft / DPR,
      top: bufferTop / DPR,
      width: bufferWidth / DPR,
      height: bufferHeight / DPR,
      visible,
    };
  }
}
