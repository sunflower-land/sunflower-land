import type Phaser from "phaser";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelText } from "./pixelText";

/**
 * In-scene label chip — the game-layer stand-in for components/ui/Label.tsx
 * (icon + short text on a small panel). Anything drawn ON the game layer is
 * Phaser; only hover popovers and modals stay React.
 *
 * PARITY GAP: the DOM Label's pixel-art border is approximated with a flat
 * rounded panel for now.
 */

export type LabelChipType = "default" | "danger" | "transparent";

const CHIP_STYLE: Record<LabelChipType, { background?: number; text: string }> =
  {
    default: { background: 0xead4aa, text: "#3e2731" },
    danger: { background: 0xe43b44, text: "#ffffff" },
    transparent: { text: "#ffffff" },
  };

const PAD_X = 2;
const CHIP_HEIGHT = 8;
const ICON_GAP = 1;

export class LabelChip {
  readonly container: Phaser.GameObjects.Container;
  /** Total width in world px (for centring rows of chips). */
  readonly width: number;

  constructor(
    scene: Phaser.Scene,
    options: {
      x: number;
      y: number;
      text: string;
      icon?: string;
      /** Icon width in source px. */
      iconWidth?: number;
      type?: LabelChipType;
      depth: number;
    },
  ) {
    const {
      x,
      y,
      text,
      icon,
      iconWidth = 6,
      type = "default",
      depth,
    } = options;
    const style = CHIP_STYLE[type];

    const children: Phaser.GameObjects.GameObject[] = [];
    let cursor = PAD_X;

    let iconImage: Phaser.GameObjects.Image | undefined;
    if (icon) {
      iconImage = scene.add
        .image(cursor, CHIP_HEIGHT / 2, icon)
        .setOrigin(0, 0.5);
      iconImage.setScale(iconWidth / iconImage.width);
      cursor += iconWidth + ICON_GAP;
    }

    const label = pixelText(scene, cursor, CHIP_HEIGHT / 2, text, {
      color: style.text,
      shadow: type !== "default",
    });
    label.setOrigin(0, 0.5);
    cursor += label.width / PIXEL_SCALE + PAD_X;

    this.width = cursor;

    if (style.background !== undefined) {
      const background = scene.add
        .rectangle(0, 0, this.width, CHIP_HEIGHT, style.background, 0.95)
        .setOrigin(0, 0);
      children.push(background);
    }
    if (iconImage) children.push(iconImage);
    children.push(label);

    this.container = scene.add.container(x, y, children).setDepth(depth);
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  destroy() {
    this.container.destroy();
  }
}
