export class SpeechBubble extends Phaser.GameObjects.Container {
  text: Phaser.GameObjects.BitmapText;
  bubble: Phaser.GameObjects.BitmapText;
  constructor(scene: Phaser.Scene, text: string, direction: "left" | "right") {
    super(scene, 0, 0);
    this.scene = scene;

    const MAX_WIDTH = 40;
    this.text = scene.add
      .bitmapText(0, 0, "pixelmix", text, 80)
      .setScale(0.05)
      .setMaxWidth(MAX_WIDTH);

    const bounds = this.text.getBounds();

    this.bubble = (this.scene.add as any).rexNinePatch({
      x: bounds.centerX - 0.3,
      y: bounds.centerY + 1.9,
      width: bounds.width + 6,
      height: bounds.height + 6,
      key: "speech_bubble",
      columns: [5, 2, 2],
      rows: [2, 3, 4],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.bubble.setScale(direction === "right" ? 1 : -1, 1);

    this.add(this.bubble);
    this.add(this.text);

    this.setPosition(
      direction === "right" ? 2 : -bounds.width,
      -bounds.height - 14
    );

    this.setAlpha(0.8);
  }

  public changeDirection(direction: "right" | "left") {
    this.bubble.setScale(direction === "right" ? 1 : -1, 1);
    this.setPosition(direction === "right" ? 2 : -14, this.y);
  }
}
