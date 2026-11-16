import {
  computeReadyAt,
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";

/**
 * Canvas-side timing for growth-stage art. React overlay UI (popovers,
 * progress bars) keeps using useNodeTimer — this clock exists only so sprite
 * renderers know when a node crosses an art threshold, without per-entity
 * intervals: one pass per second over cheap precomputed boundaries.
 *
 * Mirrors useNodeTimer: readyAt is derived live from the boost windows over
 * the task's baseDurationMs. A node with no stored marker passes its raw base
 * duration; only a task with no work model at all counts down to
 * fallbackReadyAt instead.
 */
export type NodeTimerSpec = {
  /** When the task began — plantedAt / choppedAt / minedAt / drilledAt. */
  startedAt: number;
  /**
   * The task's un-boosted work. Absent only for a task with no work model,
   * which counts down to fallbackReadyAt [useNodeTimer].
   */
  baseDurationMs?: number;
  /** The activity's live speed windows. */
  windows: BoostWindow[];
  /**
   * Ready time for a task with no baseDurationMs — only for tasks with no
   * work model; defaults to startedAt [useNodeTimer].
   */
  fallbackReadyAt?: number;
  /**
   * Work banked before a landscaping lift (the node's boostedTime): already
   * done, so it counts toward progress but not toward the remaining time
   * [FertilePlot.tsx / FruitTree.tsx / FlowerBed.tsx / GreenhousePot.tsx].
   */
  bankedMs?: number;
  /**
   * Work-progress fractions at which onStage must fire, e.g. crop art stages
   * [0.25, 0.5, 1]. Completion (progress 1) always fires even if omitted.
   */
  stageFractions?: number[];
};

export type NodeTimerReading = {
  now: number;
  readyAt: number;
  /** 0..1 fraction of the task's WORK done — what art thresholds key off. */
  progress: number;
  ready: boolean;
};

export const readNodeTimer = (
  spec: NodeTimerSpec,
  now: number,
): NodeTimerReading => {
  const { startedAt, baseDurationMs, windows } = spec;
  const fallbackReadyAt = spec.fallbackReadyAt ?? startedAt;
  const bankedMs = spec.bankedMs ?? 0;
  const windowed = baseDurationMs !== undefined;

  const readyAt = windowed
    ? computeReadyAt({ startedAt, baseDurationMs, windows })
    : fallbackReadyAt;

  // Banked work is folded into both sides, so it moves the art thresholds
  // without moving readyAt.
  const total = windowed
    ? baseDurationMs + bankedMs
    : fallbackReadyAt - startedAt;
  const done = windowed
    ? bankedMs + workAccruedAt({ startedAt, at: now, windows })
    : now - startedAt;
  const progress = total <= 0 ? 1 : Math.min(Math.max(done / total, 0), 1);

  // Strictly past, like the hook's clock [useNow autoEndAt].
  return { now, readyAt, progress, ready: now > readyAt };
};

type Entry = {
  spec: NodeTimerSpec;
  /** Fractions still ahead of the current progress, ascending. */
  pending: number[];
  onStage: (reading: NodeTimerReading) => void;
};

/**
 * Register nodes; tick() once per second (driven from the scene's update loop,
 * not a setInterval, so it pauses with the game). Fires each node's onStage
 * when its progress crosses a registered fraction. A boost placed mid-grow
 * changes computed progress and is picked up on the next tick — same
 * behaviour the DOM farm gets from its re-render.
 */
export class FarmClock {
  private entries = new Map<string, Entry>();
  private accumulatorMs: number;

  /**
   * @param phaseMs how far into the first second this clock starts. The scene
   * offsets it so its stage pass doesn't land on the same frame as the
   * renderers' own once-a-second passes [EntityRenderer.secondElapsed].
   */
  constructor(phaseMs = 0) {
    this.accumulatorMs = phaseMs;
  }

  register(
    key: string,
    spec: NodeTimerSpec,
    onStage: (reading: NodeTimerReading) => void,
  ): () => void {
    const initial = readNodeTimer(spec, Date.now());
    const fractions = [...new Set([...(spec.stageFractions ?? []), 1])].sort(
      (a, b) => a - b,
    );
    this.entries.set(key, {
      spec,
      pending: fractions.filter((fraction) => initial.progress < fraction),
      onStage,
    });
    return () => this.entries.delete(key);
  }

  /** Drive from Scene.update — fires at most once a second. */
  tick(deltaMs: number) {
    this.accumulatorMs += deltaMs;
    if (this.accumulatorMs < 1000) return;
    this.accumulatorMs = 0;

    const now = Date.now();
    this.entries.forEach((entry) => {
      if (entry.pending.length === 0) return;
      if (now < entry.spec.startedAt) return;

      const reading = readNodeTimer(entry.spec, now);
      const crossed = entry.pending.filter(
        (fraction) => reading.progress >= fraction,
      );
      if (crossed.length === 0) return;

      entry.pending = entry.pending.filter(
        (fraction) => reading.progress < fraction,
      );
      entry.onStage(reading);
    });
  }

  dispose() {
    this.entries.clear();
  }
}
