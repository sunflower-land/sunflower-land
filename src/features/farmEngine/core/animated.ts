import type Phaser from "phaser";
import { animatedArtFor } from "./animatedArt";
import { queueImage, queueSpritesheet } from "./assets";

/**
 * Animated-GIF art support. The DOM farm renders these as <img> GIFs; Phaser
 * can't animate a GIF, so `scripts/gif-to-spritesheet.js` converts each one to
 * a vertical strip and `animatedArt.ts` maps the original URL to it. These
 * helpers let a renderer keep treating art as "one URL" while transparently
 * getting a looping Sprite where the DOM would be animating.
 */

export type ArtObject = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

/**
 * Mobile GPUs top out at a 4096px texture, and decoding a bigger strip can
 * alone kill a mobile WebKit tab. The converter refuses to emit one, but a
 * hand-added manifest entry could still slip through — treat such art as
 * static (still first frame) everywhere, so nothing waits on a texture the
 * loader will never produce.
 */
const MAX_SHEET_DIM = 4096;

const warnedOversized = new Set<string>();

const usableAnimatedArtFor = (url: string) => {
  const animated = animatedArtFor(url);
  if (!animated) return undefined;
  if (
    animated.frameWidth > MAX_SHEET_DIM ||
    animated.frameHeight * animated.frames > MAX_SHEET_DIM
  ) {
    if (!warnedOversized.has(url)) {
      warnedOversized.add(url);
      // eslint-disable-next-line no-console
      console.error(
        `Animated strip for ${url} exceeds ${MAX_SHEET_DIM}px — showing a still frame`,
      );
    }
    return undefined;
  }
  return animated;
};

/** Queue an art URL — as its converted strip when animated, else an image. */
export function queueArt(scene: Phaser.Scene, url: string): string {
  const animated = usableAnimatedArtFor(url);
  if (!animated) return queueImage(scene, url);
  queueSpritesheet(scene, animated.sheet, {
    frameWidth: animated.frameWidth,
    frameHeight: animated.frameHeight,
  });
  return animated.sheet;
}

/** The texture key an art URL resolves to once queued. */
export function artTexture(url: string): string {
  return usableAnimatedArtFor(url)?.sheet ?? url;
}

/** True when the URL has a converted strip (i.e. the DOM animates it). */
export const isAnimatedArt = (url: string) => !!usableAnimatedArtFor(url);

/**
 * Create (or reuse) the display object for an art URL and start its loop.
 * Returns a NEW object when the required kind changes — Images can't play
 * animations — so callers must use the return value and re-apply their
 * position/scale/depth, which they all do on every pass anyway.
 */
export function resolveArtObject(
  scene: Phaser.Scene,
  existing: ArtObject | undefined,
  url: string,
): ArtObject | undefined {
  const animated = usableAnimatedArtFor(url);
  const texture = animated?.sheet ?? url;
  if (!scene.textures.exists(texture)) return existing;

  const wantsSprite = !!animated;
  const isSprite = !!existing && "anims" in existing;

  let object = existing;
  if (!object || wantsSprite !== isSprite) {
    object?.destroy();
    object = wantsSprite
      ? scene.add.sprite(0, 0, texture)
      : scene.add.image(0, 0, texture);
  }

  if (!animated) {
    object.setTexture(texture);
    return object;
  }

  const sprite = object as Phaser.GameObjects.Sprite;
  const animKey = `${animated.sheet}-loop`;
  if (!scene.anims.exists(animKey)) {
    scene.anims.create({
      key: animKey,
      frames: scene.anims.generateFrameNumbers(animated.sheet, {
        start: 0,
        end: animated.frames - 1,
      }),
      frameRate: animated.fps,
      repeat: -1,
    });
  }
  if (sprite.anims.currentAnim?.key !== animKey) {
    sprite.play(animKey);
  }
  return sprite;
}
