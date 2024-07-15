import { SpriteComponent } from "../components/SpriteComponent";
import { TextComponent } from "../components/TextComponent";

export class YieldContainer extends Phaser.GameObjects.Container {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;
  key: string;
  url: string;

  sprite: SpriteComponent;
  text: TextComponent;

  amount: number = 0;

  constructor({
    container,
    key,
    sprite,
    scene,
  }: {
    container: Phaser.GameObjects.Container;
    key: string;
    sprite: string;
    scene: Phaser.Scene;
  }) {
    super(scene, 2, -8);
    this.container = container;
    this.scene = scene;
    this.key = key;
    this.url = sprite;

    this.sprite = new SpriteComponent({
      container: this,
      sprite: this.url,
      key: this.key,
      scene: this.scene,
    });

    this.text = new TextComponent({
      container: this,
      text: `+${this.amount.toString()}`,
      scene: this.scene,
    });

    this.container.add(this);

    this.setVisible(false);
  }

  async show(amount: number) {
    this.amount = amount;

    // Fade in and out
    this.setVisible(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.setVisible(false);
  }

  update() {
    // Do a fade effect
  }
}
