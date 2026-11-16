import type { MachineState } from "features/game/lib/gameMachine";
import type { GameBridge } from "../bridge/GameBridge";
import type { EqualityFn, Unsubscribe } from "../bridge/subscriptions";
import type { FarmScene } from "../scenes/FarmScene";

const TICK_INTERVAL_MS = 1000;

/**
 * Phase offset for the next renderer's once-a-second pass. 137 is coprime with
 * 1000, so successive renderers land 137ms apart and wrap without colliding.
 */
let tickPhase = 0;
const nextTickPhase = () => {
  tickPhase = (tickPhase + 137) % TICK_INTERVAL_MS;
  return tickPhase;
};

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

  /** Accumulator behind secondElapsed, seeded with this renderer's phase. */
  private tickMs = nextTickPhase();

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

  /**
   * True for the renderers that draw a surface's GROUND (ocean, land, dirt,
   * a room's backdrop). The scene reveals as soon as these have drawn and
   * lets everything else fade in as it arrives [FarmScene.revealWhenReady].
   */
  readonly gatesReveal: boolean = false;

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

  /**
   * "Has a second passed?" for renderers that refresh time-derived visuals
   * (progress bars, countdowns, staged art) — the once-a-second pass, driven
   * off the scene's delta so it pauses with the game.
   *
   * Each renderer used to keep its own `tickMs = 0`, fed the same delta from
   * the same Scene.update, so all thirteen of them crossed 1000ms on the SAME
   * frame: a median frame costing ~0ms and then one 5-8ms stall every 60
   * frames. An fps average hides that completely — it is felt as a hitch once
   * a second. Seeding each accumulator with its own offset spreads the passes
   * across the second instead of stacking them into one frame.
   */
  protected secondElapsed(
    delta: number,
    intervalMs = TICK_INTERVAL_MS,
  ): boolean {
    this.tickMs += delta;
    if (this.tickMs < intervalMs) return false;
    this.tickMs = 0;
    return true;
  }

  /**
   * Settles when this renderer's first sync has finished (its initial
   * textures arrived and its objects exist) or failed. The scene gathers
   * these to know when the surface is ready to reveal.
   */
  firstSync: Promise<void> = Promise.resolve();

  /**
   * Opt-in for renderers whose slice is costly to derive and not
   * latency-critical (the coastal cast, the expansion pontoon): instead of
   * running the selector inside every machine transition, note that
   * something changed and derive the slice at most once per interval, from
   * the frame loop.
   *
   * Selectors run synchronously inside gameService.send — on the player's
   * tap. Two of them recomputing expansion requirements, restock lists and
   * hint text cost about a millisecond of every harvest and chop, for
   * visuals that change a few times a session.
   */
  protected selectorIntervalMs = 0;
  private deferredDirty = false;
  private deferredSlice: Slice | undefined;
  private lastDeferredAt = 0;

  mount() {
    let initial: Slice;
    try {
      initial = this.bridge.select((state) => this.selector(state));
    } catch (error) {
      // A selector that throws on this farm's data takes out only its own
      // renderer — not scene creation, which would leave the veil up forever.
      // eslint-disable-next-line no-console
      console.error(
        `[farmEngine] ${this.constructor.name} selector failed`,
        error,
      );
      return;
    }
    if (this.selectorIntervalMs > 0) {
      this.deferredSlice = initial;
      // Every transition yields a new state object, so this only flags.
      this.unsubscribe = this.bridge.subscribe(
        (state) => state,
        () => {
          this.deferredDirty = true;
        },
      );
    } else {
      this.unsubscribe = this.bridge.subscribe(
        (state) => this.selector(state),
        (slice) => void this.runSync(slice),
        this.equals,
      );
    }
    this.firstSync = this.runSync(initial);
  }

  /** Called by the scene every frame; derives a deferred slice when due. */
  flushDeferred(now: number) {
    if (!this.deferredDirty) return;
    if (now - this.lastDeferredAt < this.selectorIntervalMs) return;
    this.deferredDirty = false;
    this.lastDeferredAt = now;
    const next = this.bridge.select((state) => this.selector(state));
    if (this.equals(this.deferredSlice as Slice, next)) return;
    this.deferredSlice = next;
    void this.runSync(next);
  }

  /**
   * One renderer failing must not take the surface down with it: an escaped
   * throw used to leave the boot cover up forever (the scene never counted
   * as loaded) and every other renderer half-built.
   */
  private async runSync(slice: Slice): Promise<void> {
    try {
      await this.sync(slice);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[farmEngine] ${this.constructor.name} sync failed`, error);
    }
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
