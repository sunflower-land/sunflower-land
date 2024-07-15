export class TextComponent {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;
  text: string;

  constructor({
    container,
    text,
    scene,
  }: {
    container: Phaser.GameObjects.Container;
    text: string;
    scene: Phaser.Scene;
  }) {
    this.container = container;
    this.scene = scene;
    this.text = text;

    this.update();
  }

  update() {
    const text = this.scene.add.text(0, 0, this.text, {
      fontSize: "4px",
      fontFamily: "monospace",
      resolution: 4,
      padding: { x: 2, y: 2 },
      color: "#ffffff",
    });
    this.container.add(text);
  }
}
