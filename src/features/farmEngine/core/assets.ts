import Phaser from "phaser";

/**
 * Loading helpers for the engine. Strict-parity rule: textures come from the
 * SAME Vite-imported URL maps the DOM farm renders (CROP_LIFECYCLE,
 * LEVEL_IMAGES, alternateArt variants, SUNNYSIDE...) — the imported URL is the
 * texture key, so there is no parallel asset manifest to drift out of sync.
 */

/**
 * The engine renders with LINEAR filtering globally (vector debug graphics,
 * possible painted art later); pixel art opts into NEAREST per texture — the
 * project-ii pattern. Since everything loaded through these helpers IS farm
 * pixel art, they apply NEAREST on load completion.
 */
const nearestOnLoad = (scene: Phaser.Scene, type: string, key: string) => {
  scene.load.once(`filecomplete-${type}-${key}`, () => {
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  });
};

/** Queue an image if the texture isn't already present. Returns the key. */
export function queueImage(scene: Phaser.Scene, url: string): string {
  if (!scene.textures.exists(url)) {
    scene.load.image(url, url);
    nearestOnLoad(scene, "image", url);
  }
  return url;
}

/**
 * Queue a spritesheet (fixed frame size, matching the SpriteAnimator config
 * the DOM farm uses for the same sheet). Returns the key.
 */
export function queueSpritesheet(
  scene: Phaser.Scene,
  url: string,
  frameConfig: { frameWidth: number; frameHeight: number },
): string {
  if (!scene.textures.exists(url)) {
    scene.load.spritesheet(url, url, frameConfig);
    nearestOnLoad(scene, "spritesheet", url);
  }
  return url;
}

/**
 * Start the loader if anything is queued and resolve when it settles. Safe to
 * call repeatedly — renderers queue what their current slice needs, then await
 * this before creating sprites (lazy loading is the norm: load the farm's
 * placed items, not the catalogue).
 */
export function runLoader(scene: Phaser.Scene): Promise<void> {
  return new Promise((resolve) => {
    if (!scene.load.list.size && !scene.load.inflight.size) {
      resolve();
      return;
    }
    scene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
    scene.load.start();
  });
}
