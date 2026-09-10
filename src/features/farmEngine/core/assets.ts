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
 * How far a frame's UVs are pulled in from an edge it SHARES with another
 * frame, as a fraction of a texel.
 *
 * Frames in our sheets touch with no padding between them, and the camera
 * zoom is fractional (DPR x 2.625 x user zoom), so a frame boundary almost
 * never lands on a whole screen pixel. The edge-most fragment can then
 * interpolate a UV a hair past the boundary and sample the NEIGHBOURING
 * frame — which is the thin line along the top of an animated sprite (the
 * previous frame's bottom row) and the flicker it causes as the animation
 * cycles.
 *
 * A quarter texel is plenty to clear the floating-point boundary while
 * staying well inside the edge texel, so nothing is cropped. (Half a texel is
 * the textbook figure, but that's for LINEAR filtering; these textures are
 * NEAREST, where only the boundary itself matters.) The alternative fix is
 * extruding every frame in the sheet generator, which would rewrite 200-odd
 * committed PNGs for the same result.
 */
const EDGE_INSET_TEXELS = 0.25;

/**
 * Pull each frame's UVs off any edge it shares with a neighbour. Edges that
 * are the image's own border have nothing to bleed from and are left alone.
 */
function insetSharedFrameEdges(texture: Phaser.Textures.Texture) {
  const source = texture.source[0];
  const { width, height } = source;
  if (!width || !height) return;
  const insetU = EDGE_INSET_TEXELS / width;
  const insetV = EDGE_INSET_TEXELS / height;

  for (const name of texture.getFrameNames()) {
    const frame = texture.get(name);
    if (frame.cutX > 0) frame.u0 += insetU;
    if (frame.cutX + frame.cutWidth < width) frame.u1 -= insetU;
    if (frame.cutY > 0) frame.v0 += insetV;
    if (frame.cutY + frame.cutHeight < height) frame.v1 -= insetV;
  }
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
    scene.load.once(`filecomplete-spritesheet-${url}`, () => {
      insetSharedFrameEdges(scene.textures.get(url));
    });
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
