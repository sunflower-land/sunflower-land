import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import { queueImage } from "../core/assets";
import { nativeScale } from "../core/pixelArt";
import { pixelText } from "./pixelText";

/**
 * In-scene item-request bubble [animals/RequestBubble.tsx]: the speech
 * nineslice (slices 2/2/4/5, tail on the left edge) around an item icon and
 * an optional "xN" count. Used by animals asking for food/medicine/love.
 */

const SLICE = { left: 5, right: 2, top: 2, bottom: 4 };
const PAD = 2;

export class RequestBubbleSprite {
  readonly container: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    options: {
      x: number;
      y: number;
      /** Item icon texture (already queued by the caller). */
      icon: string;
      /** Icon width in source px [RequestBubble ANIMAL_REQUEST_IMAGES]. */
      iconWidth: number;
      quantity?: number;
      depth: number;
    },
  ) {
    const { x, y, icon, iconWidth, quantity, depth } = options;
    const children: Phaser.GameObjects.GameObject[] = [];

    // Native pixels [core/pixelArt.ts]; the bubble sizes to whatever the art
    // actually is rather than resampling it to fit.
    const image = scene.textures.exists(icon)
      ? scene.add.image(0, 0, icon).setOrigin(0, 0.5)
      : undefined;
    if (image) nativeScale(image);

    const label =
      quantity !== undefined
        ? pixelText(scene, 0, 0, `x${formatNumber(quantity)}`, {
            color: "#191d2c",
          }).setOrigin(0, 0.5)
        : undefined;

    const iconSpan = image ? image.displayWidth : 0;
    const labelSpan = label ? label.displayWidth + 1 : 0;
    const innerWidth = iconSpan + labelSpan;
    const innerHeight = Math.max(image ? image.displayHeight : 0, 8);
    const width = innerWidth + PAD * 2 + SLICE.left + SLICE.right;
    const height = innerHeight + SLICE.top + SLICE.bottom;

    if (scene.textures.exists(SUNNYSIDE.ui.speechBorder)) {
      const bubble = scene.add
        .nineslice(
          0,
          0,
          SUNNYSIDE.ui.speechBorder,
          undefined,
          width,
          height,
          SLICE.left,
          SLICE.right,
          SLICE.top,
          SLICE.bottom,
        )
        .setOrigin(0, 0);
      children.push(bubble);
    }

    const middle = SLICE.top + innerHeight / 2;
    if (image) {
      image.setPosition(SLICE.left + PAD - 1, middle);
      children.push(image);
    }
    if (label) {
      label.setPosition(SLICE.left + PAD - 1 + iconSpan + 1, middle);
      children.push(label);
    }

    this.container = scene.add.container(x, y, children).setDepth(depth);
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  static queueAssets(scene: Phaser.Scene) {
    queueImage(scene, SUNNYSIDE.ui.speechBorder);
  }

  destroy() {
    this.container.destroy();
  }
}
