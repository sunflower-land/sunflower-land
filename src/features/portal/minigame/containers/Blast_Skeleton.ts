import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../lib/Utils";
import { HAT_IMMUNITY, WALKING_SPEED } from "../Constants";
import { MachineInterpreter } from "../lib/Machine";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

const RESTORE_SPEED = 3000;
const MIN_NEXT_MOVE = RESTORE_SPEED + 1000;
const MAX_NEXT_MOVE = MIN_NEXT_MOVE + 4000;

export class Blast_Skeleton extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private food: Phaser.GameObjects.Sprite;
  private tomatoBomb: Phaser.GameObjects.Sprite;
  private isDefeated: boolean = false;
  private isHit: boolean = false;
  private skeletonTimer?: Phaser.Time.TimerEvent;
  private spawnX: number;
  private spawnY: number;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.spriteName = "sniper_skeleton";
    this.spawnX = x;
    this.spawnY = y;

    this.sprite = this.scene.add
      .sprite(0, 0, `${this.spriteName}_idle`)
      .setScale(1.2)
      .setVisible(false);
    this.food = this.scene.add
      .sprite(0, +5, `${this.spriteName}_tomato`)
      .setVisible(false);
    this.tomatoBomb = this.scene.add
      .sprite(0, 0, `${this.spriteName}_tomato_screenSplat`)
      .setVisible(false);
    this.add([this.sprite, this.tomatoBomb, this.food]);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body)
      .setSize(this.sprite.width, this.sprite.height)
      .setOffset(-this.sprite.width / 2, -this.sprite.height / 2);

    // Enemy
    this.scheduleAction();

    // Overlaps
    this.createOverlaps();

    // Events
    this.createEvents();

    scene.add.existing(this);
  }

  public get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private scheduleAction() {
    if (this.isDefeated) return;
    const delay = Phaser.Math.Between(MIN_NEXT_MOVE, MAX_NEXT_MOVE);
    this.skeletonTimer = this.scene.time.delayedCall(delay, () => {
      if (!this.player) return;
      const targetX = this.player.x;
      const targetY = this.player.y - 20;

      this.scene.time.delayedCall(200, () => {
        this.createBlast(targetX, targetY);
        this.scheduleAction();
      });
    });
  }

  private createBlast(targetX: number, targetY: number) {
    if (!this.player) return;

    this.scene.physics.add.existing(this.tomatoBomb);
    const body = this.tomatoBomb.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    this.tomatoBomb.setVisible(false);
    this.sprite.setVisible(true);
    this.food.setVisible(true);
    this.setDepth(10000);

    this.scene.add.tween({
      targets: this,
      x: targetX,
      y: targetY,
      duration: 2000,
      ease: "Quad.Out",
      onComplete: () => {
        if (this.isDefeated) return;
        createAnimation(
          this.scene,
          this.food,
          `${this.spriteName}_tomato_rolling`,
          "tomato_rolling",
          0,
          7,
          20,
          0,
        );

        this.sprite.setVisible(false);

        this.food.once("animationcomplete", () => {
          body.enable = true;
          this.food.setVisible(false);
          this.tomatoBomb.setVisible(true);
          createAnimation(
            this.scene,
            this.tomatoBomb,
            `${this.spriteName}_tomato_screenSplat`,
            "tomato_screenSplat",
            0,
            4,
            20,
            0,
          );
        });
        this.tomatoBomb.once("animationcomplete", () => {
          this.createReset();
        });
      },
    });
  }

  private createReset() {
    if (this.isDefeated) return;
    this.scene.time.delayedCall(1000, () => {
      if (!this.player || this.isDefeated) return;
      // const finalX = this.spawnX + (this.player.x <= 300 ? -1 : 1) * Phaser.Math.Between(10, 50);
      this.setPosition(this.spawnX, this.spawnY);
      this.tomatoBomb.setVisible(false);
      this.food.setTexture(`${this.spriteName}_tomato`);
      this.food.setVisible(false);
      (this.tomatoBomb.body as Phaser.Physics.Arcade.Body).enable = false;
      this.sprite.setVisible(false);
    });

    this.restorePlayer();
  }

  private createOverlaps() {
    if (!this.player) return;
    this.scene.physics.add.overlap(this.player, this.tomatoBomb, () => {
      if (this.isHit) return;
      this.handleImmunity();
      this.isHit = true;
      this.tomatoBomb.setVisible(true);
      (this.tomatoBomb.body as Phaser.Physics.Arcade.Body).enable = false;
      // this.scene.tweens.killTweensOf(this);
      this.restorePlayer();
    });
  }

  private restorePlayer() {
    this.scene.time.delayedCall(RESTORE_SPEED, () => {
      this.scene.velocity = WALKING_SPEED;
      this.isHit = false;
    });
  }

  private handleImmunity() {
    if (!this.player || this.isHit) return;

    const hat = this.player.clothing.hat;
    const debuffSpeed = WALKING_SPEED / 3;

    if (!hat) {
      this.scene.velocity = debuffSpeed;
    } else if (HAT_IMMUNITY.includes(hat)) {
      this.scene.velocity = WALKING_SPEED;
    } else {
      this.scene.velocity = debuffSpeed;
    }
  }

  private createDamage() {}

  private createEvents() {}

  public defeat() {
    if (this.isDefeated || !this.sprite.visible) return;
    this.isDefeated = true;

    this.skeletonTimer?.remove(false);
    this.sprite.setVisible(false);
    this.food.setVisible(false);
    this.tomatoBomb.setVisible(false);

    this.scene.tweens.killTweensOf(this.sprite);
    this.scene.tweens.killTweensOf(this.tomatoBomb);

    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    (this.tomatoBomb.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.time.delayedCall(2000, () => {
      this.respawn();
    });
  }

  private respawn() {
    if (!this.player) return;
    this.isDefeated = false;
    this.isHit = false;

    this.setPosition(this.spawnX, this.spawnY);

    this.sprite.setTexture(`${this.spriteName}_idle`);
    this.sprite.setVisible(false);
    this.food.setVisible(false);
    this.tomatoBomb.setVisible(false);

    (this.body as Phaser.Physics.Arcade.Body).enable = true;
    (this.tomatoBomb.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scheduleAction();
  }
}
