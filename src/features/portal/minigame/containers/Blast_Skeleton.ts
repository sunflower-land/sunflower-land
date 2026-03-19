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
const MIN_NEXT_MOVE = RESTORE_SPEED + 3000;
const MAX_NEXT_MOVE = RESTORE_SPEED + 5000;

export class Blast_Skeleton extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private food: Phaser.GameObjects.Sprite;
  private tomatoBomb: Phaser.GameObjects.Sprite;
  private bombBody!: Phaser.Physics.Arcade.Body;
  private isDefeated: boolean = false;
  private isHit: boolean = false;
  private skeletonTimer?: Phaser.Time.TimerEvent;
  private spawnX: number;
  private spawnY: number;
  private health_bar: Phaser.GameObjects.Image;
  private health_status: string;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.spawnX = x;
    this.spawnY = y;
    this.spriteName = "blast_skeleton";
    this.health_status = "health";

    this.sprite = this.scene.add
      .sprite(0, 0, `${this.spriteName}_walk`)
      .setScale(1.2)
      .setVisible(false);
    this.food = this.scene.add
      .sprite(0, +5, `${this.spriteName}_tomato`)
      .setVisible(false);
    this.tomatoBomb = this.scene.add
      .sprite(0, 0, `${this.spriteName}_tomato_screenSplat`)
      .setVisible(false);
    this.health_bar = this.scene.add
      .image(0, -20, `${this.health_status}_full`)
      .setScale(0.8)
      .setVisible(false);
    this.add([this.sprite, this.tomatoBomb, this.food, this.health_bar]);

    // Physics
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body)
      .setSize(this.sprite.width, this.sprite.height)
      .setOffset(-this.sprite.width / 2, -this.sprite.height / 2);
    this.sprite.setActive(false);

    scene.physics.add.existing(this.tomatoBomb);
    this.bombBody = this.tomatoBomb.body as Phaser.Physics.Arcade.Body;
    this.bombBody.setAllowGravity(false);
    this.bombBody.setImmovable(true);
    this.bombBody.enable = false;

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
      const targetY = this.player.y - 40;
      this.setDepth(1000);
      this.sprite.setActive(true);
      this.scene.time.delayedCall(200, () => {
        this.sprite.setVisible(true);
        createAnimation(
          this.scene,
          this.sprite,
          `${this.spriteName}_emerge`,
          "emerge",
          0,
          10,
          8,
          0,
        );
        this.scene.sound.add("blast_emerge", { volume: 0.3 }).play();
        this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          if (!this.isDefeated) {
            this.createBlast(targetX, targetY);
            this.scheduleAction();
          }
        });
      });
    });
  }

  private createBlast(targetX: number, targetY: number) {
    if (!this.player) return;
    this.isDefeated = false;

    (this.body as Phaser.Physics.Arcade.Body).enable = true;

    let jumpFrameRate;

    switch (true) {
      case this.player.x < 250:
      case this.player.x > 350:
        jumpFrameRate = 15;
        break;
      case this.player.y < 310:
        jumpFrameRate = 8;
        break;
      case this.player.y > 310:
        jumpFrameRate = 15;
        break;
      default:
        jumpFrameRate = 15;
    }
    this.sprite.anims.timeScale = jumpFrameRate / 8;
    createAnimation(
      this.scene,
      this.sprite,
      `${this.spriteName}_walk`,
      "walk",
      0,
      5,
      8,
      -1,
    );

    this.health_bar.setVisible(true);
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
          6,
          20,
          0,
        );

        this.sprite.setVisible(false);
        this.health_bar.setVisible(false);

        this.food.once("animationcomplete", () => {
          this.bombBody.enable = true;
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
          this.scene.sound.add("blast_splat", { volume: 0.2 }).play();
        });
        this.sprite.setVisible(false);
        this.sprite.setActive(false);
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
    if (this.isDefeated || !this.sprite.active) return;
    this.isDefeated = true;

    this.health_bar.setTexture(`${this.health_status}_low`);
    createAnimation(
      this.scene,
      this.sprite,
      "sniper_skeleton_death",
      "death",
      0,
      4,
      4,
      0,
    );
    this.scene.sound.add("death", { volume: 0.3 }).play();

    this.scene.time.delayedCall(800, () => {
      this.skeletonTimer?.remove(false);
      this.sprite.setVisible(false);
      this.food.setVisible(false);
      this.tomatoBomb.setVisible(false);
      this.health_bar.setVisible(false);
      this.sprite.setActive(false);

      this.scene.tweens.killTweensOf(this.sprite);
      this.scene.tweens.killTweensOf(this.tomatoBomb);

      (this.body as Phaser.Physics.Arcade.Body).enable = false;
      (this.tomatoBomb.body as Phaser.Physics.Arcade.Body).enable = false;

      this.scene.time.delayedCall(5000, () => {
        this.respawn();
      });
    });
  }

  private respawn() {
    if (!this.player) return;
    this.isDefeated = false;
    this.isHit = false;

    const finalX =
      this.spawnX +
      (this.player.x <= 300 ? -1 : 1) * Phaser.Math.Between(10, 50);
    this.setPosition(finalX, this.spawnY);

    const randomHS = Phaser.Utils.Array.GetRandom(["full", "half"]);
    this.health_bar.setTexture(`${this.health_status}_${randomHS}`);
    this.health_bar.setVisible(false);
    this.sprite.setTexture(`${this.spriteName}_idle`);

    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this.scheduleAction();
  }
}
