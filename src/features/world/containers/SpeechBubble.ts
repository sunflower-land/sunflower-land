export class SpeechBubble extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.BitmapText;
  bubble: Phaser.GameObjects.BitmapText;
  constructor(scene: Phaser.Scene, text: string, direction: "left" | "right") {
    super(scene, 0, 0);
    this.scene = scene;

    const MAX_WIDTH = 40;
    this.text = scene.add
      .bitmapText(0, 0, "pixelmix", text, 3.5)
      .setMaxWidth(MAX_WIDTH);

    const bounds = this.text.getBounds();

    this.bubble = (this.scene.add as any).rexNinePatch({
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

  public changeDirection(direction: "right" | "left") {
    this.bubble.setScale(direction === "right" ? 1 : -1, 1);
    const bounds = this.text.getBounds();
    this.setPosition(
      direction === "right" ? 2 : -bounds.width,
      -bounds.height - 12,
    );
  }
}
