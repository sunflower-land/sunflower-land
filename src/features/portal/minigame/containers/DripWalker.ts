import { Scene } from "../Scene";
import { BumpkinContainer } from "../Core/BumpkinContainer";
import { NPC_WEARABLES } from "lib/npcs";
import { Puddle } from "./Puddle";
import { createAnimation, onAnimationComplete } from "../lib/Utils";
import { DRIP_WALKER_CYCLE_DURATION, DRIP_WALKER_POSITIONS } from "../Constants";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  speed?: number;
  leftBound?: number;
  rightBound?: number;
  topBound?: number;
  bottomBound?: number;
}

const WALK_SPEED_DEFAULT = 30;
const MIN_DIRECTION_DURATION = 1500;
const MAX_DIRECTION_DURATION = 4000;
const ENTRY_DROP_Y = 100;

type WalkDirection = "left" | "right" | "up" | "down";

/**
 * DripWalker — an NPC bumpkin that first walks straight down +100 px,
 * then activates physics/colliders and wanders in all 4 directions randomly.
 *
 * Physics (collision) are enabled AFTER the entry walk completes
 * so it doesn't interact with elements while still entering.
 */
export class DripWalker extends Phaser.GameObjects.Container {
  scene: Scene;
  private npc: BumpkinContainer;
  private speed: number;
  private leftBound: number;
  private rightBound: number;
  private topBound: number;
  private bottomBound: number;
  private direction: WalkDirection = "down";
  private directionTimer: number = 0;
  private directionDuration: number = 0;
  private isWalking: boolean = false;
  private isEntering: boolean = true;
  private entryTargetY: number = 0;
  private currentTileX: number | null = null;
  private currentTileY: number | null = null;
  private visitedTiles: Set<string> = new Set();
  private activePuddles: { puddle: Puddle; tileKey: string }[] = [];
  private readonly MAX_PUDDLES = 10;
  private isActive: boolean = false;
  private spawn: Phaser.GameObjects.Sprite;

  constructor({
    x,
    y,
    scene,
    speed = WALK_SPEED_DEFAULT,
    leftBound,
    rightBound,
    topBound,
    bottomBound,
  }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.speed = speed;
    this.leftBound = leftBound ?? 30;
    this.rightBound = rightBound ?? ((scene.map?.widthInPixels ?? 600) - 30);
    this.topBound = topBound ?? 30;
    this.bottomBound = bottomBound ?? ((scene.map?.heightInPixels ?? 400) - 30);

    this.npc = new BumpkinContainer({
      scene,
      x,
      y,
      clothing: {
        ...NPC_WEARABLES["goldtooth"],
        updatedAt: 0,
      },
      direction: "right",
      isNPC: true,
    });
    this.npc.setDepth(10);

    const spawnScale = Math.max(this.npc.width, this.npc.height) / 20;
    this.spawn = this.scene.add.sprite(0, 0, "spawn")
      .setDepth(11)
      .setVisible(false)
      .setScale(spawnScale);

    scene.physics.add.existing(this.npc);
    const body = this.npc.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.npc.width, this.npc.height);
    body.enable = false;

    this.npc.setVisible(false);
    this.isEntering = false;

    scene.time.addEvent({
      delay: DRIP_WALKER_CYCLE_DURATION,
      callback: this.toggleState,
      callbackScope: this,
      loop: true,
    });

    this.registerWalkLoop();

    scene.add.existing(this);
  }

  private toggleState(): void {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  private activate(): void {
    this.isActive = true;
    const { x, y, side } = DRIP_WALKER_POSITIONS[Math.floor(Math.random() * DRIP_WALKER_POSITIONS.length)];
    this.npc.setPosition(x, y);
    side === "left" ? this.npc.faceLeft() : this.npc.faceRight();
    this.spawnAnimation();
    this.isEntering = true;
    this.isWalking = false;
    this.entryTargetY = y + ENTRY_DROP_Y;
    this.currentTileX = null;
    this.currentTileY = null;
    this.visitedTiles.clear();
  }

  private deactivate(): void {
    this.isActive = false;
    this.isWalking = false;
    this.isEntering = false;

    this.spawnAnimation(false);

    const body = this.npc.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    body.setVelocity(0, 0);

    this.activePuddles.forEach((item, index) => {
      this.scene.tweens.add({
        targets: item.puddle,
        alpha: 0,
        duration: 2500,
        delay: index * 500,
        onComplete: () => {
          item.puddle.destroy();
        },
      });
    });
    this.activePuddles = [];
  }

  private spawnAnimation(showSprite = true): void {
    this.npc.setVisible(showSprite);
    this.spawn.setPosition(this.npc.x, this.npc.y);
    this.spawn.setVisible(true);
    createAnimation(this.scene, this.spawn, "spawn", "action", 0, 5, 10, 0);
    onAnimationComplete(this.spawn, "spawn_action_anim", () => {
      this.spawn.setVisible(false);
    });
  }

  /**
   * Picks a new random walk direction (left, right, up, down)
   * and schedules how long to keep it.
   */
  private pickNewDirection(): void {
    const roll = Math.random();

    if (roll < 0.25) {
      this.direction = "left";
      this.npc.faceLeft();
    } else if (roll < 0.5) {
      this.direction = "right";
      this.npc.faceRight();
    } else if (roll < 0.75) {
      this.direction = "up";
    } else {
      this.direction = "down";
    }

    this.directionDuration = Phaser.Math.Between(
      MIN_DIRECTION_DURATION,
      MAX_DIRECTION_DURATION,
    );
    this.directionTimer = 0;
  }

  /**
   * Registers a per-frame update callback.
   *
   * Phase 1 (isEntering): walks straight down until entryTargetY is reached,
   *   then enables physics + colliders and switches to Phase 2.
   * Phase 2 (isWalking): wanders in all 4 directions randomly.
   */
  private registerWalkLoop(): void {
    const updateKey = `dripwalker-${Phaser.Math.RND.uuid()}`;

    this.scene.addToUpdate(updateKey, () => {
      if (!this.npc?.active) {
        this.scene?.removeFromUpdate(updateKey);
        return;
      }

      if (!this.isActive) return;

      const delta = this.scene.game.loop.delta; // ms
      const step = this.speed * (delta / 1000);

      // ── Phase 1: entry walk ──────────────────────────────────────────
      if (this.isEntering) {
        this.npc.y += step;
        this.npc.carryNone?.();

        if (this.npc.y >= this.entryTargetY) {
          this.npc.y = this.entryTargetY;
          this.isEntering = false;

          const body = this.npc.body as Phaser.Physics.Arcade.Body;
          body.enable = true;

          console.log(this.scene.colliders);
          if (this.scene.colliders) {
            this.scene.physics.add.collider(
              this.npc,
              this.scene.colliders as Phaser.GameObjects.Group,
            );
          }

          this.isWalking = true;
          this.pickNewDirection();
        }
        return;
      }

      // ── Phase 2: random walk ─────────────────────────────────────────
      if (!this.isWalking) return;

      this.directionTimer += delta;
      if (this.directionTimer >= this.directionDuration) {
        this.pickNewDirection();
      }

      let vx = 0;
      let vy = 0;

      const speed = this.speed;
      switch (this.direction) {
        case "left": vx = -speed; break;
        case "right": vx = +speed; break;
        case "up": vy = -speed; break;
        case "down": vy = +speed; break;
      }

      const body = this.npc.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(vx, vy);

      const isColliding =
        (this.direction === "left" && (body.blocked.left || body.touching.left)) ||
        (this.direction === "right" && (body.blocked.right || body.touching.right)) ||
        (this.direction === "up" && (body.blocked.up || body.touching.up)) ||
        (this.direction === "down" && (body.blocked.down || body.touching.down));

      if (isColliding) {
        this.pickNewDirection();
        return;
      }

      if (this.direction === "left") this.npc.faceLeft();
      else if (this.direction === "right") this.npc.faceRight();

      if (this.npc.x >= this.rightBound) {
        this.direction = "left";
        this.npc.faceLeft();
        this.directionTimer = 0;
        this.directionDuration = Phaser.Math.Between(MIN_DIRECTION_DURATION, MAX_DIRECTION_DURATION);
      } else if (this.npc.x <= this.leftBound) {
        this.direction = "right";
        this.npc.faceRight();
        this.directionTimer = 0;
        this.directionDuration = Phaser.Math.Between(MIN_DIRECTION_DURATION, MAX_DIRECTION_DURATION);
      }

      if (this.npc.y >= this.bottomBound) {
        this.direction = "up";
        this.directionTimer = 0;
        this.directionDuration = Phaser.Math.Between(MIN_DIRECTION_DURATION, MAX_DIRECTION_DURATION);
      } else if (this.npc.y <= this.topBound) {
        this.direction = "down";
        this.directionTimer = 0;
        this.directionDuration = Phaser.Math.Between(MIN_DIRECTION_DURATION, MAX_DIRECTION_DURATION);
      }

      this.dropPuddle();
      this.npc.carryNone?.();
    });
  }

  private dropPuddle(): void {
    const tileWidth = this.scene.map?.tileWidth ?? 16;
    const tileHeight = this.scene.map?.tileHeight ?? 16;

    const tx = Math.floor(this.npc.x / tileWidth);
    const ty = Math.floor(this.npc.y / tileHeight);

    if (this.currentTileX !== tx || this.currentTileY !== ty) {
      this.currentTileX = tx;
      this.currentTileY = ty;

      const tileKey = `${tx},${ty}`;

      const existingIndex = this.activePuddles.findIndex(p => p.tileKey === tileKey);
      if (existingIndex !== -1) {
        const existing = this.activePuddles.splice(existingIndex, 1)[0];
        existing.puddle.destroy();
      } else {
        this.visitedTiles.add(tileKey);
      }

      const puddleX = tx * tileWidth + tileWidth / 2;
      const puddleY = ty * tileHeight + tileHeight / 2;

      const puddle = new Puddle({
        x: puddleX,
        y: puddleY,
        scene: this.scene,
      });

      this.activePuddles.push({ puddle, tileKey });

      if (this.activePuddles.length > this.MAX_PUDDLES) {
        const oldest = this.activePuddles.shift();
        if (oldest) {
          this.visitedTiles.delete(oldest.tileKey);

          this.scene.tweens.add({
            targets: oldest.puddle,
            alpha: 0,
            duration: 2500,
            onComplete: () => {
              oldest.puddle.destroy();
            },
          });
        }
      }
    }
  }
}
