import Phaser from "phaser";
import { DPR, IS_COARSE_POINTER } from "./rendering";

/**
 * One Phaser.Game for the whole farm session.
 *
 * Each surface (the island, the home, the barn...) is its own scene, but they
 * all run inside the same game: the WebGL context, the compiled pipelines and
 * — above all — the texture cache outlive a hop between them.
 *
 * The first version built a new Phaser.Game per surface. Walking into the
 * home and back out threw away every texture and asked for all ~320 of the
 * farm's files again (cached, but each one still a request, a decode, a GPU
 * upload and, for sheets, a re-extrusion): 0.5–0.9s of 100ms frames on a
 * desktop, every single time. With one game a surface the player has already
 * seen costs nothing to return to.
 */

/**
 * How long the game survives with nothing mounted. A hop between surfaces
 * releases and re-acquires within one React commit, so anything above zero
 * keeps the engine across it; the grace is short because leaving for a
 * non-farm route (the plaza runs its own Phaser game) should hand the GL
 * context and texture memory back promptly.
 */
const RELEASE_GRACE_MS = 1000;

type Host = {
  game: Phaser.Game;
  onResize: () => void;
  releaseTimer: ReturnType<typeof setTimeout> | undefined;
  /** Scenes this host has run, to tell a warm engine from a cold one. */
  scenesStarted: number;
};

let host: Host | undefined;
let sceneSerial = 0;

type DevHooks = { __farmGame?: Phaser.Game; __farmScene?: Phaser.Scene };

/**
 * Whether to expose the engine on `window` for the parity/perf harness
 * (docs/phaser-farm-migration/scripts). Always in dev; in a production build
 * only with `localStorage["phaserFarm.hooks"]` set — React's dev build costs
 * several times the frame budget on its own, so anything about smoothness
 * has to be measured against a real bundle.
 */
export const devHooksEnabled = (): boolean => {
  if (import.meta.env.DEV) return true;
  try {
    return !!localStorage.getItem("phaserFarm.hooks");
  } catch {
    return false;
  }
};

const canvasSize = () => ({
  width: Math.round(window.innerWidth * DPR),
  height: Math.round(window.innerHeight * DPR),
});

function createHost(parent: HTMLElement): Host {
  // Backing store at physical resolution, squeezed back via zoom — see
  // core/rendering.ts for why. pixelArt must be explicitly false: it defaults
  // to true whenever scale.zoom !== 1 and force-disables antialiasing.
  // NEAREST is opted into per texture in core/assets.ts.
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    render: {
      pixelArt: false,
      antialias: true,
      // MSAA buffers on top of a DPR-supersampled canvas are pure memory
      // cost on phones — the supersample already smooths the downscale.
      antialiasGL: !IS_COARSE_POINTER,
      roundPixels: true,
    },
    loader: {
      // Boot is ~200 tiny image requests (median 21x21px), so it is bound by
      // round trips, not bytes: the time is (requests / parallel) x latency.
      // At 150ms latency a cap of 8 took 4.5s to fill the farm in; the whole
      // set is 14MB of texture memory and ~20ms of GPU upload, so there is no
      // decode spike to trickle. (The earlier mobile cap of 8 dated from
      // multi-megabyte animation strips, which the converter now refuses.)
      maxParallelDownloads: IS_COARSE_POINTER ? 32 : 64,
    },
    // CRITICAL: Phaser defaults to ALSO listening at window level, so clicks
    // on the HUD and modals would pan the camera and click plots through the
    // UI. Listen on the canvas only.
    input: {
      windowEvents: false,
    },
    scale: {
      mode: Phaser.Scale.NONE,
      ...canvasSize(),
      zoom: 1 / DPR,
    },
    scene: [],
  });

  // With canvas-only input, a drag released over a DOM element would lose its
  // pointerup and leave the camera panning. Capture the pointer on the canvas
  // for the duration of each press so the release always lands.
  game.events.once(Phaser.Core.Events.READY, () => {
    game.canvas.addEventListener("pointerdown", (event) => {
      game.canvas.setPointerCapture(event.pointerId);
    });
    keepCustomCursor(game);
  });

  const onResize = () => {
    const { width, height } = canvasSize();
    game.scale.resize(width, height);
  };
  window.addEventListener("resize", onResize);

  return { game, onResize, releaseTimer: undefined, scenesStarted: 0 };
}

/** Cursors the custom-cursor stylesheet draws with its own pointer art. */
const CUSTOM_CURSOR_COVERS = new Set(["pointer", "grab", "grabbing"]);

/**
 * Keep the pixel-art cursor [styles.css .custom-cursor] over the world.
 *
 * Interactive objects (`useHandCursor`) make Phaser write `cursor: pointer`
 * onto the canvas's inline style, which beats the stylesheet, so hovering
 * anything in the world swapped the pixel cursor for the system hand. The
 * DOM farm shows the same pointer art over clickable things, so while the
 * custom cursor is on Phaser leaves the canvas alone and it inherits the
 * stylesheet's cursor, pressed frame included. With the setting off the
 * system hand shows, as before.
 */
function keepCustomCursor(game: Phaser.Game) {
  const manager = game.input as Phaser.Input.InputManager & {
    setCursor(interactiveObject: { cursor?: string | boolean }): void;
  };
  const covered = (cursor: unknown) =>
    document.documentElement.classList.contains("custom-cursor") &&
    typeof cursor === "string" &&
    CUSTOM_CURSOR_COVERS.has(cursor);

  const setCursor = manager.setCursor.bind(manager);
  manager.setCursor = (interactiveObject) => {
    if (covered(interactiveObject.cursor)) return;
    setCursor(interactiveObject);
  };

  // Landscaping sets "grabbing" while dragging and "default" after. Written
  // inline, "default" pinned the system arrow over the canvas for the rest
  // of the session; an empty value inherits whichever cursor the page uses.
  const setDefaultCursor = manager.setDefaultCursor.bind(manager);
  manager.setDefaultCursor = (cursor: string) =>
    setDefaultCursor(cursor === "default" || covered(cursor) ? "" : cursor);
}

function destroyHost() {
  if (!host) return;
  const { game, onResize, releaseTimer } = host;
  host = undefined;
  if (releaseTimer !== undefined) clearTimeout(releaseTimer);
  window.removeEventListener("resize", onResize);
  // Clear the dev hooks — a stale global pins the destroyed game's memory.
  const hooks = window as DevHooks;
  if (hooks.__farmGame === game) delete hooks.__farmGame;
  delete hooks.__farmScene;
  game.destroy(true);
}

/**
 * Take the engine for a mount, creating it on first use. The canvas moves
 * into `parent`; React owns that element, so the canvas leaves the document
 * with it on unmount and is re-attached by the next acquire.
 */
export function acquireEngine(parent: HTMLElement): {
  game: Phaser.Game;
  /** True when the engine already existed — its textures are warm. */
  warm: boolean;
} {
  if (!host) {
    host = createHost(parent);
    if (devHooksEnabled()) (window as DevHooks).__farmGame = host.game;
    return { game: host.game, warm: false };
  }

  if (host.releaseTimer !== undefined) {
    clearTimeout(host.releaseTimer);
    host.releaseTimer = undefined;
  }
  const { game } = host;
  if (game.canvas.parentElement !== parent) {
    parent.appendChild(game.canvas);
    game.scale.parent = parent;
  }
  // The window may have been resized while nothing was mounted.
  host.onResize();
  // A previous mount may have left the world deaf (modal or nested route).
  game.input.enabled = true;
  return { game, warm: host.scenesStarted > 0 };
}

/** Give the engine back. It is destroyed if nothing re-acquires it soon. */
export function releaseEngine(game: Phaser.Game) {
  if (!host || host.game !== game) return;
  if (host.releaseTimer !== undefined) clearTimeout(host.releaseTimer);
  host.releaseTimer = setTimeout(destroyHost, RELEASE_GRACE_MS);
}

/** A scene key unique to this mount: removal is deferred, so keys can't repeat. */
export const nextSceneKey = (surface: string) => `${surface}#${++sceneSerial}`;

type PendingScene = { key: string };

/** Add and start a scene on the shared game. */
export function startScene(game: Phaser.Game, scene: Phaser.Scene) {
  if (host?.game === game) host.scenesStarted += 1;
  game.scene.add(scene.sys.settings.key, scene, true);
  if (devHooksEnabled()) (window as DevHooks).__farmScene = scene;
}

/**
 * Dispose, stop and remove a scene. The scene's own teardown (unsubscribing
 * renderers, saving the camera) runs first, while its plugins are alive.
 */
export function stopScene(
  game: Phaser.Game,
  scene: Phaser.Scene & { dispose(): void },
) {
  scene.dispose();
  const key = scene.sys.settings.key;
  const manager = game.scene as Phaser.Scenes.SceneManager & {
    _pending: PendingScene[];
  };
  if (!manager.isBooted) {
    // Not started yet (unmounted before the game finished booting): pull it
    // from the boot queue, or it would start with nothing to stop it.
    manager._pending = manager._pending.filter((entry) => entry.key !== key);
    return;
  }
  manager.stop(key);
  manager.remove(key);
  const hooks = window as DevHooks;
  if (hooks.__farmScene === scene) delete hooks.__farmScene;
}
