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
 * - drag to pan (react-indiana-drag-scroll's role); a plain wheel gesture —
 *   a trackpad two-finger scroll — PANS exactly like the DOM farm's scroll
 *   container, while ctrl+wheel (how macOS delivers a trackpad pinch, and
 *   ctrl+scroll on a mouse) zooms, as does a two-pointer touch pinch;
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
/** Multiplicative pinch feel: zoom *= exp(-delta * this). */
const PINCH_ZOOM_SENSITIVITY = 0.01;

/**
 * Dead zone before a press turns into a pan, in CSS px (scaled by DPR into
 * buffer px). Finger jitter during fast taps stays a tap; a deliberate drag
 * crosses it immediately. Shared with clickable.ts, which uses the same
 * threshold to tell a tap-release from a pan-release.
 */
export const PAN_DEAD_ZONE_CSS_PX = 6;

/** Duration of the ease when the camera centres on a clicked node. */
const CENTER_PAN_MS = 450;

/**
 * Momentum panning (the DOM farm's native touch scroll had inertia; a hard
 * stop on release feels rigid). Release velocity comes from the pointer's
 * travel over the last GLIDE_SAMPLE_WINDOW_MS, then decays exponentially —
 * DECAY is per-ms (UIScrollView's "normal" rate is 0.998/ms; slightly
 * quicker reads better at pixel-art zoom). A new touch catches the glide.
 */
const GLIDE_SAMPLE_WINDOW_MS = 120;
const GLIDE_DECAY_PER_MS = 0.996;
/** Below this speed the glide rests (world px/ms). */
const GLIDE_MIN_SPEED = 0.02;
/** Flick speed cap in CSS px/ms, so a wild swipe can't launch the camera. */
const GLIDE_MAX_SPEED_CSS = 4;

type PanSample = { time: number; x: number; y: number };

type SavedCamera = { scrollX: number; scrollY: number; userZoom: number };

export class FarmCameraController {
  private userZoom = 1;

  /** Set while landscaping drags a ghost/item so panning doesn't fight it. */
  panSuspended = false;

  /**
   * Fired when the user moves the viewport themselves — a drag crossing the
   * pan dead zone, a wheel scroll, or any zoom. The scene uses it to dismiss
   * transient UI (the SFT popover) that shouldn't ride along with a pan.
   * NOT fired by programmatic moves (panToWorldRect, restore).
   */
  onUserGesture: (() => void) | undefined;

  /** Pinch baseline, captured when a second pointer goes down. */
  private pinchStartDistance = 0;
  private pinchStartZoom = 1;

  /** True once the current gesture has left the tap dead zone. */
  private panArmed = false;

  /** Recent pointer positions (buffer px) for release-velocity sampling. */
  private panSamples: PanSample[] = [];

  /** Momentum glide velocity, world px/ms. Zero when at rest. */
  private glideVx = 0;
  private glideVy = 0;

  /** Active centre-on-node ease, or undefined when at rest. */
  private panTween:
    | {
        fromX: number;
        fromY: number;
        toX: number;
        toY: number;
        elapsed: number;
      }
    | undefined;

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

    const onPointerDown = (pointer: Phaser.Input.Pointer) => {
      this.panArmed = false;
      // A finger landing catches a glide, exactly like native scrolling.
      this.stopGlide();
      this.panSamples = [
        { time: performance.now(), x: pointer.x, y: pointer.y },
      ];
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
        this.onUserGesture?.();
      }

      const camera = this.scene.cameras.main;
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
      this.anchors.reprojectAll();

      const now = performance.now();
      this.panSamples.push({ time: now, x: pointer.x, y: pointer.y });
      this.panSamples = this.panSamples.filter(
        (sample) => now - sample.time <= GLIDE_SAMPLE_WINDOW_MS,
      );
    };

    const onPointerUp = () => {
      const wasPan = this.panArmed && !this.panSuspended;
      this.panArmed = false;
      const samples = this.panSamples;
      this.panSamples = [];
      // Only a clean single-pointer pan release flings; lifting one finger
      // of a pinch (or a tap) must not.
      const [remaining] = this.activePointers();
      if (!wasPan || remaining) return;
      this.startGlide(samples);
    };

    const onWheel = (
      pointer: Phaser.Input.Pointer,
      _objects: Phaser.GameObjects.GameObject[],
      deltaX: number,
      deltaY: number,
    ) => {
      // macOS delivers a trackpad pinch as wheel + ctrlKey; a plain wheel is
      // the two-finger scroll, which the DOM farm treats as scrolling — pan.
      const native = pointer.event as WheelEvent | undefined;
      if (native?.ctrlKey || native?.metaKey) {
        native.preventDefault?.();
        this.setUserZoom(
          this.userZoom * Math.exp(-deltaY * PINCH_ZOOM_SENSITIVITY),
        );
        return;
      }
      if (this.panSuspended) return;
      this.stopGlide();
      this.onUserGesture?.();
      const camera = this.scene.cameras.main;
      // Wheel deltas are CSS px; camera maths are buffer px (CSS * DPR).
      camera.scrollX += (deltaX * DPR) / camera.zoom;
      camera.scrollY += (deltaY * DPR) / camera.zoom;
      this.anchors.reprojectAll();
    };

    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown);
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
    input.on(Phaser.Input.Events.POINTER_UP, onPointerUp);
    input.on(Phaser.Input.Events.POINTER_WHEEL, onWheel);

    const onUpdate = (_time: number, delta: number) => this.tickGlide(delta);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, onUpdate);

    const onResize = () => this.anchors.reprojectAll();
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, onResize);

    this.detachInput = () => {
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown);
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
      input.off(Phaser.Input.Events.POINTER_UP, onPointerUp);
      input.off(Phaser.Input.Events.POINTER_WHEEL, onWheel);
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, onUpdate);
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
    // Every zoom path is a user gesture (pinch, ctrl+wheel) — restore() sets
    // userZoom directly, so a mount never fires this.
    this.onUserGesture?.();
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

  private stopGlide() {
    this.glideVx = 0;
    this.glideVy = 0;
    this.panTween = undefined;
  }

  /**
   * Smoothly centre the camera on a world rect (a clicked SFT, so its
   * popover opens in the middle of the view). Any touch or wheel cancels it,
   * same as a glide.
   */
  panToWorldRect(world: WorldRect) {
    const camera = this.scene.cameras.main;
    this.stopGlide();
    this.panTween = {
      fromX: camera.scrollX,
      fromY: camera.scrollY,
      // Phaser convention (see projectWorldRect): the camera's world
      // midpoint is scroll + width/2 — zoom scales around it, so the /zoom
      // does NOT belong here. Centre the rect by putting its midpoint there.
      toX: camera.clampX(world.x + world.width / 2 - camera.width / 2),
      toY: camera.clampY(world.y + world.height / 2 - camera.height / 2),
      elapsed: 0,
    };
  }

  /** Convert the release gesture's recent travel into a glide velocity. */
  private startGlide(samples: PanSample[]) {
    if (samples.length < 2) return;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = last.time - first.time;
    if (dt <= 0) return;

    const zoom = this.scene.cameras.main.zoom;
    // Drag moves scroll by -delta/zoom, so the glide continues at the same
    // rate in the same direction (buffer px/ms -> world px/ms).
    let vx = -(last.x - first.x) / dt / zoom;
    let vy = -(last.y - first.y) / dt / zoom;

    const speed = Math.hypot(vx, vy);
    if (speed < GLIDE_MIN_SPEED) return;
    const maxSpeed = (GLIDE_MAX_SPEED_CSS * DPR) / zoom;
    if (speed > maxSpeed) {
      vx *= maxSpeed / speed;
      vy *= maxSpeed / speed;
    }
    this.glideVx = vx;
    this.glideVy = vy;
  }

  /** Advance the momentum glide each frame; friction decays it to rest. */
  private tickGlide(delta: number) {
    if (this.panTween) {
      this.tickPanTween(delta);
      return;
    }
    if (this.glideVx === 0 && this.glideVy === 0) return;
    if (this.panSuspended) {
      this.stopGlide();
      return;
    }

    const camera = this.scene.cameras.main;
    // clampX/clampY apply the same bounds the render pass would; zeroing the
    // clamped axis stops an invisible glide "past" the board edge.
    const targetX = camera.scrollX + this.glideVx * delta;
    const targetY = camera.scrollY + this.glideVy * delta;
    const clampedX = camera.clampX(targetX);
    const clampedY = camera.clampY(targetY);
    camera.scrollX = clampedX;
    camera.scrollY = clampedY;
    if (clampedX !== targetX) this.glideVx = 0;
    if (clampedY !== targetY) this.glideVy = 0;

    const decay = Math.pow(GLIDE_DECAY_PER_MS, delta);
    this.glideVx *= decay;
    this.glideVy *= decay;
    if (Math.hypot(this.glideVx, this.glideVy) < GLIDE_MIN_SPEED) {
      this.stopGlide();
    }

    this.anchors.reprojectAll();
  }

  /** Ease the centre-on-node pan (easeOutCubic, like the DOM's smooth scroll). */
  private tickPanTween(delta: number) {
    const tween = this.panTween;
    if (!tween) return;
    tween.elapsed = Math.min(tween.elapsed + delta, CENTER_PAN_MS);
    const t = tween.elapsed / CENTER_PAN_MS;
    const eased = 1 - Math.pow(1 - t, 3);

    const camera = this.scene.cameras.main;
    camera.scrollX = tween.fromX + (tween.toX - tween.fromX) * eased;
    camera.scrollY = tween.fromY + (tween.toY - tween.fromY) * eased;
    if (tween.elapsed >= CENTER_PAN_MS) this.panTween = undefined;

    this.anchors.reprojectAll();
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
