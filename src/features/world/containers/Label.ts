export class Label extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    text: string,
    type: "brown" | "grey" = "grey"
  ) {
    super(scene, 0, 0);
    this.scene = scene;

    const name = scene.add.bitmapText(0, 0, "Small 5x3", text, 5);

    const bounds = name.getBounds();

    const label = (this.scene.add as any).rexNinePatch({
      x: bounds.centerX - 0.3,
      y: bounds.centerY + 1.9,
      width: bounds.width + 6,
      height: 10,
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
