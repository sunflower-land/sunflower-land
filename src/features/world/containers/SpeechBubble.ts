export class SpeechBubble extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.BitmapText;
  bubble: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, text: string, direction: "left" | "right") {
    super(scene, 0, 0);
    this.scene = scene;

    const MAX_WIDTH = 100;
    const MAX_CHARS_PER_LINE = 40;
    const formattedText = this.wordWrap(text, MAX_CHARS_PER_LINE);

    this.text = scene.add
      .bitmapText(0, 0, "pixelmix", formattedText, 3.5)
      .setMaxWidth(MAX_WIDTH);

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
