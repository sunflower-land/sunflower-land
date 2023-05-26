export class SpeechBubble extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, text: string) {
    super(scene, 0, 0);
    this.scene = scene;

    const MAX_WIDTH = 40;
    const textR = scene.add
      .text(0, -25, text, {
        font: "5px Monospace",
        lineSpacing: -2,
        color: "#000000",
        wordWrap: { width: MAX_WIDTH },
      })
      .setResolution(100);

    const bounds = textR.getBounds();

    const width = Math.min(bounds.width, MAX_WIDTH) + 6;
    const border = (this.scene.add as any).rexNinePatch({
      x: bounds.centerX,
      y: bounds.centerY + 1,
      width,
      height: bounds.height + 4,
      key: "speech_bubble",
      columns: [5, 2, 2],
      rows: [2, 3, 4],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.add(border);
    this.add(textR);

    this.setAlpha(0.8);
  }
}
