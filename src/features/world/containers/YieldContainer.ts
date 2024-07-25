import { AnimatedProps } from "react-spring";
import {
  AnimatedSprite,
  SpriteComponent,
  SpriteProps,
} from "../components/SpriteComponent";
import { TextComponent } from "../components/TextComponent";

export class YieldContainer extends Phaser.GameObjects.Container {
  container: Phaser.GameObjects.Container;
  scene: Phaser.Scene;
  key: string;

  text: TextComponent;
  sprite?: SpriteComponent;

  amount: number = 0;

  constructor({
    container,
    key,
    sprite,
    scene,
  }: {
    container: Phaser.GameObjects.Container;
    key: string;
    sprite?: Pick<SpriteProps, "animation" | "sprite">;
    scene: Phaser.Scene;
  }) {
    super(scene, 6, -12);
    this.container = container;
    this.scene = scene;
    this.key = key;

    this.setDepth(1000000);

    if (sprite) {
      this.sprite = new SpriteComponent({
        animation: sprite.animation,
        container: this,
        key: key,
        scene: this.scene,
        sprite: sprite.sprite,
      });
    }

    this.text = new TextComponent({
      container: this,
      text: `+${this.amount.toString()}`,
      scene: this.scene,
    });

    this.container.add(this);

    // this.setVisible(true);
    this.setVisible(false);
  }

  async show(amount: number) {
    this.amount = amount;

    // Fade in and out
    this.setVisible(true);

    if (this.sprite?.animation) {
      this.sprite?.startAnimation();
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.setVisible(false);
  }

  update() {
    // Do a fade effect
  }
}
