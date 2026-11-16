import Phaser from "phaser";

/**
 * Loading helpers for the engine. Strict-parity rule: textures come from the
 * SAME Vite-imported URL maps the DOM farm renders (CROP_LIFECYCLE,
 * LEVEL_IMAGES, alternateArt variants, SUNNYSIDE...) — the imported URL is the
 * texture key, so there is no parallel asset manifest to drift out of sync.
 */

/**
 * Per-scene load tracking. Renderers queue what their slice needs and then
 * await `runLoader` — which resolves when THEIR files have settled, not when
 * the scene's whole loader drains.
 *
 * Awaiting the loader's COMPLETE event (the first version) tied every
 * renderer to the slowest file anyone had queued: at boot all ~30 renderers
 * queue in the same tick, so the ocean, the land and every crop waited on the
 * last CDN pet sheet before a single object was created. Measured on a home
 * interior's first visit: 3.7s of empty screen for 114 files, though the room
 * art itself arrived in the first few hundred ms.
 */
type LoadTracker = {
  /** Keys queued since the last runLoader call — the caller's batch. */
  batch: Set<string>;
  /** Resolvers for keys still in flight, shared by every batch awaiting them. */
  pending: Map<string, { promise: Promise<void>; resolve: () => void }>;
  /** Files asked for / settled over the scene's lifetime, for boot progress. */
  requested: number;
  settled: number;
};

const trackers = new WeakMap<Phaser.Scene, LoadTracker>();

function trackerFor(scene: Phaser.Scene): LoadTracker {
  const existing = trackers.get(scene);
  if (existing) return existing;

  const tracker: LoadTracker = {
    batch: new Set(),
    pending: new Map(),
    requested: 0,
    settled: 0,
  };
  trackers.set(scene, tracker);

  const settle = (key: string) => {
    const entry = tracker.pending.get(key);
    if (!entry) return;
    tracker.pending.delete(key);
    tracker.settled += 1;
    entry.resolve();
  };
  const settleAll = () => [...tracker.pending.keys()].forEach(settle);

  // FILE_COMPLETE fires before the per-key `filecomplete-<type>-<key>` event
  // in the same call stack, and awaiters resume on a microtask — so the
  // NEAREST filter and frame extrusion below have always run by then.
  scene.load.on(Phaser.Loader.Events.FILE_COMPLETE, settle);
  // A failed file settles too: its renderer carries on without the texture
  // rather than hanging (and holding the boot cover up) forever.
  scene.load.on(
    Phaser.Loader.Events.FILE_LOAD_ERROR,
    (file: Phaser.Loader.File) => settle(file.key),
  );
  // Belt and braces — nothing may stay pending once the loader is idle or
  // the scene is gone.
  scene.load.on(Phaser.Loader.Events.COMPLETE, settleAll);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, settleAll);
  scene.events.once(Phaser.Scenes.Events.DESTROY, settleAll);

  return tracker;
}

/** Note a not-yet-loaded key as part of the caller's current batch. */
function track(scene: Phaser.Scene, key: string) {
  const tracker = trackerFor(scene);
  if (!tracker.pending.has(key)) {
    let resolve!: () => void;
    const promise = new Promise<void>((done) => (resolve = done));
    tracker.pending.set(key, { promise, resolve });
    tracker.requested += 1;
  }
  tracker.batch.add(key);
}

/** Files settled vs asked for on this scene so far — real boot progress. */
export function loadProgress(scene: Phaser.Scene): {
  requested: number;
  settled: number;
} {
  const tracker = trackers.get(scene);
  return {
    requested: tracker?.requested ?? 0,
    settled: tracker?.settled ?? 0,
  };
}

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
    // Track before queueing: a key another renderer already has in flight
    // still belongs to this caller's batch.
    const inFlight = trackerFor(scene).pending.has(url);
    track(scene, url);
    if (!inFlight) {
      scene.load.image(url, url);
      nearestOnLoad(scene, "image", url);
    }
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
    const inFlight = trackerFor(scene).pending.has(url);
    track(scene, url);
    if (!inFlight) {
      scene.load.spritesheet(url, url, frameConfig);
      nearestOnLoad(scene, "spritesheet", url);
      scene.load.once(`filecomplete-spritesheet-${url}`, () =>
        extrudeFrames(scene, url, frameConfig),
      );
    }
  }
  return url;
}

/**
 * Start the loader and resolve once everything THIS caller queued since its
 * last call has settled (loaded or failed). Safe to call repeatedly —
 * renderers queue what their current slice needs, then await this before
 * creating sprites (lazy loading is the norm: load the farm's placed items,
 * not the catalogue).
 *
 * The queue calls and this call must sit in the same synchronous block: the
 * batch is whatever was queued on the scene since the previous runLoader.
 */
export function runLoader(scene: Phaser.Scene): Promise<void> {
  const tracker = trackerFor(scene);
  const waits: Promise<void>[] = [];
  for (const key of tracker.batch) {
    const entry = tracker.pending.get(key);
    if (entry) waits.push(entry.promise);
  }
  tracker.batch = new Set();

  if (!waits.length) return Promise.resolve();
  // No-op while the loader is already running; files added mid-load join it.
  scene.load.start();
  return Promise.all(waits).then(() => undefined);
}
