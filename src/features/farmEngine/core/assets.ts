import Phaser from "phaser";
import { CONFIG } from "lib/config";
import { ATLAS_FRAMES, ATLAS_PAGES } from "./atlasManifest";

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
  /** Resolve one pending key. */
  settle: (key: string) => void;
  /** URLs waiting on an atlas page this scene is loading, by page. */
  atlasWaiters: Map<number, Map<string, AtlasFrame>>;
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
    settle: (key) => settle(key),
    atlasWaiters: new Map(),
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

/**
 * TEXTURE ATLAS. Most of what a farm draws is tiny shared art on the image
 * CDN — ~200 files at boot, one request each, so boot was bound by round
 * trips. `scripts/atlas/pack.js` packs every small static image there into a
 * few pages; here each CDN URL becomes an ALIAS texture: its own key (so no
 * call site changes — `add.image(x, y, url)` still works) whose single frame
 * is a rectangle of the shared page.
 *
 * Aliases share the page's TextureSource, so there is one GPU texture per
 * page: one request and one upload instead of hundreds, and sprites from the
 * same page batch into the same draw call.
 *
 * Because an alias's source is the whole page, never size anything from
 * `getSourceImage()` — use the frame (`textures.get(key).get().width`).
 */
type AtlasFrame = readonly [number, number, number, number, number];

const ATLAS_ROOT = `${CONFIG.PROTECTED_IMAGE_URL}/`;
const atlasPageKey = (page: number) => `farm-atlas-${page}`;
/** Pages that failed to load this session: their art loads file by file. */
const failedAtlasPages = new Set<number>();

/** `localStorage["phaserFarm.atlas"] = "off"` loads every file on its own. */
const atlasEnabled = (() => {
  try {
    return localStorage.getItem("phaserFarm.atlas") !== "off";
  } catch {
    return true;
  }
})();

const atlasFrameFor = (url: string): AtlasFrame | undefined => {
  if (!atlasEnabled || !url.startsWith(ATLAS_ROOT)) return undefined;
  const frame = ATLAS_FRAMES[url.slice(ATLAS_ROOT.length)];
  return frame && !failedAtlasPages.has(frame[0]) ? frame : undefined;
};

const isAtlasAlias = (texture: Phaser.Textures.Texture) =>
  !!(texture.customData as { atlasAlias?: boolean }).atlasAlias;

/** Register `url` as a texture whose one frame is a rect of a loaded page. */
function addAtlasAlias(scene: Phaser.Scene, url: string, frame: AtlasFrame) {
  const manager = scene.textures;
  if (manager.exists(url)) return;
  const [page, x, y, width, height] = frame;
  const source = manager.get(atlasPageKey(page)).source[0];

  // No sources of its own (an empty list uploads nothing); borrow the page's.
  const alias = new Phaser.Textures.Texture(manager, url, [], width, height);
  alias.source = [source];
  alias.add("__BASE", 0, x, y, width, height);
  (alias.customData as { atlasAlias?: boolean }).atlasAlias = true;
  // Texture.destroy destroys its sources; an alias must let go of the shared
  // one first, or removing any alias would take the page's GPU texture —
  // and every other alias — with it.
  const destroy = alias.destroy.bind(alias);
  alias.destroy = () => {
    alias.source = [];
    destroy();
  };

  // TextureManager has no public way to adopt a ready-made Texture; this is
  // what its own add* methods do after building one.
  (manager.list as Record<string, Phaser.Textures.Texture>)[url] = alias;
  manager.emit(Phaser.Textures.Events.ADD, url, alias);
  manager.emit(`${Phaser.Textures.Events.ADD_KEY}${url}`, alias);
}

/** Queue one image the normal way: its own request, its own texture. */
function queueOwnImage(scene: Phaser.Scene, url: string) {
  scene.load.image(url, url);
  nearestOnLoad(scene, "image", url);
}

/** Serve `url` from its atlas page, loading the page if this is the first ask. */
function queueFromAtlas(scene: Phaser.Scene, url: string, frame: AtlasFrame) {
  const page = frame[0];
  const key = atlasPageKey(page);
  if (scene.textures.exists(key)) {
    // Page already in memory: the texture exists before this call returns.
    addAtlasAlias(scene, url, frame);
    return;
  }

  const tracker = trackerFor(scene);
  track(scene, url);
  const waiting = tracker.atlasWaiters.get(page);
  if (waiting) {
    waiting.set(url, frame);
    return;
  }

  const waiters = new Map<string, AtlasFrame>([[url, frame]]);
  tracker.atlasWaiters.set(page, waiters);
  scene.load.image(key, ATLAS_PAGES[page]);

  const onError = (file: Phaser.Loader.File) => {
    if (file.key !== key) return;
    scene.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR, onError);
    // Fall back to the individual files; they are still pending and settle
    // as each one lands.
    failedAtlasPages.add(page);
    tracker.atlasWaiters.delete(page);
    waiters.forEach((_frame, waiter) => queueOwnImage(scene, waiter));
    scene.load.start();
  };
  scene.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, onError);
  scene.load.once(`filecomplete-image-${key}`, () => {
    scene.load.off(Phaser.Loader.Events.FILE_LOAD_ERROR, onError);
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    tracker.atlasWaiters.delete(page);
    waiters.forEach((waiterFrame, waiter) => {
      addAtlasAlias(scene, waiter, waiterFrame);
      tracker.settle(waiter);
    });
  });
}

/** Queue an image if the texture isn't already present. Returns the key. */
export function queueImage(scene: Phaser.Scene, url: string): string {
  if (!scene.textures.exists(url)) {
    const frame = atlasFrameFor(url);
    if (frame) {
      queueFromAtlas(scene, url, frame);
      return url;
    }
    // Track before queueing: a key another renderer already has in flight
    // still belongs to this caller's batch.
    const inFlight = trackerFor(scene).pending.has(url);
    track(scene, url);
    if (!inFlight) queueOwnImage(scene, url);
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
  // The atlas holds every small image as ONE frame. Something asking for the
  // same file as a sheet needs the real file with its frames cut.
  if (scene.textures.exists(url) && isAtlasAlias(scene.textures.get(url))) {
    scene.textures.remove(url);
  }
  trackers.get(scene)?.atlasWaiters.forEach((waiters) => waiters.delete(url));
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
