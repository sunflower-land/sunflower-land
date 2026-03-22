import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../lib/Utils";
import { SHOES_IMMUNITY } from "../Constants";
import { MachineInterpreter } from "../lib/Machine";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

const SNIPER_MIN_CREATE = 4000;
const SNIPER_MAX_CREATE = 6000;
const DEBUFF_DURATION = 3000;

export class Sniper_Skeleton extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private vege: Phaser.GameObjects.Sprite;
  private playerWorldX_Sprite?: number;
  private vegeName: string;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.spriteName = "sniper";
    this.vegeName = "tomato";

    // Sprites
    this.sprite = this.scene.add
      .sprite(0, 0, `${this.spriteName}_idle`)
      .setScale(1);
    this.vege = this.scene.add
      .sprite(0, 0, `${this.spriteName}_${this.vegeName}`)
      .setScale(1)
      .setVisible(false);
    this.add([this.sprite, this.vege]);
    this.sprite.setVisible(false);

    // Physics
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.sprite.width,
      this.sprite.height,
    );

    // Setup
    this.scheduleSniper();
    this.createOverlaps();

    scene.add.existing(this);
  }

  public get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private scheduleSniper() {
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(SNIPER_MIN_CREATE, SNIPER_MAX_CREATE),
      callback: this.glitchEffect,
      callbackScope: this,
      loop: true,
    });
  }

  private glitchEffect(duration: number = 150) {
    if (!this.player) return;
    this.sprite.setVisible(true);

    const sprite = this.sprite;
    const originalX = this.player.getWorldTransformMatrix().tx - this.x;
    const originalY = sprite.y;
    const originalScaleX = sprite.scaleX;
    const originalScaleY = sprite.scaleY;

    this.scene.tweens.add({
      targets: sprite,
      onStart: () => {
        this.scene.sound.play("sniper_spawn", { volume: 0.2 });
      },
      x: originalX + Phaser.Math.Between(-4, 4),
      y: originalY + Phaser.Math.Between(-4, 4),
      scaleX: originalScaleX + Phaser.Math.FloatBetween(-0.08, 0.08),
      scaleY: originalScaleY + Phaser.Math.FloatBetween(-0.08, 0.08),
      alpha: Phaser.Math.FloatBetween(0.7, 1),
      duration: 30,
      yoyo: true,
      repeat: Math.floor(duration / 30),
      ease: "steps(2)",
      onComplete: () => {
        sprite.setPosition(originalX, originalY);
        sprite.setScale(originalScaleX, originalScaleY);
        sprite.setAlpha(1);
        this.createSniper();
      },
    });

    if (sprite.anims) {
      this.scene.time.addEvent({
        delay: 20,
        repeat: 5,
        callback: () => {
          const randomFrame = Phaser.Math.Between(0, 3);
          sprite.setFrame(randomFrame);
        },
      });
    }
  }

  private createSniper() {
    if (!this.player) return;

    this.playerWorldX_Sprite = this.player.getWorldTransformMatrix().tx;
    this.vege.setTexture(`${this.spriteName}_${this.vegeName}`);
    this.vege.setVisible(true);

    const flipX = this.player.x < this.x ? true : false;
    const switchSide =
      flipX === true
        ? this.playerWorldX_Sprite - this.x + 10
        : this.playerWorldX_Sprite - this.x - 10;
    flipX === true ? this.vege.setFlipX(true) : this.vege.setFlipX(false);
    this.sprite.setFlipX(flipX);

    this.sprite.setPosition(this.playerWorldX_Sprite - this.x, 0);
    this.vege.setPosition(switchSide, 0);

    this.scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body
      .setSize(this.sprite.width, this.sprite.height)
      .setCollideWorldBounds(true)
      .setImmovable(true);

    this.setSize(this.sprite.width, this.sprite.height);
    this.setDepth(10);

    createAnimation(
      this.scene,
      this.sprite,
      `${this.spriteName}_attack`,
      "attack",
      0,
      3,
      4,
      0,
    );

    this.scene.time.delayedCall(300, () => {
      this.throwVege();
    });
  }

  private throwVege() {
    if (!this.player) return;

    this.vege.setVisible(true);
    this.setDepth(100);
    this.scene.physics.add.existing(this.vege);
    const vegeBody = this.vege.body as Phaser.Physics.Arcade.Body;
    vegeBody.enable = false;
    vegeBody.setSize(0, this.vege.height * 2);
    vegeBody.setOffset(3, 6);

    const playerWorldX = this.player.getWorldTransformMatrix().tx;
    const playerWorldY = this.player.getWorldTransformMatrix().ty;
    const flipX = this.player.x < this.x ? true : false;
    const targetX =
      flipX === true ? playerWorldX - this.x : playerWorldX - this.x;
    const throwSpeed = playerWorldY < 297 ? 250 : 300;

    this.scene.add.tween({
      targets: this.vege,
      x: targetX,
      y: playerWorldY - this.y,
      duration: throwSpeed,
      ease: "Quad.Out",
      onComplete: () => {
        createAnimation(
          this.scene,
          this.vege,
          `${this.spriteName}_${this.vegeName}_splatter`,
          "tomato_splatter",
          0,
          4,
          20,
          0,
        );
        this.scene.sound.add("splat", { volume: 0.2 }).play();
        vegeBody.enable = true;
        this.sprite.setVisible(false);
      },
    });

    this.scene.time.delayedCall(15000, () => {
      this.resetSniper();
    });
  }

  private resetSniper() {
    this.vege.setVisible(false);
    (this.vege.body as Phaser.Physics.Arcade.Body).enable = false;
    (this.sprite.body as Phaser.Physics.Arcade.Body).enable = false;
    this.vege.setTexture(`${this.spriteName}_${this.vegeName}`);
  }

  private createOverlaps() {
    if (!this.player) return;

    this.scene.physics.add.overlap(this.vege, this.player, () => {
      this.vege.setVisible(false);
      this.handleImmunity();
      (this.vege.body as Phaser.Physics.Arcade.Body).enable = false;
      (this.sprite.body as Phaser.Physics.Arcade.Body).enable = false;
    });
  }

  private handleImmunity() {
    if (!this.player) return;

    const shoe = this.player.clothing.shoes;

    if (!shoe) {
      this.scene.isControlInverted = true;
    } else if (SHOES_IMMUNITY.includes(shoe)) {
      this.scene.isControlInverted = false;
    } else {
      this.scene.isControlInverted = true;
    }

    this.restorePlayer();
  }

  private restorePlayer() {
    this.scene.time.delayedCall(
      DEBUFF_DURATION,
      () => (this.scene.isControlInverted = false),
    );
  }

  private createDamage() {}
  private createEvents() {}

  public defeat() {
    if (!this.sprite.visible) return;
    this.sprite.setVisible(false);
    this.vege.setVisible(false);
  }
}
