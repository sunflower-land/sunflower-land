import { BumpkinContainer } from "../Core/BumpkinContainer";
import { Scene } from "../Scene";
import { createAnimation } from "../lib/Utils";
import { MachineInterpreter } from "../lib/Machine";
import { AURA_IMMUNITY } from "../Constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  player?: BumpkinContainer;
}

const MENACE_MIN_CREATE = 4000;
const MENACE_MAX_CREATE = 8000;
const DEBUFF_DURATION = 4000;

export class Menace_Skeleton extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private vege: Phaser.GameObjects.Sprite;
  private randomVege: string;
  private vegeList: string[];
  private flipX: boolean = false;
  private randomThrow: number;
  public isDefeated: boolean = false;
  private skeletonTimer?: Phaser.Time.TimerEvent;
  private isHit: boolean = false;
  private static usedSlots: number[] = [];
  private static spawnPositions: { x: number; y: number }[] = [];
  private health_bar: Phaser.GameObjects.Image;
  private health_status: string;

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);

    this.scene = scene;
    this.player = player;
    this.spriteName = "sniper_skeleton";
    this.health_status = "health"

    this.vegeList = ["carrot", "cabbage", "potato"];
    this.randomVege = Phaser.Math.RND.pick(this.vegeList);
    this.randomThrow = Phaser.Math.Between(-50, 50);
    this.flipX = this.randomThrow <= 0;

    // Sprites
    this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_move`).setVisible(false);
    this.vege = this.scene.add.sprite(0, 0, `${this.spriteName}_${this.randomVege}`).setVisible(false);
    this.health_bar = this.scene.add.image(0, -20, `${this.health_status}_full`).setScale(0.8).setVisible(false);
    this.add([this.sprite, this.vege, this.health_bar]);

    // Physics
    this.scene.physics.add.existing(this); // container body
    const containerBody = this.body as Phaser.Physics.Arcade.Body;
    containerBody.setSize(this.sprite.width, this.sprite.height);
    containerBody.enable = false;

    this.scene.physics.add.existing(this.vege);
    const vegeBody = this.vege.body as Phaser.Physics.Arcade.Body;
    vegeBody.setSize(this.vege.width, this.vege.height).setAllowGravity(false).setImmovable(true);

    if (Menace_Skeleton.spawnPositions.length === 0) {
      Menace_Skeleton.generateSpawnPositions();
    }

    // Setup overlaps
    this.createOverlaps();

    // Start menace spawning
    this.scheduleMenace();

    scene.add.existing(this);
  }

  public get portalService(): MachineInterpreter | undefined {
    return this.scene.registry.get("portalService") as MachineInterpreter | undefined;
  }

  private scheduleMenace() {
    if (this.isDefeated) return;
    const delay = Phaser.Math.Between(MENACE_MIN_CREATE, MENACE_MAX_CREATE);
    this.skeletonTimer = this.scene.time.delayedCall(delay, () => {
      if (!this.isDefeated) {
        this.sprite.setActive(true);
        this.scene.sound.add("spawn", { volume: 0.2 }).play();
        this.createMenace();
        this.scheduleMenace();
      }
    });
  }

  private static generateSpawnPositions() {
    const minX = 150;
    const maxX = 450;
    const minY = 60;
    const maxY = 140;
    const gapX = 30;
    const gapY = 30;

    Menace_Skeleton.spawnPositions = [];

    for (let y = minY; y <= maxY; y += gapY) {
      for (let x = minX; x <= maxX; x += gapX) {
        Menace_Skeleton.spawnPositions.push({ x, y });
      }
    }
  }

  private getRandomPosition(): { x: number; y: number } {
    const available = Menace_Skeleton.spawnPositions.filter((_, index) =>
      !Menace_Skeleton.usedSlots.includes(index)
    );

    if (available.length === 0) {
      console.warn("All positions used, resetting list");
      Menace_Skeleton.usedSlots = [];
      return this.getRandomPosition();
    }

    const randomIndex = Phaser.Math.Between(0, available.length - 1);
    const pos = available[randomIndex];
    const originalIndex = Menace_Skeleton.spawnPositions.findIndex(
      p => p.x === pos.x && p.y === pos.y
    );

    Menace_Skeleton.usedSlots.push(originalIndex);
    return pos;
  }

  private createMenace() {
    if (!this.player) return;
    this.isDefeated = false;

    const { x, y } = this.getRandomPosition();
    this.setPosition(x, y);

    if (y > 100) {
      this.setDepth(500);
    } else {
      this.setDepth(10);
    }

    this.sprite.setVisible(true);
    this.health_bar.setVisible(true);
    (this.body as Phaser.Physics.Arcade.Body).enable = true;
    (this.vege.body as Phaser.Physics.Arcade.Body).enable = true;

    this.randomVege = Phaser.Math.RND.pick(this.vegeList);

    this.vege.setTexture(`${this.spriteName}_${this.randomVege}`);
    this.vege.setVisible(true);

    this.randomThrow = Phaser.Math.Between(-50, 50);
    this.flipX = this.randomThrow <= 0;

    const switchSide = this.flipX ? + 10 : - 10;
    this.vege.setFlipX(this.flipX);
    this.sprite.setFlipX(this.flipX);
    this.vege.setPosition(switchSide, 0);
    console.log("position", { x: this.vege.x, y: this.vege.y }, this.vege.body?.position);

    this.setSize(this.sprite.width, this.sprite.height);

    createAnimation(this.scene, this.sprite, `${this.spriteName}_attack`, "attack", 0, 3, 4, 0);

    this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.foodMovement()
    })
  }

  private foodMovement() {
    if (!this.player) return;

    this.sprite.anims.remove(`${this.spriteName}_attack_attack_anim`);

    const playerWorldY = this.player.getWorldTransformMatrix().ty;
    const throwSpeed = playerWorldY < 297 ? 250 : 300;

    const localY = (playerWorldY - this.y) / this.scaleY;
    this.scene.add.tween({
      targets: this.vege,
      x: this.randomThrow,
      y: localY,
      duration: throwSpeed,
      ease: "Quad.Out",
      onComplete: () => {
        createAnimation(this.scene, this.sprite, `${this.spriteName}_move`, "move", 0, 3, 4, -1);
        this.scene.sound.add("splat", { volume: 0.2 }).play();
        createAnimation(this.scene, this.vege, `${this.spriteName}_${this.randomVege}_splat`, "splat", 0, 4, 10, 0);
        (this.vege.body as Phaser.Physics.Arcade.Body).setSize(this.vege.width, this.vege.height);
      },
    });
  }

  private createOverlaps() {
    if (!this.player) return;

    this.scene.physics.add.overlap(this.vege, this.player, () => {
      this.player?.hurt();
      this.vege.setVisible(false);
      (this.vege.body as Phaser.Physics.Arcade.Body).enable = false;
      this.handleImmunity();
    });
  }

  private handleImmunity() {
    if (!this.player || this.isHit) return;
    this.isHit = true;

    const aura = this.player.clothing.aura;

    if (!aura) {
      this.player.setVisible(false);
    } else if (AURA_IMMUNITY.includes(aura)) {
      this.player?.sprite?.setVisible(false);
      this.player?.shadow?.setVisible(false);
      this.player.showAura();
    } else {
      this.player.setVisible(false);
    }

    this.restorePlayer();
  }

  private restorePlayer() {
    this.scene.time.delayedCall(DEBUFF_DURATION, () => {
      if (!this.player) return;

      this.player.setVisible(true);
      this.player?.sprite?.setVisible(true);
      this.player?.shadow?.setVisible(true);

      this.isHit = false;
    });
  }

  public defeat() {
    if (this.isDefeated || !this.sprite.active) return;
    this.isDefeated = true;

    this.scene.sound.add("death", { volume: 0.3 }).play();
    this.health_bar.setTexture(`${this.health_status}_low`)
    createAnimation(this.scene, this.sprite, `${this.spriteName}_death`, "death", 0, 4, 10, 0);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.time.delayedCall(800, () => {
      this.sprite.setVisible(false);
      this.vege.setVisible(false);
      this.health_bar.setVisible(false);
      this.sprite.setActive(false);

      this.scene.tweens.killTweensOf(this.sprite);
      this.scene.tweens.killTweensOf(this.vege);

      (this.vege.body as Phaser.Physics.Arcade.Body).enable = false;

      this.respawn();
    })
  }

  private respawn(delay: number = 10000) {
    this.scene.time.delayedCall(delay, () => {
      this.isDefeated = false;

      const randomHS = Phaser.Utils.Array.GetRandom(["full", "half"]);
      this.health_bar.setTexture(`${this.health_status}_${randomHS}`);
      this.health_bar.setVisible(false);

      this.scheduleMenace();
    });
  }
}