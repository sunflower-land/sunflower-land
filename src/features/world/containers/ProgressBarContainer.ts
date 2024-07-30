import { PHASER_SCALE, SpriteComponent } from "../components/SpriteComponent";
import { TextComponent } from "../components/TextComponent";

export class ProgressBarContainer extends Phaser.GameObjects.Container {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;

  sprite: SpriteComponent;
  bar: Phaser.GameObjects.Graphics;
  startAt: number;
  endAt: number;

  constructor({
    container,
    scene,
    startAt,
    endAt,
    x = 0,
    y = 16,
  }: {
    container: Phaser.GameObjects.Container;
    scene: Phaser.Scene;
    startAt: number;
    endAt: number;
    x?: number;
    y?: number;
  }) {
    super(scene, x * PHASER_SCALE, y * PHASER_SCALE);
    this.container = container;
    this.scene = scene;

    this.bar = this.scene.add.graphics().setDepth(1);
    this.add(this.bar);

    this.sprite = new SpriteComponent({
      container: this,
      sprite: "world/empty_bar.png",
      key: "empty_progress",
      scene: this.scene,
    });

    this.startAt = startAt;
    this.endAt = endAt;

    this.container.add(this);

    this.update();
  }

  // Progress the bar
  update() {
    const total = this.endAt - this.startAt;
    const progress = Date.now() - this.startAt;
    const percentage = Math.min(progress / total, 1);

    this.bar.fillStyle(0x63c74d, 1);
    this.bar.fillRect(-7, -2, 14 * percentage, 4);
  }
}
