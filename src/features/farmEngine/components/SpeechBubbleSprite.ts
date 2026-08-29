import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { queueImage } from "../core/assets";

/**
 * In-scene speech bubble [TravelTeaser.tsx Pete hint]: the DOM renders a
 * nine-slice `speechBorder` (slices 2/2/4/5 — the fat left edge carries the
 * tail) around tiny uppercase Teeny text (#262b45). Game-layer content, so
 * Phaser.
 */

const SLICE = { left: 5, right: 2, top: 2, bottom: 4 };
const TEXT_COLOR = "#262b45";
const PAD_X = 3;
const BUBBLE_HEIGHT = 10;

export class SpeechBubbleSprite {
  readonly container: Phaser.GameObjects.Container;
  readonly width: number;

  constructor(
    scene: Phaser.Scene,
    options: {
      x: number;
      y: number;
      text: string;
      depth: number;
      /** Mirror the tail to the right side (DOM scaleX(-1) usage). */
      flip?: boolean;
    },
  ) {
    const { x, y, text, depth, flip } = options;

    const label = scene.add
      .text(0, 0, text.toUpperCase(), {
        // Teeny at 10 CSS px, drawn at 4x and counter-scaled for crispness.
        fontFamily: "Teeny, monospace",
        fontSize: "40px",
        color: TEXT_COLOR,
        resolution: 2,
      })
      .setScale(1 / PIXEL_SCALE / 1.52)
      .setOrigin(0, 0.5);

    const textWidth = label.width / PIXEL_SCALE / 1.52;
    this.width = Math.max(textWidth + PAD_X * 2 + SLICE.left, 14);

    const children: Phaser.GameObjects.GameObject[] = [];
    const borderTexture = SUNNYSIDE.ui.speechBorder;
    if (scene.textures.exists(borderTexture)) {
      const bubble = scene.add
        .nineslice(
          0,
          0,
          borderTexture,
          undefined,
          this.width,
          BUBBLE_HEIGHT + SLICE.top + SLICE.bottom,
          SLICE.left,
          SLICE.right,
          SLICE.top,
          SLICE.bottom,
        )
        .setOrigin(0, 0);
      if (flip) {
        bubble.setScale(-1, 1).setOrigin(1, 0);
      }
      children.push(bubble);
    }
    label.setPosition(SLICE.left + PAD_X - 2, SLICE.top + BUBBLE_HEIGHT / 2);
    children.push(label);

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
