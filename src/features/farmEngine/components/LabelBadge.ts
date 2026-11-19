import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { queueImage } from "../core/assets";
import { pixelText } from "./pixelText";

/**
 * The DOM `Label` [components/ui/Label.tsx] drawn in the scene at its own
 * metrics: the type's background + nine-slice border, `text-xs` body text,
 * and the icon hanging off the left edge the way `SquareIcon` places it.
 *
 * `LabelChip` [LabelSprite.ts] is the compact chip the farm's own in-world
 * hints use; this is for surfaces whose DOM screen shows real `Label`s over
 * the world (the Cave's patch status, expansion sign and dig feedback).
 */

export type LabelBadgeType = "default" | "success" | "warning";

/** [Label.tsx LABEL_STYLES] */
const STYLES: Record<
  LabelBadgeType,
  { background: number; text: string; border: () => string }
> = {
  default: {
    background: 0xc0cbdc,
    text: "#181425",
    border: () => SUNNYSIDE.ui.grayBorder,
  },
  success: {
    background: 0x3e8948,
    text: "#ffffff",
    border: () => SUNNYSIDE.ui.greenBorder,
  },
  warning: {
    background: 0xf09100,
    text: "#3e2731",
    border: () => SUNNYSIDE.ui.orangeBorder,
  },
};

/** CSS px -> source px. */
const css = (value: number) => value / PIXEL_SCALE;

/** [style.ts pixelizedBorderStyle] borderWidth PIXEL_SCALE * 2. */
const BORDER = 2;
/** [styles.css] text-xs: 24px type on a 14px line. */
const FONT_PX = 24;
const LINE_HEIGHT = css(14);
/** [Label.tsx] paddings, with and without an icon. */
const PAD = {
  left: css(3),
  right: css(3),
  iconLeft: css(14),
  iconRight: css(4),
};
/** [Label.tsx] the icon box: 9 source px wide, 12 CSS px left of the text box. */
const ICON_BOX = 9;
const ICON_LEFT = css(-12);

/**
 * [SquareIcon.tsx] how wide an icon draws inside its box, in source px:
 * small art at 1:1, mid-sized art fitted to the box, large art at its CSS
 * size — then narrowed when it is taller than wide.
 */
function iconDisplayWidth(width: number, height: number) {
  const largest = Math.max(width, height);
  let display = width;
  if (largest > ICON_BOX) {
    display = width < ICON_BOX * PIXEL_SCALE ? ICON_BOX : css(width);
    if (height > width) display *= width / height;
  }
  return display;
}

export class LabelBadge {
  readonly container: Phaser.GameObjects.Container;
  /** The label box in world px (the icon overhangs it on the left). */
  readonly width: number;
  readonly height: number;

  /**
   * The DOM label's exact height. The box is drawn on whole source pixels;
   * stacks of labels step by this so a column keeps the DOM's rhythm.
   */
  static readonly ROW_HEIGHT = BORDER * 2 + LINE_HEIGHT;

  constructor(
    scene: Phaser.Scene,
    options: {
      /** Top-left of the label box, world px. */
      x: number;
      y: number;
      text: string;
      type?: LabelBadgeType;
      icon?: string;
      depth: number;
    },
  ) {
    const { x, y, text, type = "default", icon, depth } = options;
    const style = STYLES[type];

    const label = pixelText(scene, 0, 0, text, {
      color: style.text,
      shadow: false,
      fontSize: FONT_PX,
      fontFamily: "Basic",
    });

    const padLeft = icon ? PAD.iconLeft : PAD.left;
    const padRight = icon ? PAD.iconRight : PAD.right;
    // Whole source pixels, so the border art keeps a 1:1 texel grid.
    this.width = Math.round(
      BORDER * 2 + padLeft + label.displayWidth + padRight,
    );
    this.height = Math.round(BORDER * 2 + LINE_HEIGHT);

    const children: Phaser.GameObjects.GameObject[] = [];

    // The DOM clips the background to the border's rounded corners.
    children.push(
      scene.add
        .rectangle(1, 1, this.width - 2, this.height - 2, style.background, 1)
        .setOrigin(0, 0),
    );

    const borderTexture = style.border();
    if (scene.textures.exists(borderTexture)) {
      // borderImage `url(...) 20%` [style.ts].
      const source = scene.textures.get(borderTexture).get();
      const slice = Math.max(1, Math.round(source.width * 0.2));
      children.push(
        scene.add
          .nineslice(
            0,
            0,
            borderTexture,
            undefined,
            this.width,
            this.height,
            slice,
            slice,
            slice,
            slice,
          )
          .setOrigin(0, 0),
      );
    }

    // The face sits low in its line box; lift it to the DOM's optical centre.
    label
      .setOrigin(0, 0.5)
      .setPosition(BORDER + padLeft, this.height / 2 - 0.4);
    children.push(label);

    if (icon && scene.textures.exists(icon)) {
      const image = scene.add
        .image(BORDER + ICON_LEFT + ICON_BOX / 2, this.height / 2, icon)
        .setOrigin(0.5, 0.5);
      const frame = image.frame;
      image.setScale(iconDisplayWidth(frame.width, frame.height) / frame.width);
      children.push(image);
    }

    this.container = scene.add.container(x, y, children).setDepth(depth);
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  /** Queue the border art; call before constructing badges. */
  static queueAssets(scene: Phaser.Scene) {
    queueImage(scene, SUNNYSIDE.ui.grayBorder);
    queueImage(scene, SUNNYSIDE.ui.greenBorder);
    queueImage(scene, SUNNYSIDE.ui.orangeBorder);
  }

  destroy() {
    this.container.destroy();
  }
}
