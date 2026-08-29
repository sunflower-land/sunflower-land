import type Phaser from "phaser";
import shadowSrc from "assets/npcs/shadow.png";
import { CONFIG } from "lib/config";
import { ITEM_IDS } from "features/game/types/bumpkin";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { getAnimationUrl } from "features/world/lib/animations";
import { queueImage, queueSpritesheet, runLoader } from "../../core/assets";
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

/** [NPC.tsx] aura sheets: 20x19 frames, 8 steps at 14fps. */
const AURA_FRAME = { frameWidth: 20, frameHeight: 19 };
const AURA_STEPS = 8;
const AURA_FPS = 14;

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
  private shadow: Phaser.GameObjects.Image | undefined;
  private auraBack: Phaser.GameObjects.Sprite | undefined;
  private auraFront: Phaser.GameObjects.Sprite | undefined;
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
    queueImage(this.scene, shadowSrc);
    // [NPC.tsx] aura back/front layers.
    const auraId = parts.aura ? ITEM_IDS[parts.aura] : undefined;
    const auraBackUrl = auraId
      ? `${CONFIG.PROTECTED_IMAGE_URL}/aura/back/${auraId}.png`
      : undefined;
    const auraFrontUrl = auraId
      ? `${CONFIG.PROTECTED_IMAGE_URL}/aura/front/${auraId}.png`
      : undefined;
    if (auraBackUrl) queueSpritesheet(this.scene, auraBackUrl, AURA_FRAME);
    if (auraFrontUrl) queueSpritesheet(this.scene, auraFrontUrl, AURA_FRAME);
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

    // The service sheets have no baked shadow (the DOM's idle-small webp
    // does) — draw the DOM's 15px npc shadow under the feet, like the
    // world's BumpkinContainer. Nudged below the boot row so the ellipse
    // peeks out instead of hiding behind the body.
    this.shadow = this.scene.add
      .image(x + NPC_BOX / 2, y + NPC_BOX + 3, shadowSrc)
      .setDepth(depth - 0.5);
    container?.add(this.shadow);

    // Aura back layer (behind the bumpkin) [NPC.tsx: 20px wide, left -2,
    // manually-placed tops -2 (back) / -4.8 (front)].
    const addAura = (
      sheetUrl: string | undefined,
      top: number,
      auraDepth: number,
    ) => {
      if (!sheetUrl || !this.scene.textures.exists(sheetUrl)) return undefined;
      const animId = `${sheetUrl}-aura`;
      if (!this.scene.anims.exists(animId)) {
        this.scene.anims.create({
          key: animId,
          frames: this.scene.anims.generateFrameNumbers(sheetUrl, {
            start: 0,
            end: AURA_STEPS - 1,
          }),
          frameRate: AURA_FPS,
          repeat: -1,
        });
      }
      const aura = this.scene.add
        .sprite(x - 2, y + top, sheetUrl)
        .setOrigin(0, 0)
        .setDepth(auraDepth)
        .setFlipX(!!flipX);
      aura.play(animId);
      container?.add(aura);
      return aura;
    };
    this.auraBack = addAura(auraBackUrl, -2, depth - 0.25);

    this.sprite = this.scene.add
      .sprite(x + NPC_BOX / 2, y + NPC_BOX / 2 + NPC_Y_OFFSET, url)
      .setOrigin(0.5, 0.5)
      .setDepth(depth)
      .setFlipX(!!flipX);
    this.sprite.play(animKey);
    container?.add(this.sprite);

    this.auraFront = addAura(auraFrontUrl, -4.8, depth + 0.25);

    if (onClick) {
      makeClickable(this.scene, this.sprite, onClick);
    }
  }

  destroy() {
    this.destroyed = true;
    this.sprite?.destroy();
    this.sprite = undefined;
    this.shadow?.destroy();
    this.shadow = undefined;
    this.auraBack?.destroy();
    this.auraBack = undefined;
    this.auraFront?.destroy();
    this.auraFront = undefined;
  }
}
