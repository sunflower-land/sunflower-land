import type Phaser from "phaser";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { getAnimationUrl } from "features/world/lib/animations";
import { queueSpritesheet, runLoader } from "../../core/assets";
import { makeClickable } from "../../core/clickable";

/**
 * A composited idle bumpkin, rendered from the animation service's
 * spritesheet (the same pipeline the world's BumpkinContainer uses: 96x64
 * frames, idle = frames 0-8 at 10fps). This replaces the DOM farm's
 * NPCPlaceable for in-world NPCs (Pete, Wobble, Grubnuk...).
 *
 * Position is given as the DOM NPC box's top-left in world units (the 16px
 * wide box NPCPlaceable renders into); the sheet's frame is centred on the
 * box so the visible bumpkin lands where the DOM one does.
 */

const FRAME_WIDTH = 96;
const FRAME_HEIGHT = 64;
const IDLE_FRAMES = { start: 0, end: 8 };
const IDLE_FRAME_RATE = 10;

/** DOM NPC box width in world units (NPCPlaceable's default 16px). */
const NPC_BOX = 16;

/**
 * The bumpkin rides high inside the 96x64 sheet frame, so centring the frame
 * on the DOM box floats the feet ~8 source px above where NPCPlaceable draws
 * them. Nudge the frame down to line the feet up.
 */
const NPC_Y_OFFSET = 8;

type NPCSpriteOptions = {
  parts: BumpkinParts;
  /** DOM NPC box top-left, world units (container-relative when `container` is set). */
  x: number;
  y: number;
  flipX?: boolean;
  depth: number;
  onClick?: () => void;
  /** Add to this container instead of the scene root (e.g. a drifting boat). */
  container?: Phaser.GameObjects.Container;
};

export class NPCSprite {
  private sprite: Phaser.GameObjects.Sprite | undefined;
  private destroyed = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly options: NPCSpriteOptions,
  ) {}

  async create() {
    const { parts, x, y, flipX, depth, onClick, container } = this.options;
    const url = getAnimationUrl(parts, ["idle"]);

    queueSpritesheet(this.scene, url, {
      frameWidth: FRAME_WIDTH,
      frameHeight: FRAME_HEIGHT,
    });
    await runLoader(this.scene);
    if (this.destroyed) return;

    const animKey = `${url}-idle`;
    if (!this.scene.anims.exists(animKey)) {
      this.scene.anims.create({
        key: animKey,
        frames: this.scene.anims.generateFrameNumbers(url, IDLE_FRAMES),
        frameRate: IDLE_FRAME_RATE,
        repeat: -1,
      });
    }

    this.sprite = this.scene.add
      .sprite(x + NPC_BOX / 2, y + NPC_BOX / 2 + NPC_Y_OFFSET, url)
      .setOrigin(0.5, 0.5)
      .setDepth(depth)
      .setFlipX(!!flipX);
    this.sprite.play(animKey);
    container?.add(this.sprite);

    if (onClick) {
      makeClickable(this.scene, this.sprite, onClick);
    }
  }

  destroy() {
    this.destroyed = true;
    this.sprite?.destroy();
    this.sprite = undefined;
  }
}
