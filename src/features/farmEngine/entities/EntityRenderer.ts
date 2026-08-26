import type { MachineState } from "features/game/lib/gameMachine";
import type { GameBridge } from "../bridge/GameBridge";
import type { EqualityFn, Unsubscribe } from "../bridge/subscriptions";
import type { FarmScene } from "../scenes/FarmScene";

/**
 * One renderer instance per ENTITY TYPE (not per entity). It subscribes to its
 * slice of game state and reconciles Phaser display objects keyed by entity id
 * — the engine's equivalent of a keyed React list. All game rules (timing
 * maths, yields, collision) stay in features/game and are imported; a renderer
 * that contains rules is at the wrong layer.
 *
 * Lifecycle (driven by FarmScene):
 *   mount()   — subscribe + initial sync. Called once from scene create.
 *   sync()    — reconcile display objects against the slice. Called on mount
 *               and whenever the selected slice changes.
 *   update()  — per-frame needs only (sprite motion, bee flight). Most
 *               renderers never override it.
 *   destroy() — unsubscribe and destroy every owned object. Must leave nothing
 *               behind; the scene calls it on shutdown.
 */
export abstract class EntityRenderer<Slice> {
  private unsubscribe: Unsubscribe | undefined;

  /**
   * Async-sync guards: a sync that awaits the texture loader must abandon its
   * work if a newer sync started (or the renderer died) while it waited.
   * Usage: `const token = this.beginSync(); await ...; if (this.isStale(token)) return;`
   */
  private syncToken = 0;
  protected destroyed = false;

  constructor(
    protected readonly scene: FarmScene,
    protected readonly bridge: GameBridge,
  ) {}

  protected beginSync(): number {
    return ++this.syncToken;
  }

  protected isStale(token: number): boolean {
    return this.destroyed || token !== this.syncToken;
  }

  /** This renderer's slice, e.g. (state) => state.context.state.crops */
  abstract selector(state: MachineState): Slice;

  /** Change detection for the slice. Default: reference equality. */
  equals: EqualityFn<Slice> = Object.is;

  /**
   * Reconcile display objects against the slice: create for new ids, update
   * changed ones, destroy removed ones. May be async (queue textures, await
   * the loader, then place sprites) — the scene doesn't await it.
   */
  abstract sync(slice: Slice): void | Promise<void>;

  /** Per-frame hook. Override only when something genuinely animates per frame. */
  update(_time: number, _delta: number): void {
    // no-op by default
  }

  mount() {
    this.unsubscribe = this.bridge.subscribe(
      (state) => this.selector(state),
      (slice) => void this.sync(slice),
      this.equals,
    );
    void this.sync(this.bridge.select((state) => this.selector(state)));
  }

  destroy() {
    this.destroyed = true;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.onDestroy();
  }

  /** Destroy owned display objects, anchors, and clock registrations. */
  protected abstract onDestroy(): void;
}
