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

const MENACE_MIN_CREATE = 3000;
const MENACE_MAX_CREATE = 6000;
const DEBUFF_DURATION = 4000;

export class Menace_Skeleton extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string;
  private vege: Phaser.GameObjects.Sprite;
  private vegeSplat: Phaser.GameObjects.Sprite;
  private playerWorldX_Sprite?: number;
  private randomVege: string;
  private vegeList: string[];
  private flipX: boolean = false;
  private randomThrow: number;
  public isDefeated: boolean = false;
  private skeletonTimer?: Phaser.Time.TimerEvent;
  private isHit: boolean = false;
  private static usedSlots: number[] = [];
  private static spawnPositions: { x: number; y: number }[] = [];

  constructor({ x, y, scene, player }: Props) {
    super(scene, x, y);

    this.scene = scene;
    this.player = player;
    this.spriteName = "sniper_skeleton";

    this.vegeList = ["carrot", "cabbage", "potato"];
    this.randomVege = Phaser.Math.RND.pick(this.vegeList);
    this.randomThrow = Phaser.Math.Between(-50, 50);
    this.flipX = this.randomThrow <= 0;

    // Sprites
    this.sprite = this.scene.add.sprite(0, 0, `${this.spriteName}_move`).setVisible(false);
    this.vege = this.scene.add.sprite(0, 0, `${this.spriteName}_${this.randomVege}`).setVisible(false);
    this.vegeSplat = this.scene.add.sprite(0, 0, `${this.spriteName}_${this.randomVege}_splat`).setVisible(false);

    this.add([this.sprite, this.vege, this.vegeSplat]);

    // Physics
    this.scene.physics.add.existing(this); // container body
    const containerBody = this.body as Phaser.Physics.Arcade.Body;
    containerBody.setSize(this.sprite.width, this.sprite.height);
    containerBody.enable = false;

    this.scene.physics.add.existing(this.sprite);
    const spriteBody = this.sprite.body as Phaser.Physics.Arcade.Body;
    spriteBody.setSize(this.sprite.width, this.sprite.height).setCollideWorldBounds(true).setImmovable(true);

    this.scene.physics.add.existing(this.vege);
    const vegeBody = this.vege.body as Phaser.Physics.Arcade.Body;
    vegeBody.setSize(15, 15, true).setAllowGravity(false).setImmovable(true);

    this.scene.physics.add.existing(this.vegeSplat);
    const splatBody = this.vegeSplat.body as Phaser.Physics.Arcade.Body;
    splatBody.setSize(15, 15, true).setAllowGravity(false).setImmovable(true);
    splatBody.enable = false;

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

    const { x, y } = this.getRandomPosition();
    this.setPosition(x, y);

    if (y > 100) {
      this.setDepth(500);
    } else {
      this.setDepth(10);
    }

    this.sprite.setVisible(true);
    (this.body as Phaser.Physics.Arcade.Body).enable = true;

    this.playerWorldX_Sprite = this.player.getWorldTransformMatrix().tx;
    this.randomVege = Phaser.Math.RND.pick(this.vegeList);

    this.vege.setTexture(`${this.spriteName}_${this.randomVege}`);
    this.vege.setVisible(true);

    this.randomThrow = Phaser.Math.Between(-50, 50);
    this.flipX = this.randomThrow <= 0;

    const switchSide = this.flipX ? + 10 : - 10;
    this.vege.setFlipX(this.flipX);
    this.sprite.setFlipX(this.flipX);
    this.vege.setPosition(switchSide, 0);

    this.setSize(this.sprite.width, this.sprite.height);

    createAnimation(this.scene, this.sprite, `${this.spriteName}_attack`, "attack", 0, 3, 4, 0);

    this.scene.time.delayedCall(650, () => this.foodMovement());
  }

  private foodMovement() {
    if (!this.player) return;

    this.vegeSplat.setVisible(false);
    this.sprite.anims.remove("attack");
    this.vegeSplat.setTexture(`${this.spriteName}_${this.randomVege}_splat`);
    this.vegeSplat.setVisible(false);

    const playerWorldY = this.player.getWorldTransformMatrix().ty;
    const throwSpeed = playerWorldY < 297 ? 250 : 300;

    this.vege.setFlipX(this.flipX);
    this.vegeSplat.setFlipX(this.flipX);
    this.vegeSplat.setPosition(this.randomThrow, playerWorldY - this.y);

    this.scene.add.tween({
      targets: this.vege,
      x: this.randomThrow,
      y: playerWorldY - this.y,
      duration: throwSpeed,
      ease: "Quad.Out",
      onComplete: () => {
        createAnimation(this.scene, this.sprite, `${this.spriteName}_move`, "move", 0, 3, 4, -1);
      },
    });

    this.scene.time.delayedCall(throwSpeed, () => {
      this.vege.setVisible(false);
      this.vegeSplat.setVisible(true);
      (this.vegeSplat.body as Phaser.Physics.Arcade.Body).enable = true;
      createAnimation(this.scene, this.vegeSplat, `${this.spriteName}_${this.randomVege}_splat`, "splat", 0, 4, 30, 0);
    });
  }

  private createOverlaps() {
    if (!this.player) return;

    this.scene.physics.add.overlap(this.vegeSplat, this.player, () => {
      this.vegeSplat.setVisible(false);
      (this.vegeSplat.body as Phaser.Physics.Arcade.Body).enable = false;
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
    if (this.isDefeated || !this.sprite.visible) return;
    this.isDefeated = true;

    createAnimation(this.scene, this.sprite, `${this.spriteName}_death`, "death", 0, 4, 4, 0);

    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.time.delayedCall(2000, () => {
      this.sprite.setVisible(false);
      this.vege.setVisible(false);
      this.vegeSplat.setVisible(false);

      this.skeletonTimer?.remove(false);

      this.scene.tweens.killTweensOf(this.sprite);
      this.scene.tweens.killTweensOf(this.vege);
      this.scene.tweens.killTweensOf(this.vegeSplat);

      (this.vegeSplat.body as Phaser.Physics.Arcade.Body).enable = false;

      this.respawn();
    });
  }

  private respawn(delay: number = 10000) {
    this.scene.time.delayedCall(delay, () => {
      this.isDefeated = false;

      this.sprite.setVisible(true);
      this.vege.setVisible(false);
      this.vegeSplat.setVisible(false);

      this.sprite.setFlipX(false);
      this.vege.setFlipX(false);
      this.vegeSplat.setFlipX(false);

      (this.body as Phaser.Physics.Arcade.Body).enable = true;
      (this.vegeSplat.body as Phaser.Physics.Arcade.Body).enable = false;

      createAnimation(this.scene, this.sprite, `${this.spriteName}_move`, "move", 0, 3, 4, 0);

      this.scheduleMenace();
    });
  }
}