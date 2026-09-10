import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import flipIcon from "assets/icons/flip.webp";
import flippedIcon from "assets/icons/flipped.webp";
import pixelPerfectIcon from "assets/icons/pixel_perfect.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import type { LandscapingControls } from "../bridge/GameBridge";
import { queueImage } from "../core/assets";
import type { WorldRect } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { applyHoverGlow, clearHoverGlow } from "../core/hoverGlow";
import { fitWidth } from "../core/pixelArt";

/**
 * The selected-entity controls in landscaping mode — the flip / pixel-perfect
 * / remove disc row and the four pixel-nudge arrows [MovableComponent].
 *
 * These ride the world: they hang off the selection box and pan and zoom with
 * it, so by the engine's boundary rule they are Phaser, not React. They lived
 * in the DOM overlay (overlay/LandscapingUI.tsx SelectionDiscs) anchored
 * through useWorldAnchor, which meant screen-space DOM chasing a world-space
 * box every time the camera moved.
 *
 * The overlap-disambiguation menu stays React — it's a menu, not world
 * furniture, and the architecture doc calls for it as an anchored overlay.
 *
 * Input note: `makeClickable` is deliberately inert while landscaping is
 * active (world entities must not respond to normal clicks in edit mode), so
 * these wire their own pointer handlers. `pressed` lets the controller's
 * scene-level pointerdown ignore a press that landed on a control — Phaser
 * emits GAMEOBJECT_DOWN before POINTER_DOWN, so the flag is always set in
 * time — otherwise clicking a disc would also BLUR the very selection it
 * belongs to.
 */

const DISC = 18;
const DISC_GAP = 3;
/** The disc row sits at the box's right edge, this far above its top. */
const ROW_ABOVE = 20;
const ICON = 12;
const ARROW = 9;
/** Gap between the box edge and a nudge arrow. */
const ARROW_OUT = 10;

/** Above the selection tint and drag preview (ALWAYS_ON_TOP + 102/103). */
const CONTROL_DEPTH = DEPTHS.ALWAYS_ON_TOP + 110;

export type SelectionControlsState = {
  box: WorldRect;
  /** Flip is offered for collectibles and the two bumpkin kinds. */
  hasFlip: boolean;
  isFlipped: boolean;
  canRemove: boolean;
  controls: LandscapingControls | null;
};

export type SelectionControlsHandlers = {
  onFlip(): void;
  onTogglePixelPerfect(): void;
  /** Called on the SECOND press; the first only arms the confirm icon. */
  onRemove(): void;
};

export class SelectionControls {
  private objects: Phaser.GameObjects.Image[] = [];
  private signature = "";
  private confirmRemove = false;
  private state: SelectionControlsState | undefined;

  /** True while a press that started on a control is still unresolved. */
  pressed = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly handlers: SelectionControlsHandlers,
  ) {}

  /** Queue every icon the row can show; call before the first sync. */
  static queueAssets(scene: Phaser.Scene) {
    [
      SUNNYSIDE.icons.disc,
      SUNNYSIDE.icons.confirm,
      SUNNYSIDE.icons.arrow_up,
      SUNNYSIDE.icons.arrow_down,
      SUNNYSIDE.icons.arrow_left,
      SUNNYSIDE.icons.arrow_right,
      flipIcon,
      flippedIcon,
      pixelPerfectIcon,
      ITEM_DETAILS["Rusty Shovel"].image,
    ].forEach((url) => queueImage(scene, url));
  }

  /** A new entity is selected: drop any half-armed remove confirmation. */
  reset() {
    this.confirmRemove = false;
    this.signature = "";
  }

  sync(state: SelectionControlsState) {
    this.state = state;
    const { controls } = state;
    // Rebuild only when the SET of controls changes; a plain move just
    // repositions, so hover and the armed confirm survive a drag.
    const signature = [
      state.hasFlip,
      state.isFlipped,
      state.canRemove,
      this.confirmRemove,
      controls?.pixelPerfect,
      controls?.canNudge.up,
      controls?.canNudge.down,
      controls?.canNudge.left,
      controls?.canNudge.right,
    ].join("|");

    if (signature !== this.signature) {
      this.signature = signature;
      this.build(state);
    }
    this.position(state);
  }

  hide() {
    this.clear();
    this.state = undefined;
    this.signature = "";
    this.confirmRemove = false;
    this.pressed = false;
  }

  destroy() {
    this.hide();
  }

  // ----- internals ---------------------------------------------------------

  private clear() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }

  private build(state: SelectionControlsState) {
    this.clear();
    const { controls } = state;

    if (state.hasFlip) {
      this.addDisc(state.isFlipped ? flippedIcon : flipIcon, () =>
        this.handlers.onFlip(),
      );
    }
    if (controls) {
      this.addDisc(
        pixelPerfectIcon,
        () => this.handlers.onTogglePixelPerfect(),
        controls.pixelPerfect,
      );
    }
    if (state.canRemove) {
      this.addDisc(
        this.confirmRemove
          ? SUNNYSIDE.icons.confirm
          : ITEM_DETAILS["Rusty Shovel"].image,
        () => {
          // [MovableComponent] two-step: arm, then commit.
          if (!this.confirmRemove) {
            this.confirmRemove = true;
            this.signature = "";
            if (this.state) this.sync(this.state);
            return;
          }
          this.confirmRemove = false;
          this.handlers.onRemove();
        },
      );
    }

    if (controls?.pixelPerfect) {
      const { canNudge } = controls;
      // Game y is inverted: visually up is +y [publishControls].
      if (canNudge.up) this.addArrow(SUNNYSIDE.icons.arrow_up, 0, 1);
      if (canNudge.down) this.addArrow(SUNNYSIDE.icons.arrow_down, 0, -1);
      if (canNudge.left) this.addArrow(SUNNYSIDE.icons.arrow_left, -1, 0);
      if (canNudge.right) this.addArrow(SUNNYSIDE.icons.arrow_right, 1, 0);
    }
  }

  /** disc background + centred icon; the background carries the input. */
  private addDisc(icon: string, onPress: () => void, active = false) {
    if (!this.scene.textures.exists(SUNNYSIDE.icons.disc)) return;
    const disc = this.scene.add
      .image(0, 0, SUNNYSIDE.icons.disc)
      .setOrigin(0, 0)
      .setDepth(CONTROL_DEPTH);
    fitWidth(disc, DISC);

    const glyph = this.scene.textures.exists(icon)
      ? this.scene.add
          .image(0, 0, icon)
          .setOrigin(0.5, 0.5)
          .setDepth(CONTROL_DEPTH + 1)
      : undefined;
    if (glyph) fitWidth(glyph, ICON);

    this.wire(disc, onPress, () => glyph);
    if (active) applyHoverGlow(this.scene, disc);

    // Tagged so `position` can walk the flat list in pairs.
    disc.setData("control", "disc");
    this.objects.push(disc);
    if (glyph) {
      glyph.setData("control", "glyph");
      this.objects.push(glyph);
    }
  }

  private addArrow(icon: string, dx: number, dy: number) {
    if (!this.scene.textures.exists(icon)) return;
    const arrow = this.scene.add
      .image(0, 0, icon)
      .setOrigin(0.5, 0.5)
      .setDepth(CONTROL_DEPTH);
    fitWidth(arrow, ARROW);
    this.wire(arrow, () => this.state?.controls?.nudge(dx, dy));
    arrow.setData("control", "arrow");
    arrow.setData("dx", dx);
    arrow.setData("dy", dy);
    this.objects.push(arrow);
  }

  private wire(
    object: Phaser.GameObjects.Image,
    onPress: () => void,
    glow?: () => Phaser.GameObjects.Image | undefined,
  ) {
    object.setInteractive({ useHandCursor: true });
    // Press-to-act, unlike world entities: these are UI, there is no pan to
    // disambiguate from, and the controller must know immediately so it
    // doesn't treat the same press as a selection drag.
    object.on("pointerdown", () => {
      this.pressed = true;
      onPress();
    });
    object.on("pointerup", () => {
      this.pressed = false;
    });
    object.on("pointerover", () => {
      applyHoverGlow(this.scene, object);
      const extra = glow?.();
      if (extra) applyHoverGlow(this.scene, extra);
    });
    object.on("pointerout", () => {
      clearHoverGlow(object);
      const extra = glow?.();
      if (extra) clearHoverGlow(extra);
    });
    object.once("destroy", () => clearHoverGlow(object));
  }

  /** Lay the row out from the box's top-right, arrows around its edges. */
  private position(state: SelectionControlsState) {
    const { box } = state;
    let x = box.x + box.width;
    const y = box.y - ROW_ABOVE;

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const kind = object.getData("control");
      if (kind === "disc") {
        object.setPosition(x, y);
        // The glyph, when present, is the next entry.
        const glyph = this.objects[i + 1];
        if (glyph?.getData("control") === "glyph") {
          glyph.setPosition(x + DISC / 2, y + DISC / 2);
        }
        x += DISC + DISC_GAP;
      } else if (kind === "arrow") {
        const dx = object.getData("dx") as number;
        const dy = object.getData("dy") as number;
        const centreX = box.x + box.width / 2;
        const centreY = box.y + box.height / 2;
        if (dy > 0) object.setPosition(centreX, box.y - ARROW_OUT);
        else if (dy < 0)
          object.setPosition(centreX, box.y + box.height + ARROW_OUT);
        else if (dx < 0) object.setPosition(box.x - ARROW_OUT, centreY);
        else object.setPosition(box.x + box.width + ARROW_OUT, centreY);
      }
    }
  }
}
