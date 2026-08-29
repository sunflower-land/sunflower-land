import Phaser from "phaser";
import shadowSrc from "assets/npcs/shadow.png";
import { NPC_WEARABLES } from "lib/npcs";
import { getAnimationUrl } from "features/world/lib/animations";
import { queueImage, queueSpritesheet, runLoader } from "../core/assets";
import { DEPTHS } from "../core/depths";
import { WORLD_TILE } from "../core/coordinates";

/**
 * Dev stress egg (`phaserFarm.dev.stress`): a crowd of bumpkins wandering
 * the land on the walking animation while the fixture carpets the ground
 * with ready sunflowers. Purely a perf playground — never ships behavior.
 *
 * Shares the animation-service pipeline with NPCSprite: combined
 * ["idle","walking"] sheets, 96×64 frames, idle 0-8 / walking 9-16 @10fps
 * [BumpkinContainer.ts:326-327].
 */

const CROWD_SIZE = 50;
const FRAME = { width: 96, height: 64 };
const WALK_FRAMES = { start: 9, end: 16 };
const WALK_SPEED = 24; // world px/s — a relaxed stroll

/** A few distinct outfits so the crowd isn't clones (few textures, many sprites). */
const OUTFITS = [
  NPC_WEARABLES["pumpkin' pete"],
  NPC_WEARABLES.betty,
  NPC_WEARABLES.grimbly,
  NPC_WEARABLES.grubnuk,
];

/** Wander range in tiles (kept inside the 42-expansion landmass). */
const RANGE = { minX: -11, maxX: 10, minY: -9, maxY: 12 };

export class StressBumpkins {
  private sprites: Phaser.GameObjects.Sprite[] = [];
  private shadows = new Map<
    Phaser.GameObjects.Sprite,
    Phaser.GameObjects.Image
  >();
  private tweens: Phaser.Tweens.Tween[] = [];
  private destroyed = false;

  constructor(private readonly scene: Phaser.Scene) {}

  async create() {
    const urls = OUTFITS.map((parts) =>
      getAnimationUrl(parts, ["idle", "walking"]),
    );
    urls.forEach((url) =>
      queueSpritesheet(this.scene, url, {
        frameWidth: FRAME.width,
        frameHeight: FRAME.height,
      }),
    );
    queueImage(this.scene, shadowSrc);
    await runLoader(this.scene);
    if (this.destroyed) return;

    urls.forEach((url) => {
      const key = `${url}-stress-walk`;
      if (!this.scene.anims.exists(key)) {
        this.scene.anims.create({
          key,
          frames: this.scene.anims.generateFrameNumbers(url, WALK_FRAMES),
          frameRate: 10,
          repeat: -1,
        });
      }
    });

    for (let i = 0; i < CROWD_SIZE; i++) {
      const url = urls[i % urls.length];
      if (!this.scene.textures.exists(url)) continue;
      const x = Phaser.Math.Between(RANGE.minX, RANGE.maxX) * WORLD_TILE;
      const y = Phaser.Math.Between(RANGE.minY, RANGE.maxY) * WORLD_TILE;
      const sprite = this.scene.add
        .sprite(x, y, url)
        .setOrigin(0.5, 0.5)
        .setDepth(DEPTHS.ENTITY_BASE + y);
      sprite.play(`${url}-stress-walk`);
      // Feet sit at the frame's vertical centre — shadow rides (x, y).
      const shadow = this.scene.add
        .image(x, y + 3, shadowSrc)
        .setDepth(DEPTHS.ENTITY_BASE + y - 0.5);
      this.shadows.set(sprite, shadow);
      this.sprites.push(sprite);
      this.wander(sprite);
    }
  }

  /** Pick a nearby point, stroll there, pause, repeat. */
  private wander(sprite: Phaser.GameObjects.Sprite) {
    if (this.destroyed || !sprite.active) return;
    const targetX = Phaser.Math.Clamp(
      sprite.x + Phaser.Math.Between(-4, 4) * WORLD_TILE,
      RANGE.minX * WORLD_TILE,
      RANGE.maxX * WORLD_TILE,
    );
    const targetY = Phaser.Math.Clamp(
      sprite.y + Phaser.Math.Between(-3, 3) * WORLD_TILE,
      RANGE.minY * WORLD_TILE,
      RANGE.maxY * WORLD_TILE,
    );
    const distance = Phaser.Math.Distance.Between(
      sprite.x,
      sprite.y,
      targetX,
      targetY,
    );
    if (distance < 4) {
      this.scene.time.delayedCall(Phaser.Math.Between(300, 1200), () =>
        this.wander(sprite),
      );
      return;
    }
    sprite.setFlipX(targetX < sprite.x);
    const tween = this.scene.tweens.add({
      targets: sprite,
      x: targetX,
      y: targetY,
      duration: (distance / WALK_SPEED) * 1000,
      onUpdate: () => {
        sprite.setDepth(DEPTHS.ENTITY_BASE + sprite.y);
        const shadow = this.shadows.get(sprite);
        shadow?.setPosition(sprite.x, sprite.y + 3);
        shadow?.setDepth(DEPTHS.ENTITY_BASE + sprite.y - 0.5);
      },
      onComplete: () => {
        this.tweens = this.tweens.filter((t) => t !== tween);
        this.scene.time.delayedCall(Phaser.Math.Between(200, 1500), () =>
          this.wander(sprite),
        );
      },
    });
    this.tweens.push(tween);
  }

  destroy() {
    this.destroyed = true;
    this.tweens.forEach((tween) => tween.remove());
    this.tweens = [];
    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites = [];
    this.shadows.forEach((shadow) => shadow.destroy());
    this.shadows.clear();
  }
}
