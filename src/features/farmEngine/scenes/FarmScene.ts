import Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameBridge } from "../bridge/GameBridge";
import type { Unsubscribe } from "../bridge/subscriptions";
import { FarmCameraController } from "../core/camera";
import { BumpkinWorker } from "../worker/BumpkinWorker";
import { YieldEventFloats } from "../components/YieldEventFloats";
import { FarmClock } from "../core/clock";
import type { EntityRenderer } from "../entities/EntityRenderer";
import { RENDERERS, type RendererFactory } from "../entities/registry";
import type { FarmSurface } from "../core/surface";
import { LandscapingController } from "../landscaping/LandscapingController";
import { DebugGrid } from "../dev/DebugGrid";
import { StressBumpkins } from "../dev/StressBumpkins";

/**
 * The farm scene is a thin conductor: it owns the camera, the clock, and the
 * lifecycle of every renderer in the registry — and nothing else. Layers
 * (ocean, land base, dirt, clouds) join in Phase 1; entity renderers register
 * themselves via entities/registry.ts from Phase 2 on.
 */

const _expansionCount = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

// Placeholder until Phase 1's OceanLayer tiles the real art.
const OCEAN_PLACEHOLDER_COLOR = "#63b0cd";

export class FarmScene extends Phaser.Scene {
  readonly farmCamera: FarmCameraController;
  /** EXPERIMENT [worker/BumpkinWorker.ts] — only on the farm surface. */
  worker?: BumpkinWorker;
  private yieldEventFloats?: YieldEventFloats;
  readonly clock = new FarmClock();

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
  }

  create() {
    this.cameras.main.setBackgroundColor(OCEAN_PLACEHOLDER_COLOR);

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

    if (this.location === "farm") {
      this.worker = new BumpkinWorker(this, this.bridge);
      this.bridge.workerStop = () => this.worker?.stop();
      // Bare-ground tap while a bumpkin is selected: walk there. Runs after
      // entity handlers, so a click that hit a resource is already swallowed.
      this.input.on(
        Phaser.Input.Events.POINTER_UP,
        (pointer: Phaser.Input.Pointer) => {
          if (!this.worker?.isActive()) return;
          if (pointer.getDistance() > 8) return; // a pan, not a tap
          const hit = this.input.hitTestPointer(pointer);
          if (hit.length) return; // an entity handled it
          this.worker.moveTo({ x: pointer.worldX, y: pointer.worldY });
        },
      );
    }
    this.farmCamera.attach(this.bridge.select(_expansionCount));
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

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.teardown());
  }

  update(time: number, delta: number) {
    this.clock.tick(delta);
    this.renderers.forEach((renderer) => renderer.update(time, delta));
  }

  private teardown() {
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
    this.worker?.destroy();
    this.yieldEventFloats?.destroy();
    this.yieldEventFloats = undefined;
    this.worker = undefined;
    this.farmCamera.destroy();
  }
}
