import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString, type TimeFormatLength } from "lib/utils/time";
import { outlinedText } from "./outlinedText";

/**
 * In-scene port of the DOM farm's ProgressBar (components/ui/ProgressBar.tsx):
 * the emptyBar frame (15x7 source px) with an 11x2 fill inset at (2,2), and
 * the time label in the `font-pixel` face ("Secondary") floating above.
 * Progress bars and inline timers are world-attached, so they render in
 * Phaser — not in the React overlay.
 *
 * Positioning matches the DOM: construct at the Bar div's top-left in world
 * units.
 */

const BAR = {
  width: 15,
  height: 7,
  innerWidth: 11,
  innerHeight: 2,
  marginTop: 2,
  marginLeft: 2,
};

const PROGRESS_COLORS: Record<
  string,
  { color: number; backgroundColor: number }
> = {
  progress: { color: 0x63c74d, backgroundColor: 0x193c3e },
  health: { color: 0x0099db, backgroundColor: 0x0d2f6d },
  error: { color: 0xe43b44, backgroundColor: 0x3e2731 },
  buff: { color: 0xb65389, backgroundColor: 0x193c3e },
  quantity: { color: 0xffb01e, backgroundColor: 0x543a2b },
};

export type ProgressBarType = keyof typeof PROGRESS_COLORS;

type Options = {
  /** World position of the bar's top-left. */
  x: number;
  y: number;
  type?: ProgressBarType;
  formatLength: TimeFormatLength;
  depth: number;
};

/** The webfont the DOM's `font-pixel` class resolves to. */

export class ProgressBarSprite {
  private container: Phaser.GameObjects.Container;
  private fill: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private readonly formatLength: TimeFormatLength;
  private destroyed = false;

  constructor(scene: Phaser.Scene, options: Options) {
    const { x, y, type = "progress", formatLength, depth } = options;
    this.formatLength = formatLength;
    const colors = PROGRESS_COLORS[type];

    const frame = scene.add.image(0, 0, SUNNYSIDE.ui.emptyBar).setOrigin(0, 0);
    frame.setScale(BAR.width / frame.width);

    const background = scene.add
      .rectangle(
        BAR.marginLeft,
        BAR.marginTop,
        BAR.innerWidth,
        BAR.innerHeight,
        colors.backgroundColor,
      )
      .setOrigin(0, 0);

    this.fill = scene.add
      .rectangle(
        BAR.marginLeft,
        BAR.marginTop,
        0,
        BAR.innerHeight,
        colors.color,
      )
      .setOrigin(0, 0);

    // Chunky display type with the black outline + hard drop, matching the
    // yield floats [outlinedText.ts] — Adam's call over the old pixel face.
    this.label = outlinedText(scene, BAR.width / 2, 1, "", {
      fontPx: 10,
      shadowOffsetY: 1,
    }).setOrigin(0.5, 1);

    this.container = scene.add
      .container(x, y, [frame, background, this.fill, this.label])
      .setDepth(depth);
  }

  /** Update fill + time label (DOM parity: fill floored to whole source px). */
  set(percentage: number, seconds: number) {
    const clamped = Math.max(0, Math.min(percentage, 100));
    this.fill.width = Math.floor((BAR.innerWidth * clamped) / 100);
    this.label.setText(
      seconds > 0
        ? secondsToString(seconds, {
            length: this.formatLength,
            isShortFormat: true,
          })
        : "",
    );
  }

  setVisible(visible: boolean) {
    this.container.setVisible(visible);
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  destroy() {
    this.destroyed = true;
    this.container.destroy();
  }
}
