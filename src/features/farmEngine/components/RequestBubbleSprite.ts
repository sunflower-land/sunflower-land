import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { formatNumber } from "lib/utils/formatNumber";
import { queueImage } from "../core/assets";
import { pixelText } from "./pixelText";

/**
 * In-scene item-request bubble [animals/RequestBubble.tsx]: the speech
 * nineslice (slices 2/2/4/5, tail on the left edge) around an item icon and
 * an optional "xN" count. Used by animals asking for food/medicine/love.
 *
 * DOM geometry, in world px: the icon renders at its CSS size divided by
 * PIXEL_SCALE (ANIMAL_REQUEST_IMAGES widths are CSS px, ~6 world px — NOT
 * native art size), the content row is pulled 3px into the tail border
 * (marginLeft -3), and the count is the Basic face at the DOM's text-xxs
 * (20px / 12px line-height).
 */

const SLICE = { left: 5, right: 2, top: 2, bottom: 4 };
/** [RequestBubble.tsx] content marginLeft: -PIXEL_SCALE * 3. */
const CONTENT_MARGIN_LEFT = -3;
/** [styles.css --text-xxs-line-height] in world px. */
const LABEL_LINE_HEIGHT = 12 / PIXEL_SCALE;
/**
 * The Basic face's last glyph inks past its measured advance and canvas text
 * clips there (DOM text doesn't) — pad the canvas on the right, but lay out
 * by the advance so the bubble stays DOM-sized.
 */
const LABEL_PAD_RIGHT = 6;

export class RequestBubbleSprite {
  readonly container: Phaser.GameObjects.Container;
  private bubble?: Phaser.GameObjects.NineSlice;
  private image?: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;
  private iconWidth: number;

  constructor(
    scene: Phaser.Scene,
    options: {
      x: number;
      y: number;
      /** Item icon texture (already queued by the caller). */
      icon: string;
      /** Icon width in world px [RequestBubble ANIMAL_REQUEST_IMAGES / PIXEL_SCALE]. */
      iconWidth: number;
      quantity?: number;
      depth: number;
    },
  ) {
    const { x, y, icon, iconWidth, quantity, depth } = options;
    this.iconWidth = iconWidth;
    const children: Phaser.GameObjects.GameObject[] = [];

    if (scene.textures.exists(SUNNYSIDE.ui.speechBorder)) {
      this.bubble = scene.add
        .nineslice(
          0,
          0,
          SUNNYSIDE.ui.speechBorder,
          undefined,
          SLICE.left + SLICE.right,
          SLICE.top + SLICE.bottom,
          SLICE.left,
          SLICE.right,
          SLICE.top,
          SLICE.bottom,
        )
        .setOrigin(0, 0);
      children.push(this.bubble);
    }

    // Width-driven like the DOM's `w-full` img — height follows the art's
    // aspect ratio.
    if (scene.textures.exists(icon)) {
      this.image = scene.add.image(0, 0, icon).setOrigin(0, 0.5);
      this.image.setScale(iconWidth / this.image.width);
      children.push(this.image);
    }

    if (quantity !== undefined) {
      this.label = pixelText(scene, 0, 0, `x${formatNumber(quantity)}`, {
        color: "#000000",
        fontFamily: "Basic",
        fontSize: 20,
        shadow: false,
      }).setOrigin(0, 0.5);
      this.label.setPadding(0, 0, LABEL_PAD_RIGHT, 0);
      children.push(this.label);
    }

    this.layout();
    // Canvas text measures with the fallback face until the webfont is in
    // memory — force the load and re-fit the bubble around the true width
    // (fonts.ready is not enough: it can resolve before this face is ever
    // requested).
    if (this.label && typeof document !== "undefined" && document.fonts?.load) {
      try {
        void document.fonts.load("20px Basic").then(() => {
          if (this.label?.active) {
            this.label.updateText();
            this.layout();
          }
        });
      } catch {
        // fallback metrics stand
      }
    }

    this.container = scene.add.container(x, y, children).setDepth(depth);
  }

  /** Fit the nineslice around the content and place the row [RequestBubble]. */
  private layout() {
    const iconSpan = this.image ? this.iconWidth : 0;
    const labelSpan = this.label
      ? this.label.displayWidth - LABEL_PAD_RIGHT / PIXEL_SCALE
      : 0;
    const innerWidth = Math.max(0, CONTENT_MARGIN_LEFT + iconSpan + labelSpan);
    const innerHeight = Math.max(
      this.image ? this.image.displayHeight : 0,
      this.label ? LABEL_LINE_HEIGHT : 0,
    );
    this.bubble?.setSize(
      innerWidth + SLICE.left + SLICE.right,
      innerHeight + SLICE.top + SLICE.bottom,
    );

    // +0.75: the DOM's content rides slightly low in the frame (measured
    // against the React render — the 2/4 top/bottom borders aren't optically
    // even).
    const middle = SLICE.top + innerHeight / 2 + 0.75;
    const contentX = SLICE.left + CONTENT_MARGIN_LEFT;
    this.image?.setPosition(contentX, middle);
    this.label?.setPosition(contentX + iconSpan, middle);
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
