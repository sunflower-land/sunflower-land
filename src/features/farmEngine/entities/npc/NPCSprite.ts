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
 * The shadow draws at its native 15px [core/pixelArt.ts] — the DOM's 12 is a
 * stale display width that resamples the asset.
 */
/** Below the boot row so the ellipse reads as ground contact. */
const SHADOW_DROP = 6;

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
  /**
   * Lift the shadow above same-depth scenery. Boat/pontoon NPCs sit ON art
   * drawn at their own depth (the raft hull), so the default half-step back
   * would bury the shadow underneath it.
   */
  shadowAboveScenery?: boolean;
};

export class NPCSprite {
  private sprite: Phaser.GameObjects.Sprite | undefined;

  /** The body sprite, for external click zones to aim the hover glow at. */
  body() {
    return this.sprite;
  }
  private shadow: Phaser.GameObjects.Image | undefined;
  private auraBack: Phaser.GameObjects.Sprite | undefined;
  private auraFront: Phaser.GameObjects.Sprite | undefined;
  private destroyed = false;
  /** Box origin the children were laid out against, for setPosition deltas. */
  private originX = 0;
  private originY = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly options: NPCSpriteOptions,
  ) {}

  async create() {
    const { parts, x, y, flipX, depth, onClick, container } = this.options;
    this.originX = x;
    this.originY = y;
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

    // The animation service composes uncached outfits ON DEMAND — the first
    // request for a rare combination can fail while the composition runs,
    // and a one-shot load leaves the bumpkin as Phaser's missing-texture
    // grid forever. Retry a few times with a backoff; the service caches
    // once the compose finishes.
    for (
      let attempt = 0;
      !this.scene.textures.exists(url) && attempt < 3;
      attempt++
    ) {
      await new Promise((resolve) =>
        this.scene.time.delayedCall(1500 * (attempt + 1), resolve),
      );
      if (this.destroyed) return;
      queueSpritesheet(this.scene, url, {
        frameWidth: FRAME_WIDTH,
        frameHeight: FRAME_HEIGHT,
      });
      await runLoader(this.scene);
      if (this.destroyed) return;
    }
    if (!this.scene.textures.exists(url)) return; // stay invisible over the grid

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
    // does) — draw the npc shadow under the feet, like the world's
    // BumpkinContainer. Width matches the DOM's 12 source px (the asset is
    // 15 native), and it sits a few px below the boot row so the ellipse
    // reads as ground contact rather than hugging the ankles.
    this.shadow = this.scene.add
      .image(x + NPC_BOX / 2, y + NPC_BOX + SHADOW_DROP, shadowSrc)
      .setDepth(
        // A boat NPC stands on art drawn at its own depth; nudge forward so
        // the shadow lands on the hull instead of behind it.
        this.options.shadowAboveScenery ? depth + 0.1 : depth - 0.5,
      );
    this.shadow.setScale(1);
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
      makeClickable(this.scene, this.sprite, onClick, {
        glow: () => this.sprite,
      });
    }
  }

  /** Children keep their creation-time offsets; shift them all by the delta. */
  private children(): (Phaser.GameObjects.Components.Transform | undefined)[] {
    return [this.sprite, this.shadow, this.auraBack, this.auraFront];
  }

  /**
   * Move the NPC to a new box origin. Buildings cache their NPC across
   * refreshes, so without this a landscaped building leaves its NPC behind.
   */
  setPosition(x: number, y: number) {
    const dx = x - this.originX;
    const dy = y - this.originY;
    if (dx === 0 && dy === 0) return;
    this.originX = x;
    this.originY = y;
    this.children().forEach((child) => {
      if (!child) return;
      child.x += dx;
      child.y += dy;
    });
  }

  /** Warm an animation's sheet without playing it (e.g. on worker select). */
  async preload(
    animation: "idle" | "walking" | "axe" | "dig" | "mining" | "doing",
  ) {
    const url = getAnimationUrl(this.options.parts, [animation]);
    if (this.scene.textures.exists(url)) return;
    queueSpritesheet(this.scene, url, {
      frameWidth: FRAME_WIDTH,
      frameHeight: FRAME_HEIGHT,
    });
    await runLoader(this.scene);
  }

  /**
   * Swap to another animation from the service (walking, axe...). Loads the
   * sheet on first use; falls back to idle if it never arrives.
   */
  async play(
    animation: "idle" | "walking" | "axe" | "dig" | "mining" | "doing",
  ) {
    const { parts } = this.options;
    const url = getAnimationUrl(parts, [animation]);
    const key = `${url}-${animation}`;
    if (!this.scene.textures.exists(url)) {
      queueSpritesheet(this.scene, url, {
        frameWidth: FRAME_WIDTH,
        frameHeight: FRAME_HEIGHT,
      });
      await runLoader(this.scene);
    }
    if (this.destroyed || !this.sprite) return;
    if (!this.scene.textures.exists(url)) return;
    if (!this.scene.anims.exists(key)) {
      // Each animation has its OWN frame count (walking is 8, idle 9, dig
      // 13...) — the service emits a horizontal strip, so derive it from the
      // sheet width. Reusing the idle range played a blank out-of-range
      // frame every cycle, which read as walking jitter.
      const frames =
        Math.floor(
          this.scene.textures.get(url).getSourceImage().width / FRAME_WIDTH,
        ) || 1;
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(url, {
          start: 0,
          end: frames - 1,
        }),
        frameRate: IDLE_FRAME_RATE,
        repeat: -1,
      });
    }
    this.sprite.play(key, true);
  }

  /** Current box origin, so callers can walk from where it actually is. */
  origin() {
    return { x: this.originX, y: this.originY };
  }

  /**
   * Re-band the painter depth around a new base (walking changes the row the
   * NPC stands on). Children keep their creation-time offsets: shadow −0.5
   * (or +0.1 above scenery), auras ±0.25.
   */
  setBaseDepth(depth: number) {
    this.sprite?.setDepth(depth);
    this.shadow?.setDepth(
      this.options.shadowAboveScenery ? depth + 0.1 : depth - 0.5,
    );
    this.auraBack?.setDepth(depth - 0.25);
    this.auraFront?.setDepth(depth + 0.25);
  }

  /** Face left/right — the service sheets face right. */
  setFlip(flipX: boolean) {
    this.sprite?.setFlipX(flipX);
  }

  setVisible(visible: boolean) {
    this.sprite?.setVisible(visible);
    this.shadow?.setVisible(visible);
    this.auraBack?.setVisible(visible);
    this.auraFront?.setVisible(visible);
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
