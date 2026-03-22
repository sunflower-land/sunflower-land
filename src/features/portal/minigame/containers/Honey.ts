import { HONEY_TARGET_Y } from "../Constants";
import { Scene } from "../Scene";
import { Enemy } from "../Types";
import { createAnimation } from "../lib/Utils";

interface Props {
  x: number;
  y: number;
  scene: Scene;
}

export class Honey extends Phaser.GameObjects.Container {
  scene: Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private isThrowing = false;

  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;

    this.sprite = this.scene.add.sprite(0, 0, "honey");
    this.add(this.sprite);
    this.setDepth(2000);

    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    // Overlaps
    this.createOverlaps();

    this.scene.add.existing(this);
    this.setVisible(false);
  }

  private createOverlaps() {
    this.scene.physics.add.overlap(
      this,
      this.scene.allEnemies,
      (honey: any, enemy: any) => {
        (enemy as Enemy).defeat();
      }
    );
  }

  public throw() {
    if (this.isThrowing) return;
    this.isThrowing = true;

    this.setVisible(true);

    this.scene.tweens.add({
      targets: this,
      y: HONEY_TARGET_Y,
      duration: 1000,
      ease: "Cubic.out",
      onComplete: () => {
        this.splat();
      },
    });
  }

  private splat() {
    const spriteName = "honey_screenSplat";
    this.sprite.setTexture(spriteName);
    this.setDepth(1);
    (this.body as Phaser.Physics.Arcade.Body)
      .setSize(this.sprite.width, this.sprite.height)
      .setOffset(-this.sprite.width / 2, -this.sprite.height / 2);
    (this.body as Phaser.Physics.Arcade.Body).enable = true;

    createAnimation(
      this.scene,
      this.sprite,
      spriteName,
      "splat",
      0,
      3,
      15,
      0,
    );

    this.sprite.once("animationcomplete", () => {
      (this.body as Phaser.Physics.Arcade.Body).enable = false;
      this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.destroy();
        }
      });
    });
  }
}
