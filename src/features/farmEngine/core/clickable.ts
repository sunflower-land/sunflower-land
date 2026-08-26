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
};

export function makeClickable(
  _scene: Phaser.Scene,
  obj: ClickableObject,
  onClick: () => void,
  { onHoverChange }: ClickableOptions = {},
) {
  // Containers must have set their own hit area before this.
  if (!obj.input) {
    obj.setInteractive({ useHandCursor: true });
  }

  obj.on("pointerdown", onClick);

  if (onHoverChange) {
    obj.on("pointerover", () => onHoverChange(true));
    obj.on("pointerout", () => onHoverChange(false));
  }
}
