import { CHEST_LEFT_X, CHEST_RIGHT_X, CHEST_Y, CHEST_TRAVEL_DURATION } from "../Constants";
import { createAnimation } from "../lib/Utils";
import { PlayerFoodType } from "../Types";
import { Scene } from "../Scene";
import { PlayerFood } from "./PlayerFood";

interface Props {
  scene: Scene;
}

export class Chest extends Phaser.GameObjects.Container {
  scene: Scene;
  private sprite: Phaser.GameObjects.Sprite;
  public isOpened = false;

  constructor({ scene }: Props) {
    const startLeft = Math.random() < 0.5;
    const startX = startLeft ? CHEST_LEFT_X : CHEST_RIGHT_X;
    const endX = startLeft ? CHEST_RIGHT_X : CHEST_LEFT_X;

    super(scene, startX, CHEST_Y);
    this.scene = scene;

    this.sprite = this.scene.add.sprite(0, 0, "chest");
    this.sprite.setFlipX(!startLeft);
    this.add(this.sprite);
    this.setDepth(1);

    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width, this.sprite.height);
    body.setOffset(-this.sprite.width / 2, -this.sprite.height / 2);
    body.setImmovable(true);
    body.setAllowGravity(false);

    this.scene.add.existing(this);

    this.travel(endX);
  }

  public onFoodHit() {
    if (this.isOpened) return;
    this.isOpened = true;

    createAnimation(this.scene, this.sprite, "open_chest", "idle", 0, 4, 7, 0);
  }

  private travel(endX: number) {
    const fadeDelay = CHEST_TRAVEL_DURATION * 0.9;
    const fadeDuration = CHEST_TRAVEL_DURATION - fadeDelay;

    this.scene.tweens.add({
      targets: this,
      x: endX,
      duration: CHEST_TRAVEL_DURATION,
      ease: "Linear",
      onUpdate: () => {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.reset(this.x, this.y);
      },
      onComplete: () => {
        this.destroy();
      },
    });

    this.scene.tweens.add({
      targets: this.sprite,
      y: -3,
      duration: 600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      delay: fadeDelay,
      duration: fadeDuration,
      ease: "Sine.easeIn",
    });
  }
}
