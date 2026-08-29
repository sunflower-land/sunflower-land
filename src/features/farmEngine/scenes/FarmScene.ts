import Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameBridge } from "../bridge/GameBridge";
import type { Unsubscribe } from "../bridge/subscriptions";
import { FarmCameraController } from "../core/camera";
import { FarmClock } from "../core/clock";
import type { EntityRenderer } from "../entities/EntityRenderer";
import { RENDERERS } from "../entities/registry";
import { LandscapingController } from "../landscaping/LandscapingController";
import { DebugGrid } from "../dev/DebugGrid";

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
  readonly clock = new FarmClock();

  private renderers: EntityRenderer<unknown>[] = [];
  private subscriptions: Unsubscribe[] = [];
  private debugGrid: DebugGrid | undefined;
  private landscaping: LandscapingController | undefined;

  /** True while the game machine is in the landscaping state (edit mode). */
  landscapingActive = false;

  /** True while visiting another farm [useVisiting: visitorId set]. */
  visitingActive = false;

  constructor(public readonly bridge: GameBridge) {
    super({ key: "farm" });
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

    this.farmCamera.attach(this.bridge.select(_expansionCount));
    this.subscriptions.push(
      this.bridge.subscribe(_expansionCount, (count) =>
        this.farmCamera.setExpansionCount(count),
      ),
    );

    this.renderers = Object.values(RENDERERS).map((factory) =>
      factory(this, this.bridge),
    );
    this.renderers.forEach((renderer) => renderer.mount());

    this.landscaping = new LandscapingController(this, this.bridge);
    this.landscaping.mount();

    if (localStorage.getItem("phaserFarm.debug")) {
      this.debugGrid = new DebugGrid(this);
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
    this.clock.dispose();
    this.farmCamera.destroy();
  }
}
