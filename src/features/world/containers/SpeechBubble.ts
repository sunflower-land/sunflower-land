export class SpeechBubble extends Phaser.GameObjects.Container {
  public bubble;
  constructor(scene: Phaser.Scene, text: string) {
    super(scene, 0, 0);
    console.log("SPEECH BUBBLE");
    this.scene = scene;

    // const bitmapText = this.scene.make.bitmapText({
    //   font: "8bitoperator",
    //   size: 22,
    // });

    const MAX_WIDTH = 70;
    // const textR = scene.add.bitmapText(4, -20, "pixel", "Hello World", 3);
    const textR = scene.add
      .text(4, -21.5, text, {
        font: "6px Monospace",
        color: "#000000",
        wordWrap: { width: MAX_WIDTH },
      })
      .setResolution(10);

    this.bubble = this.scene.add.container(0, 0).setAlpha(0.7);

    console.log({ bounds: textR.getBounds() });

    const bounds = textR.getBounds();

    const border = this.scene.add.rexNinePatch({
      x: 10,
      y: -15,
      width: Math.min(bounds.width, MAX_WIDTH) + 6,
      height: bounds.height + 4,
      key: "speech_bubble",
      columns: [5, 2, 2],
      rows: [2, 3, 4],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.add(border);
    this.add(textR);

    console.log("Doine");
  }
}
