import type Phaser from "phaser";

/**
 * The engine's clickable affordance: hand cursor + click + hover callback.
 * Deliberately NO visual hover effect for now (a scale-up was tried and
 * rejected); when a treatment is chosen it goes here so every interactive
 * world object picks it up at once.
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

  obj.on("pointerdown", () => {
    // Normal world interactions are inert in landscaping mode [Land.tsx
    // swaps to READONLY components]; selection is the controller's job.
    const flags = scene as {
      landscapingActive?: boolean;
      visitingActive?: boolean;
    };
    if (flags.landscapingActive) return;
    if (flags.visitingActive && !visitClickable) return;
    onClick();
  });

  if (onHoverChange) {
    obj.on("pointerover", () => onHoverChange(true));
    obj.on("pointerout", () => onHoverChange(false));
  }
}
