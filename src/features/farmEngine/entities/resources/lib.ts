import Phaser from "phaser";
import { queueImage, queueSpritesheet } from "../../core/assets";

/**
 * Shared placement + spritesheet plumbing for resource-node renderers. All
 * offsets are in SOURCE px, interpreted exactly like the DOM components'
 * `style` blocks: `top/left` from the placement box's top-left, `bottom/right`
 * from its bottom-right, measured to the same edge of the image.
 */

export type NodeBox = { x: number; y: number; width: number; height: number };

export type ArtSpec = {
  texture: string;
  /** Draw width in source px; omit for natural size. */
  width?: number;
  /** Explicit draw height (rare; DOM sets width only, height follows aspect). */
  height?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  /** Centre in the box (Oil Reserve's flex centring). */
  centered?: boolean;
  alpha?: number;
};

export type SheetSpec = {
  url: string;
  frameWidth: number;
  frameHeight: number;
  fps: number;
  steps: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

export const queueArt = (scene: Phaser.Scene, spec: ArtSpec) =>
  queueImage(scene, spec.texture);

export const queueSheet = (scene: Phaser.Scene, spec: SheetSpec) =>
  queueSpritesheet(scene, spec.url, {
    frameWidth: spec.frameWidth,
    frameHeight: spec.frameHeight,
  });

const resolvePosition = (
  box: NodeBox,
  spec: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    centered?: boolean;
  },
  displayWidth: number,
  displayHeight: number,
): { x: number; y: number } => {
  if (spec.centered) {
    return {
      x: box.x + (box.width - displayWidth) / 2,
      y: box.y + (box.height - displayHeight) / 2,
    };
  }
  const x =
    spec.left !== undefined
      ? box.x + spec.left
      : spec.right !== undefined
        ? box.x + box.width - spec.right - displayWidth
        : box.x;
  const y =
    spec.top !== undefined
      ? box.y + spec.top
      : spec.bottom !== undefined
        ? box.y + box.height - spec.bottom - displayHeight
        : box.y;
  return { x, y };
};

/** Create or restyle a node's static art image per an ArtSpec. */
export function applyArt(
  scene: Phaser.Scene,
  image: Phaser.GameObjects.Image | undefined,
  box: NodeBox,
  spec: ArtSpec,
  depth: number,
): Phaser.GameObjects.Image {
  const art = image ?? scene.add.image(0, 0, spec.texture).setOrigin(0, 0);
  art.setTexture(spec.texture);

  const scale = spec.width !== undefined ? spec.width / art.width : 1;
  art.setScale(
    scale,
    spec.height !== undefined ? spec.height / art.height : scale,
  );

  const { x, y } = resolvePosition(
    box,
    spec,
    art.displayWidth,
    art.displayHeight,
  );
  art.setPosition(x, y);
  art.setDepth(depth);
  art.setAlpha(spec.alpha ?? 1);
  return art;
}

/** Animation key for a one-shot sheet (per url so it's created once). */
const sheetAnimKey = (spec: SheetSpec) => `${spec.url}-oneshot-${spec.steps}`;

export function ensureSheetAnim(scene: Phaser.Scene, spec: SheetSpec) {
  const key = sheetAnimKey(spec);
  if (!scene.anims.exists(key)) {
    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers(spec.url, {
        start: 0,
        end: spec.steps - 1,
      }),
      frameRate: spec.fps,
    });
  }
  return key;
}

/**
 * Play a sheet from frame 0, holding the last frame (the SpriteAnimator
 * goToAndPlay + pause-on-loop-complete pattern). Reuses the sprite if given.
 */
export function playSheet(
  scene: Phaser.Scene,
  sprite: Phaser.GameObjects.Sprite | undefined,
  box: NodeBox,
  spec: SheetSpec,
  depth: number,
): Phaser.GameObjects.Sprite {
  const key = ensureSheetAnim(scene, spec);
  const target = sprite ?? scene.add.sprite(0, 0, spec.url).setOrigin(0, 0);
  const { x, y } = resolvePosition(
    box,
    spec,
    spec.frameWidth,
    spec.frameHeight,
  );
  target.setPosition(x, y).setDepth(depth);
  target.anims.stop();
  target.play(key);
  return target;
}

/**
 * One-shot drop animation: play, hold for `holdMs`, fade 200ms, destroy.
 * Fire-and-forget (the DOM Depleting* components' lifecycle).
 */
export function playDropSheet(
  scene: Phaser.Scene,
  box: NodeBox,
  spec: SheetSpec,
  depth: number,
  holdMs = 1000,
) {
  const sprite = playSheet(scene, undefined, box, spec, depth);
  sprite.setAlpha(0);
  scene.tweens.add({ targets: sprite, alpha: 1, duration: 200 });
  sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    scene.time.delayedCall(holdMs, () => {
      if (!sprite.active) return;
      scene.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: 200,
        onComplete: () => sprite.destroy(),
      });
    });
  });
  return sprite;
}
