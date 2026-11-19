import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { isAsciiText } from "lib/utils/textSupport";
import { queueImage } from "../core/assets";
import { DPR } from "../core/rendering";

/**
 * The DOM `NPCSpeechBubble` [features/game/components/NPCSpeechBubble.tsx]
 * at its own metrics: the `speechBorder` nine-slice (2/2/4/5 — the fat left
 * and bottom edges carry the tail) around one 12 CSS px line of uppercase
 * Teeny at 10 CSS px, words pulled 4 CSS px closer, at least 30 CSS px wide.
 */

/** CSS px -> source px. */
const css = (value: number) => value / PIXEL_SCALE;

/** Border widths, in source px [NPCSpeechBubble.tsx border*Width]. */
const BORDER = { top: 2, right: 2, bottom: 4, left: 5 };
const CONTENT_HEIGHT = css(12);
const MIN_WIDTH = css(30);
const TEXT_LEFT = css(4);
const WORD_SPACING = css(-4);
const FONT_PX = 10;
const TEXT_COLOR = "#262b45";

export class NPCSpeechBubbleSprite {
  readonly container: Phaser.GameObjects.Container;
  /** The whole bubble, border included, in world px. */
  readonly width: number;
  readonly height: number;

  constructor(
    scene: Phaser.Scene,
    options: {
      /** Top-left of the bubble's border box, world px. */
      x: number;
      y: number;
      text: string;
      depth: number;
    },
  ) {
    const { x, y, text, depth } = options;
    // Teeny only has printable-ASCII glyphs; other scripts use the UI face.
    const fontFamily = isAsciiText(text) ? "Teeny, monospace" : "Basic";
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily,
      fontSize: `${FONT_PX}px`,
      color: TEXT_COLOR,
      resolution: DPR * PIXEL_SCALE,
    };
    const make = (content: string) =>
      scene.add.text(0, 0, content, style).setScale(1 / PIXEL_SCALE);

    // Word spacing isn't a canvas text style, so each word is its own object.
    const probeJoined = make("aa");
    const probeSpaced = make("a a");
    const space = probeSpaced.displayWidth - probeJoined.displayWidth;
    probeJoined.destroy();
    probeSpaced.destroy();

    const words = text.toUpperCase().split(" ").map(make);
    let cursor = BORDER.left + TEXT_LEFT;
    const middle = BORDER.top + CONTENT_HEIGHT / 2;
    words.forEach((word, index) => {
      if (index > 0) cursor += space + WORD_SPACING;
      word.setOrigin(0, 0.5).setPosition(cursor, middle);
      cursor += word.displayWidth;
    });
    const textWidth = cursor - BORDER.left;

    this.width = Math.round(
      BORDER.left + Math.max(MIN_WIDTH, textWidth) + BORDER.right,
    );
    this.height = Math.round(BORDER.top + CONTENT_HEIGHT + BORDER.bottom);

    const children: Phaser.GameObjects.GameObject[] = [];
    const borderTexture = SUNNYSIDE.ui.speechBorder;
    if (scene.textures.exists(borderTexture)) {
      children.push(
        scene.add
          .nineslice(
            0,
            0,
            borderTexture,
            undefined,
            this.width,
            this.height,
            BORDER.left,
            BORDER.right,
            BORDER.top,
            BORDER.bottom,
          )
          .setOrigin(0, 0),
      );
    }
    children.push(...words);

    this.container = scene.add.container(x, y, children).setDepth(depth);

    // Re-measure once the webfont is in, so it doesn't keep the fallback.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        words.forEach((word) => word.active && word.updateText());
      });
    }
  }

  static queueAssets(scene: Phaser.Scene) {
    queueImage(scene, SUNNYSIDE.ui.speechBorder);
  }

  destroy() {
    this.container.destroy();
  }
}
