import { getResolvedFontFamily } from "lib/utils/fonts";
import { isAsciiText } from "lib/utils/textSupport";

export class SpeechBubble extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  bubble: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, text: string, direction: "left" | "right") {
    super(scene, 0, 0);
    this.scene = scene;

    const MAX_WIDTH = 100;

    // The "pixelmix" bitmap font is a fixed image atlas, not a real font -
    // scripts it has no glyphs for (Cyrillic, CJK, etc.) render blank, so
    // those fall back to a real font instead (see createFallbackText).
    this.text = isAsciiText(text)
      ? this.createBitmapText(text, MAX_WIDTH)
      : this.createFallbackText(text, MAX_WIDTH);

    const bounds = this.text.getBounds();

    this.bubble = (this.scene.add as any).rexNinePatch2({
      x: bounds.centerX - 0.3,
      y: bounds.centerY + 0.5,
      width: bounds.width + 6,
      height: bounds.height + 4,
      key: "speech_bubble",
      columns: [5, 2, 2],
      rows: [2, 3, 4],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.bubble.setScale(direction === "right" ? 1 : -1, 1);

    this.add(this.bubble);
    this.add(this.text);

    this.bubble.setAlpha(0.8);

    this.setPosition(
      direction === "right" ? 2 : -bounds.width,
      -bounds.height - 12,
    );
  }

  private createBitmapText(text: string, maxWidth: number) {
    const MAX_CHARS_PER_LINE = 40;

    return this.scene.add
      .bitmapText(
        0,
        0,
        "pixelmix",
        this.wordWrap(text, MAX_CHARS_PER_LINE),
        3.5,
      )
      .setMaxWidth(maxWidth);
  }

  // Real (non-bitmap) font for scripts the pixel atlas can't render. Reads
  // the player's font settings so it matches whatever they picked for the
  // rest of the UI (see FontSettings.tsx / lib/utils/fonts.ts) - read fresh
  // rather than cached, since that choice can change while the world scene
  // is already running.
  private createFallbackText(text: string, maxWidth: number) {
    const fontFamily = getResolvedFontFamily();

    return this.scene.add
      .text(0, 0, text, {
        fontFamily,
        fontSize: "5px",
        color: "#181425",
        resolution: 4,
      })
      .setWordWrapWidth(maxWidth, true);
  }

  // Method to wrap text with a max number of characters per line
  private wordWrap(text: string, maxCharsPerLine: number): string {
    const words = text.split(" ");
    let wrappedText = "";
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += word + " ";
      } else {
        wrappedText += currentLine.trim() + "\n";
        currentLine = word + " ";
      }
    });

    wrappedText += currentLine.trim();
    return wrappedText;
  }

  public changeDirection(direction: "right" | "left") {
    this.bubble.setScale(direction === "right" ? 1 : -1, 1);
    const bounds = this.text.getBounds();
    this.setPosition(
      direction === "right" ? 2 : -bounds.width,
      -bounds.height - 12,
    );
  }
}
