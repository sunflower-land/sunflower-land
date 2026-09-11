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

type FrameSize = { frameWidth: number; frameHeight: number };

/**
 * Re-lay a loaded sheet with every frame padded by a 1px copy of its own
 * edge, then re-register it under the same key. Frame indices are unchanged.
 *
 * Our sheets pack frames edge to edge, and Phaser 3.90's roundPixels snaps
 * only a quad's top-left corner, so at our fractional zoom (DPR x 2.625 x
 * user zoom) a sprite's far edges land mid-pixel. With MSAA on, a partially
 * covered edge pixel is shaded at its centre — outside the quad — so its UV
 * overshoots the frame by a fraction of a texel and samples the NEIGHBOURING
 * frame: the thin line of the previous frame along an animated sprite.
 *
 * With the padding, that overshoot lands on a copy of the frame's own edge
 * texel, which is invisible, and every frame keeps an exact texel mapping.
 * Don't swap this for pulling UVs inward: that only moves edges that HAVE a
 * neighbour, so a strip's first, middle and last frames map differently —
 * the art bobs a pixel as it cycles and the squeezed edge rows read as
 * clipping.
 */
function extrudeFrames(
  scene: Phaser.Scene,
  key: string,
  { frameWidth: w, frameHeight: h }: FrameSize,
) {
  const textures = scene.textures;
  const loaded = textures.get(key);
  // Repeat queue calls while the sheet is in flight each register a handler.
  if ((loaded.customData as { extruded?: boolean }).extruded) return;

  const source = loaded.getSourceImage() as HTMLImageElement;
  const cols = Math.floor(source.width / w);
  const rows = Math.floor(source.height / h);
  const cellW = w + 2;
  const cellH = h + 2;
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellW;
  canvas.height = rows * cellH;
  const ctx = canvas.getContext("2d");
  if (!ctx || cols * rows <= 1) return; // a lone frame has nothing to bleed

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = col * w;
      const sy = row * h;
      const dx = col * cellW + 1;
      const dy = row * cellH + 1;
      // Copy a rect of this frame to its cell, offset by (ox, oy).
      const blit = (
        x: number,
        y: number,
        bw: number,
        bh: number,
        ox = 0,
        oy = 0,
      ) =>
        ctx.drawImage(
          source,
          sx + x,
          sy + y,
          bw,
          bh,
          dx + x + ox,
          dy + y + oy,
          bw,
          bh,
        );
      blit(0, 0, w, h);
      blit(0, 0, w, 1, 0, -1); // top edge
      blit(0, h - 1, w, 1, 0, 1); // bottom edge
      blit(0, 0, 1, h, -1, 0); // left edge
      blit(w - 1, 0, 1, h, 1, 0); // right edge
      blit(0, 0, 1, 1, -1, -1); // corners
      blit(w - 1, 0, 1, 1, 1, -1);
      blit(0, h - 1, 1, 1, -1, 1);
      blit(w - 1, h - 1, 1, 1, 1, 1);
    }
  }

  textures.remove(key);
  // TextureManager.create accepts a canvas; the typings only say image.
  const padded = textures.addSpriteSheet(
    key,
    canvas as unknown as HTMLImageElement,
    { frameWidth: w, frameHeight: h, margin: 1, spacing: 2 },
  );
  if (!padded) return;
  (padded.customData as { extruded?: boolean }).extruded = true;
  padded.setFilter(Phaser.Textures.FilterMode.NEAREST);
}

/**
 * Queue a spritesheet (fixed frame size, matching the SpriteAnimator config
 * the DOM farm uses for the same sheet). Returns the key.
 */
export function queueSpritesheet(
  scene: Phaser.Scene,
  url: string,
  frameConfig: FrameSize,
): string {
  if (!scene.textures.exists(url)) {
    scene.load.spritesheet(url, url, frameConfig);
    nearestOnLoad(scene, "spritesheet", url);
    scene.load.once(`filecomplete-spritesheet-${url}`, () =>
      extrudeFrames(scene, url, frameConfig),
    );
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
