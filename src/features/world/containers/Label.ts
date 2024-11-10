export class Label extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    text: string,
    type: "brown" | "grey" = "grey",
  ) {
    super(scene, 0, 0);
    this.scene = scene;

    const width = text.length * 4 - 1;

    const name = scene.add.bitmapText(
      -width / 2,
      1,
      "Teeny Tiny Pixls",
      text,
      5,
    );
    const bounds = name.getBounds();

    const label = (this.scene.add as any).rexNinePatch2({
      x: 0,
      y: 3.5,
      width: width + 6,
      height: 11,
      key: type === "brown" ? "brown_label" : "label",
      columns: [3, 3, 3],
      rows: [3, 3, 3],
      baseFrame: undefined,
      getFrameNameCallback: undefined,
    });

    this.add(label);
    this.add(name);

    this.setDepth(1);

    // if (icon) {
    // const sprite = scene.add.sprite(0, 0, "hammer");
    // sprite.setPosition(-2, -2);

    // this.add(sprite);
    // }
  }
}
