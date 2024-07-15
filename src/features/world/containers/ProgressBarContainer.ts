import { SpriteComponent } from "../components/SpriteComponent";
import { TextComponent } from "../components/TextComponent";

export class ProgressBarContainer extends Phaser.GameObjects.Container {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;

  sprite: SpriteComponent;
  bar: Phaser.GameObjects.Graphics | undefined;
  background: Phaser.GameObjects.Graphics | undefined;

  constructor({
    container,
    scene,
  }: {
    container: Phaser.GameObjects.Container;
    scene: Phaser.Scene;
  }) {
    super(scene, 0, 16);
    this.container = container;
    this.scene = scene;

    this.sprite = new SpriteComponent({
      container: this,
      sprite: "world/empty_bar.png",
      key: "empty_progress",
      scene: this.scene,
    });

    this.background = this.scene.add.graphics().setDepth(0);
    this.bar = this.scene.add.graphics().setDepth(1);

    this.background.fillStyle(0x193c3e, 1);
    this.background.fillRect(0, 0, 14, 4);

    const progress = 0.25;

    this.bar.fillStyle(0x63c74d, 1);
    this.bar.fillRect(0, 0, 14 * progress, 4);

    this.add(this.background);
    this.add(this.bar);

    this.container.add(this);
  }

  // Progress the bar
  update() {}
}
