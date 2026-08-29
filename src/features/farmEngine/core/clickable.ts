import type Phaser from "phaser";

/**
 * The engine's clickable affordance: hand cursor + click + hover callback.
 * Deliberately NO visual hover effect for now (a scale-up was tried and
 * rejected); when a treatment is chosen it goes here so every interactive
 * world object picks it up at once.
 *
 * Hover popovers are a browse affordance, not click feedback: after a click
 * the hover is cleared and stays suppressed until the pointer leaves and
 * re-enters, so acting on a node (plant, chop...) doesn't instantly pop the
 * timer tooltip over it. Touch taps never raise hover at all — Phaser fires
 * pointerover as part of the tap (pointer already down).
 */

type ClickableObject =
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Zone;

type ClickableOptions = {
  onHoverChange?: (hovered: boolean) => void;
  /**
   * Stay clickable while visiting another farm [MapPlacement
   * enableOnVisitClick] — everything else is click-dead on a visit.
   */
  visitClickable?: boolean;
};

export function makeClickable(
  scene: Phaser.Scene,
  obj: ClickableObject,
  onClick: () => void,
  { onHoverChange, visitClickable }: ClickableOptions = {},
) {
  // Containers must have set their own hit area before this.
  if (!obj.input) {
    obj.setInteractive({ useHandCursor: true });
  }

  let hoverSuppressed = false;

  obj.on("pointerdown", () => {
    // Normal world interactions are inert in landscaping mode [Land.tsx
    // swaps to READONLY components]; selection is the controller's job.
    const flags = scene as {
      landscapingActive?: boolean;
      visitingActive?: boolean;
    };
    if (flags.landscapingActive) return;
    if (flags.visitingActive && !visitClickable) return;
    if (onHoverChange) {
      hoverSuppressed = true;
      onHoverChange(false);
    }
    onClick();
  });

  if (onHoverChange) {
    obj.on("pointerover", (pointer: Phaser.Input.Pointer) => {
      // A held pointer entering is a tap or a pan crossing over, not a hover.
      if (hoverSuppressed || pointer.isDown) return;
      onHoverChange(true);
    });
    obj.on("pointerout", () => {
      hoverSuppressed = false;
      onHoverChange(false);
    });
  }
}
