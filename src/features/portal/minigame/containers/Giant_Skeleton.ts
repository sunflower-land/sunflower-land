import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../lib/Utils";
import { MachineInterpreter } from "../lib/Machine";
import { WINGS_IMMUNITY } from "../Constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

const MOVE_DISTANCE = -50;
const MIN_BARREL_THROW_DELAY = 4000;
const MAX_BARREL_THROW_DELAY = 6000;
const BARREL_RESET_DELAY = 2000;
const RESPAWN_DELAY = 5000;

export class Giant_Skeleton extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private barrel: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private direction: number = 1;
  private followGiant: boolean = true;
  public isDefeated: boolean = false;
  private barrelTimer?: Phaser.Time.TimerEvent;
  private health_bar: Phaser.GameObjects.Image;
  private health_status: string;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);

    this.scene = scene;
    this.player = player;
    this.spriteName = "giant";
    this.health_status = "health";

    // Sprites
    this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_idle`).setVisible(false);
    this.barrel = this.scene.add.sprite(0, -20, `${this.spriteName}_barrel`).setVisible(false);
    this.health_bar = this.scene.add.image(
      0,
      -30,
      `${this.health_status}_full`,
    ).setVisible(false);
    this.add([this.sprite, this.barrel, this.health_bar]);
    this.sprite.setActive(false);

    // Physics
    this.scene.physics.add.existing(this.barrel);
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setSize(
      this.sprite.width,
      this.sprite.height,
    );

    // Setup
    this.createGiant();
    this.createOverlaps();

    scene.add.existing(this);
  }

  public get portalService(): MachineInterpreter | undefined {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private createGiant() {
    if (!this.player) return;
    this.isDefeated = false;

    this.setSize(this.sprite.width, this.sprite.height);
    this.setDepth(0);

    createAnimation(
      this.scene,
      this.sprite,
      `${this.spriteName}_idle`,
      "idle",
      0,
      7,
      8,
      -1,
    );

    const moveLeft = this.x - MOVE_DISTANCE;
    const moveRight = 600;
    this.x = moveLeft;

    let prevX = this.x;

    this.scene.tweens.add({
      targets: this,
      x: moveRight,
      duration: 15000,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
      onUpdate: (tween, target: any) => {
        if (this.followGiant) {
          this.barrel.x = this.sprite.x;
          this.barrel.y = this.sprite.y - 15;
        }

        const dx = target.x - prevX;
        if (dx < 0) {
          this.sprite.setFlipX(true);
          this.barrel.setFlipX(true);
          this.direction = -1;
        } else if (dx > 0) {
          this.sprite.setFlipX(false);
          this.barrel.setFlipX(false);
          this.direction = 1;
        }
        prevX = target.x;
      },
    });

    this.scheduleNextBarrelThrow();
  }

  private scheduleNextBarrelThrow() {
    if (this.isDefeated) return;
    const delay = Phaser.Math.RND.between(
      MIN_BARREL_THROW_DELAY,
      MAX_BARREL_THROW_DELAY,
    );
    this.barrelTimer?.remove(false);
    this.barrelTimer = this.scene.time.delayedCall(delay, () => {
      if (this.isDefeated) return;
      this.scene.sound.add("giant_spawn", { volume: 0.2 }).play();
      createAnimation(
        this.scene,
        this.sprite,
        `${this.spriteName}_attack`,
        "attack",
        0,
        7,
        8,
        0,
      );
      this.scene.time.delayedCall(1000, () => {
        createAnimation(
          this.scene,
          this.sprite,
          `${this.spriteName}_idle`,
          "idle",
          0,
          7,
          8,
          -1,
        );
      });
      this.scene.time.delayedCall(500, () => {
        if (!this.isDefeated) {
          this.sprite.setActive(true);
          (this.body as Phaser.Physics.Arcade.Body).enable = true;
          this.throwBarrel();
        }
      });
    });
  }

  private throwBarrel() {
    if (!this.player) return;

    this.followGiant = false;
    this.sprite.setVisible(true);
    this.barrel.setVisible(true);
    this.health_bar.setVisible(true);

    const body = this.barrel.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    body.setCollideWorldBounds(false);
    body.setImmovable(true);

    this.setDepth(200);

    const distance = this.direction === 1 ? "+=150" : "-=150";
    const playerWorldY = this.player.getWorldTransformMatrix().ty;
    this.scene.sound.add("barrel", { volume: 0.2 }).play();
    const localY = (playerWorldY - this.y) / this.scaleY;
    this.scene.tweens.add({
      targets: this.barrel,
      props: {
        x: { value: distance, duration: 2500, ease: "Power4" },
        y: { value: `${localY}`, duration: 2000, ease: "Bounce" },
      },
      onComplete: () => this.resetBarrel(),
    });
  }

  private resetBarrel() {
    this.barrel.setVisible(false);
    this.barrel.setPosition(this.sprite.x, this.sprite.y - 20);
    (this.barrel.body as Phaser.Physics.Arcade.Body).enable = false;
    this.scene.tweens.killTweensOf(this.barrel);

    if (this.isDefeated) return;

    this.scene.time.delayedCall(BARREL_RESET_DELAY, () => {
      if (this.isDefeated) return;

      this.barrel.setVisible(true);
      (this.barrel.body as Phaser.Physics.Arcade.Body).enable = true;
      this.followGiant = true;

      this.scheduleNextBarrelThrow();
    });
  }

  private createOverlaps() {
    if (!this.player) return;

    const defaultScale = 1;

    this.scene.physics.add.collider(this, this.player);
    this.scene.physics.add.overlap(this.barrel, this.player, () => {
      this.player?.hurt();
      this.barrel.setVisible(false);
      this.handleImmunity();
      this.barrel.setPosition(this.sprite.x, this.sprite.y - 20);
      (this.barrel.body as Phaser.Physics.Arcade.Body).enable = false;

      this.scene.time.delayedCall(3000, () =>
        this.player?.setScale(defaultScale),
      );
    });
  }

  private handleImmunity() {
    if (!this.player) return;

    const wing = this.player.clothing.wings;
    const enlargePlayer = 1.5;
    const defaultScale = 1;

    if (!wing) {
      this.player.setScale(enlargePlayer);
    } else if (WINGS_IMMUNITY.includes(wing)) {
      this.player.setScale(defaultScale);
    } else {
      this.player.setScale(enlargePlayer);
    }
  }

  private createDamage() { }
  private createEvents() { }

  public defeat() {
    if (this.isDefeated || !this.sprite.active) return;
    this.isDefeated = true;

    this.portalService?.send("GAIN_POINTS", { points: 1 });

    this.scene.sound.add("giant_death", { volume: 0.3 }).play();
    this.health_bar.setTexture(`${this.health_status}_low`);
    createAnimation(
      this.scene,
      this.sprite,
      `${this.spriteName}_death`,
      "death",
      0,
      9,
      15,
      0,
    );

    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.time.delayedCall(800, () => {
      this.health_bar.setVisible(false);
      this.barrel.setVisible(false);
      this.sprite.setVisible(false);

      this.barrelTimer?.remove(false);
      this.sprite.setActive(false);

      this.scene.tweens.killTweensOf(this.sprite);
      this.scene.tweens.killTweensOf(this.barrel);

      (this.barrel.body as Phaser.Physics.Arcade.Body).enable = false;

      this.respawn();
    });
  }

  private respawn(delay: number = RESPAWN_DELAY) {
    this.scene.time.delayedCall(delay, () => {
      this.isDefeated = false;

      const moveLeft = this.x - MOVE_DISTANCE;
      this.x = moveLeft;

      const randomHS = Phaser.Utils.Array.GetRandom(["full", "half"]);
      this.health_bar.setTexture(`${this.health_status}_${randomHS}`);
      this.health_bar.setVisible(false);

      this.followGiant = true;

      this.scheduleNextBarrelThrow();
    });
  }
}
