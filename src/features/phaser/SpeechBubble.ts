export class SpeechBubble extends Phaser.GameObjects.Container {
  public bubble;
  constructor(scene: Phaser.Scene, text: string) {
    super(scene);
    this.scene = scene;

    // const bitmapText = this.scene.make.bitmapText({
    //   font: "8bitoperator",
    //   size: 22,
    // });

    const MAX_WIDTH = 50;
    // const textR = scene.add.bitmapText(4, -20, "pixel", "Hello World", 3);
    const textR = scene.add
      .text(4, -21.5, text, {
        font: "6px Monospace",
        color: "#000000",
        wordWrap: { width: MAX_WIDTH },
      })
      .setResolution(10);

    this.bubble = this.scene.add.container(0, 0);

    console.log({ bounds: textR.getBounds() });

    const bounds = textR.getBounds();
    // const border = this.scene.make.tileSprite({
    //   x: 8,
    //   y: 8,
    //   width: 16,
    //   height: 16,

    //   key: "tileset",
    //   frame: 4,
    // });

    const border = this.scene.add.rexNinePatch({
      x: 14,
      y: -17,
      width: Math.min(bounds.width, MAX_WIDTH) + 6,
      height: bounds.height + 4,
      key: "speech_bubble",
      columns: [5, 2, 2], // leftWidth: undefined, rightWidth: undefined,
      rows: [2, 3, 4], // topHeight: undefined, bottomHeight: undefined,

      // preserveRatio: true,
      // maxFixedPartScale: 1,
      // stretchMode: 0,
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.bubble.add(border);
    this.bubble.add(textR);
    // let width = 27;
    // let height = 18;

    // var bounds = bitmapText.getBounds();
    // if (bounds.width + 18 > width) {
    //   width = bounds.width + 18;
    // }
    // if (bounds.height + 14 > height) {
    //   height = bounds.height + 14;
    // }

    // // Create all of our corners and edges
    // const borders = [
    //   this.scene.make.tileSprite({
    //     x: 9,
    //     y: 9,
    //     width: 9,
    //     height: 9,
    //     key: "bubble-border",
    //   }),

    //   this.scene.make.image({ x: 0, y: 0, key: "bubble-border" }),
    // ];

    // // Add all of the above to this sprite
    // for (var b = 0, len = borders.length; b < len; b++) {
    //   this.bubble.addChild(borders[b]);
    // }

    // // Add the tail
    // this.tail = this.addChild(
    //   game.make.image(x + 18, y + 3 + height, "bubble-tail")
    // );

    // // Add our text last so it's on top
    // this.addChild(this.bitmapText);
    // this.bitmapText.tint = 0x111111;

    // // Offset the position to be centered on the end of the tail
    // this.pivot.set(x + 25, y + height + 24);

    console.log("Doine");
  }
}
