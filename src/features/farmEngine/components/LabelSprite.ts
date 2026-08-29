import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { queueImage } from "../core/assets";
import { pixelText } from "./pixelText";

/**
 * In-scene label chip — the game-layer stand-in for components/ui/Label.tsx
 * (icon + short text on a small panel). Anything drawn ON the game layer is
 * Phaser; only hover popovers and modals stay React.
 *
 * The DOM Label = background colour + 2px nine-slice border image
 * [LABEL_STYLES + pixel*BorderStyle]; the border renders as a Phaser
 * NineSlice when its texture is loaded (call LabelChip.queueAssets first).
 */

export type LabelChipType = "default" | "danger" | "transparent";

const CHIP_STYLE: Record<
  LabelChipType,
  { background?: number; text: string; border?: () => string }
> = {
  // [Label.tsx LABEL_STYLES]
  default: {
    background: 0xc0cbdc,
    text: "#181425",
    border: () => SUNNYSIDE.ui.grayBorder,
  },
  danger: {
    background: 0xe43b44,
    text: "#ffffff",
    border: () => SUNNYSIDE.ui.redBorder,
  },
  transparent: { text: "#ffffff" },
};

/** The DOM's borderWidth is PIXEL_SCALE*2 CSS px = 2 source px. */
const BORDER = 2;

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
        .rectangle(0, 0, this.width, CHIP_HEIGHT, style.background, 1)
        .setOrigin(0, 0);
      children.push(background);
    }
    const borderTexture = style.border?.();
    if (borderTexture && scene.textures.exists(borderTexture)) {
      // borderImage `url(...) 20%` on a 2px border [style.ts].
      const source = scene.textures.get(borderTexture).getSourceImage();
      const slice = Math.max(1, Math.round(source.width * 0.2));
      const border = scene.add
        .nineslice(
          -BORDER,
          -BORDER,
          borderTexture,
          undefined,
          this.width + BORDER * 2,
          CHIP_HEIGHT + BORDER * 2,
          slice,
          slice,
          slice,
          slice,
        )
        .setOrigin(0, 0);
      children.push(border);
    }
    if (iconImage) children.push(iconImage);
    children.push(label);

    this.container = scene.add.container(x, y, children).setDepth(depth);
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  /** Queue the border art; call before constructing chips. */
  static queueAssets(scene: Phaser.Scene) {
    queueImage(scene, SUNNYSIDE.ui.grayBorder);
    queueImage(scene, SUNNYSIDE.ui.redBorder);
  }

  destroy() {
    this.container.destroy();
  }
}
