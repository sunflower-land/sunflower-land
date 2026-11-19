import Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameBridge } from "../bridge/GameBridge";
import type { Unsubscribe } from "../bridge/subscriptions";
import { FarmCameraController } from "../core/camera";
import { YieldEventFloats } from "../components/YieldEventFloats";
import { FarmClock } from "../core/clock";
import type { EntityRenderer } from "../entities/EntityRenderer";
import { RENDERERS, type RendererFactory } from "../entities/registry";
import type { FarmSurface } from "../core/surface";
import { LandscapingController } from "../landscaping/LandscapingController";
import { DebugGrid } from "../dev/DebugGrid";
import { CAVE_CAMERA_VIEW } from "../entities/cave/caveGeometry";
import { StressBumpkins } from "../dev/StressBumpkins";

/**
 * The farm scene is a thin conductor: it owns the camera, the clock, and the
 * lifecycle of every renderer in the registry — and nothing else. Layers
 * (ocean, land base, dirt, clouds) join in Phase 1; entity renderers register
 * themselves via entities/registry.ts from Phase 2 on.
 */

const _expansionCount = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

/**
 * What the camera clears to before this surface's own art has painted.
 *
 * The farm shows ocean, so the ocean tone is the right placeholder there.
 * Interiors show none, and using the ocean tone for them meant every hop
 * between the farm and an animal house flashed light blue: the engine tears
 * the game down and rebuilds it on a surface change, and the boot cover
 * doesn't re-arm for an already-loaded session, so that raw clear colour is
 * briefly all there is. Interiors clear to the boot cover's own tone
 * [FarmLoading] instead, which leaves nothing visible to flash.
 */
const CLEAR_COLOR: Partial<Record<FarmSurface, string>> = {
  farm: "#63b0cd",
};
const INTERIOR_CLEAR_COLOR = "#0e4a6d";

/**
 * The tone a surface fades in from and out to — the boot cover's own colour
 * [FarmLoading], so a cold boot, a warm hop and the cover lifting all read as
 * one continuous dissolve.
 */
export const VEIL_COLOR = 0x0e4a6d;
const VEIL_RGB = [
  (VEIL_COLOR >> 16) & 0xff,
  (VEIL_COLOR >> 8) & 0xff,
  VEIL_COLOR & 0xff,
] as const;

/** Dissolve from the veil into the surface once it is ready. */
export const REVEAL_MS = 220;
/** Dissolve out to the veil before leaving for another surface. */
const LEAVE_MS = 140;

/**
 * The surface is revealed as soon as its GROUND is drawn (the renderers
 * flagged `gatesReveal`: ocean, land, dirt, the room backdrop), not when
 * everything on it has loaded. Whatever is still on its way fades in as it
 * arrives [fadeArrivals].
 *
 * Waiting for every renderer made the cover's length the slowest file's:
 * a real farm pulls pet, bud and collectible art from several CDNs, and
 * one slow host held the whole screen for seconds over a world that was
 * 95% drawn.
 */

/**
 * After the ground is in, wait this long for the rest. On a warm cache
 * everything lands inside it and the farm appears complete in one dissolve;
 * past it, the reveal goes ahead without the stragglers.
 */
const REVEAL_GRACE_MS = 300;
/** If even the ground hasn't arrived by now, reveal regardless. */
const REVEAL_CAP_MS = 5000;
/** Fade for objects that arrive after the reveal. */
const ARRIVAL_FADE_MS = 200;
/** Stop fading arrivals after this long, whatever is still outstanding. */
const ARRIVAL_WINDOW_MS = 20000;

export class FarmScene extends Phaser.Scene {
  readonly farmCamera: FarmCameraController;
  private yieldEventFloats?: YieldEventFloats;
  /** Half-second phase: the renderers' own 1s passes are spread from 0 up. */
  readonly clock = new FarmClock(500);

  private renderers: EntityRenderer<unknown>[] = [];
  private subscriptions: Unsubscribe[] = [];
  private debugGrid: DebugGrid | undefined;
  private stressBumpkins: StressBumpkins | undefined;
  private landscaping: LandscapingController | undefined;

  /** True while the game machine is in the landscaping state (edit mode). */
  landscapingActive = false;

  /** True while visiting another farm [useVisiting: visitorId set]. */
  visitingActive = false;

  /**
   * Which placement surface this scene renders. Renderers read it to pick
   * their slice (`game.collectibles` vs `game.home.collectibles`, ...) and
   * landscaping sends it as the `location` on its events.
   */
  readonly location: FarmSurface;
  private readonly rendererSet: Record<string, RendererFactory>;

  /**
   * Resolves when the surface is revealed: every renderer's first sync has
   * settled (or the cap ran out) and the camera has begun dissolving in.
   */
  readonly revealed: Promise<void>;
  private resolveRevealed!: () => void;
  private stopArrivals: (() => void) | undefined;
  private created = false;
  private tornDown = false;
  private leaving = false;

  constructor(
    public readonly bridge: GameBridge,
    options: {
      key?: string;
      location?: FarmSurface;
      renderers?: Record<string, RendererFactory>;
    } = {},
  ) {
    super({ key: options.key ?? "farm" });
    this.location = options.location ?? "farm";
    this.rendererSet = options.renderers ?? RENDERERS;
    this.farmCamera = new FarmCameraController(this, bridge.anchors);
    this.revealed = new Promise((resolve) => (this.resolveRevealed = resolve));
  }

  create() {
    this.created = true;
    performance.mark(`farm:scene-create:${this.location}`);
    this.cameras.main.setBackgroundColor(
      CLEAR_COLOR[this.location] ?? INTERIOR_CLEAR_COLOR,
    );
    // Start fully veiled: renderers fill the surface in behind it, so the
    // player never watches the world assemble group by group.
    this.cameras.main.fadeOut(1, ...VEIL_RGB);

    this.visitingActive = this.bridge.select(
      (state) => state.context.visitorId !== undefined,
    );
    this.subscriptions.push(
      this.bridge.subscribe(
        (state) => state.context.visitorId !== undefined,
        (visiting) => {
          this.visitingActive = visiting;
        },
      ),
    );

    // Standard "+N with icon" for claims dispatched from anywhere — a
    // renderer click or a React modal that closes right after.
    this.yieldEventFloats = new YieldEventFloats(this, this.bridge);

    this.farmCamera.attach(
      this.bridge.select(_expansionCount),
      // [Cave.tsx] the cave has its own board and opens on its ladder.
      this.location === "cave" ? CAVE_CAMERA_VIEW : undefined,
    );
    // Panning or zooming dismisses the SFT popover — a tooltip riding along
    // with the viewport reads as broken, especially on touch.
    this.farmCamera.onUserGesture = () => this.bridge.sftPopover.set(null);
    this.subscriptions.push(
      this.bridge.subscribe(_expansionCount, (count) =>
        this.farmCamera.setExpansionCount(count),
      ),
    );

    this.renderers = Object.values(this.rendererSet).map((factory) =>
      factory(this, this.bridge),
    );
    this.renderers.forEach((renderer) => renderer.mount());

    this.landscaping = new LandscapingController(this, this.bridge);
    this.landscaping.mount();

    if (localStorage.getItem("phaserFarm.debug")) {
      this.debugGrid = new DebugGrid(this);
    }
    if (localStorage.getItem("phaserFarm.dev.stress")) {
      this.stressBumpkins = new StressBumpkins(this);
      void this.stressBumpkins.create();
    }

    // Fallbacks only — the mount calls dispose() before stopping the scene.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.dispose());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.dispose());

    void this.revealWhenReady();
  }

  private async revealWhenReady() {
    if (import.meta.env.DEV) {
      // Per-renderer boot timeline: `performance.getEntriesByType("mark")`.
      this.renderers.forEach((renderer) =>
        renderer.firstSync.then(() =>
          performance.mark(`farm:first-sync:${renderer.constructor.name}`),
        ),
      );
    }
    const everything = Promise.all(
      this.renderers.map((renderer) => renderer.firstSync),
    );
    // Renderers that must be in before the surface is shown; if a surface
    // flags none, everything gates.
    const flagged = this.renderers.filter((renderer) => renderer.gatesReveal);
    const gates = flagged.length ? flagged : this.renderers;

    let allSettled = false;
    let groundAt: number | undefined;
    let gatesLeft = gates.length;
    let timer: ReturnType<typeof setTimeout> | undefined;
    await new Promise<void>((resolve) => {
      const startedAt = performance.now();
      const check = () => {
        const now = performance.now();
        if (
          this.tornDown ||
          allSettled ||
          (groundAt !== undefined && now - groundAt >= REVEAL_GRACE_MS) ||
          now - startedAt >= REVEAL_CAP_MS
        ) {
          resolve();
        }
      };
      gates.forEach((renderer) =>
        renderer.firstSync.then(() => {
          gatesLeft -= 1;
          if (gatesLeft === 0) {
            groundAt = performance.now();
            performance.mark(`farm:ground-ready:${this.location}`);
          }
          check();
        }),
      );
      void everything.then(() => {
        allSettled = true;
        check();
      });
      // Wall clock, not the scene clock: Phaser caps each frame's delta, so
      // under exactly the load this guards against scene time runs slow.
      timer = setInterval(check, 50);
      check();
    });
    clearInterval(timer);
    if (this.tornDown) return;
    performance.mark(`farm:scene-ready:${this.location}`);
    // One frame for the objects just created to reach the display list and
    // their textures the GPU, so the dissolve starts on a settled frame.
    this.events.once(Phaser.Scenes.Events.POST_UPDATE, () => {
      if (this.tornDown || this.leaving) return;
      this.cameras.main.fadeIn(REVEAL_MS, ...VEIL_RGB);
      this.resolveRevealed();
      if (!allSettled) this.fadeArrivals(everything);
    });
  }

  /**
   * Until the remaining first syncs settle, ease in whatever gets added to
   * the scene instead of letting it pop onto a world already in view.
   *
   * Each new top-level object fades from 0 to the alpha its renderer gave
   * it. The alpha is read at pre-render — after the renderer has finished
   * setting the object up this tick — so a deliberately dimmed object (a
   * building under construction) lands at its own alpha, not at 1.
   */
  private fadeArrivals(everything: Promise<unknown>) {
    type Fadeable = Phaser.GameObjects.GameObject & {
      alpha: number;
      visible: boolean;
      setAlpha(alpha: number): unknown;
    };
    const arrived: Phaser.GameObjects.GameObject[] = [];
    const onAdded = (object: Phaser.GameObjects.GameObject) => {
      arrived.push(object);
    };
    const flush = () => {
      for (const object of arrived.splice(0)) {
        const candidate = object as Partial<Fadeable> &
          Phaser.GameObjects.GameObject;
        if (
          !candidate.active ||
          candidate.parentContainer ||
          candidate.type === "Zone" ||
          typeof candidate.setAlpha !== "function" ||
          !candidate.visible ||
          !candidate.alpha
        ) {
          continue;
        }
        const target = candidate.alpha;
        candidate.setAlpha(0);
        this.tweens.add({
          targets: candidate,
          alpha: target,
          duration: ARRIVAL_FADE_MS,
          ease: "Sine.easeOut",
        });
      }
    };
    this.events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, onAdded);
    this.events.on(Phaser.Scenes.Events.PRE_RENDER, flush);

    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(windowTimer);
      this.events.off(Phaser.Scenes.Events.ADDED_TO_SCENE, onAdded);
      this.events.off(Phaser.Scenes.Events.PRE_RENDER, flush);
      performance.mark(`farm:arrivals-done:${this.location}`);
    };
    const windowTimer = setTimeout(stop, ARRIVAL_WINDOW_MS);
    void everything.then(stop);
    this.stopArrivals = stop;
  }

  /**
   * Dissolve to the veil, then run `then` (a route change to another
   * surface). Input goes deaf for the duration so a second tap can't land on
   * a world that is on its way out.
   */
  leave(then: () => void) {
    if (this.leaving || this.tornDown || !this.created) {
      then();
      return;
    }
    this.leaving = true;
    this.input.enabled = false;
    const camera = this.cameras.main;
    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, then);
    camera.fadeOut(LEAVE_MS, ...VEIL_RGB);
  }

  update(time: number, delta: number) {
    this.clock.tick(delta);
    for (const renderer of this.renderers) {
      renderer.flushDeferred(time);
      renderer.update(time, delta);
    }
  }

  /**
   * Tear down everything the scene owns. Called by the mount BEFORE the
   * scene is stopped: Phaser's own plugins listen to SHUTDOWN first (they
   * registered at boot), so by the time a SHUTDOWN handler of ours ran the
   * camera would already be gone and its position could not be saved.
   */
  dispose() {
    if (this.tornDown) return;
    this.tornDown = true;
    // Anything still awaiting the reveal (the boot cover) must not hang.
    this.resolveRevealed();
    this.stopArrivals?.();
    // Stopped before create ran (unmounted mid-boot): nothing was built, and
    // saving the untouched camera would overwrite the player's real position.
    if (!this.created) return;
    this.landscaping?.destroy();
    this.landscaping = undefined;
    this.renderers.forEach((renderer) => renderer.destroy());
    this.renderers = [];
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
    this.debugGrid?.destroy();
    this.debugGrid = undefined;
    this.stressBumpkins?.destroy();
    this.stressBumpkins = undefined;
    this.clock.dispose();
    this.yieldEventFloats?.destroy();
    this.yieldEventFloats = undefined;
    this.farmCamera.destroy();
  }
}
