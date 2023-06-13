export class SpeechBubble extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, text: string) {
    super(scene, 0, -14);
    this.scene = scene;

    const MAX_WIDTH = 40;
    // const textR = scene.add
    //   .text(0, -25, text, {
    //     font: "100px Monospace",
    //     lineSpacing: -2,
    //     color: "#000000",
    //     wordWrap: { width: MAX_WIDTH },
    //   })
    //   .setResolution(100)
    //   .setScale(0.1);
    const textR = scene.add
      .bitmapText(0, 0, "pixelmix", text, 80)
      .setScale(0.05)
      .setMaxWidth(MAX_WIDTH);

    const bounds = textR.getBounds();

    // const width = Math.min(bounds.width, MAX_WIDTH) + 6;
    // const border = (this.scene.add as any).rexNinePatch({
    //   x: bounds.centerX,
    //   y: bounds.centerY + 1,
    //   width,
    //   height: bounds.height + 4,
    //   key: "speech_bubble",
    //   columns: [5, 2, 2],
    //   rows: [2, 3, 4],
    //   baseFrame: undefined,
    //   getFrameNameCallback: undefined,
    // });
    const bubble = (this.scene.add as any).rexNinePatch({
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

    this.add(bubble);
    this.add(textR);

    this.setPosition(0, -bounds.height - 10);

    this.setAlpha(0.8);
  }
}
