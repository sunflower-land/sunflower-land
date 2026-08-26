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
 * Mirrors useNodeTimer's two timing models: speed-rate when baseDurationMs is
 * present (readyAt derived live from boost windows), legacy back-dated
 * readyAt otherwise. The read path keys off the marker, not the flag, exactly
 * like the hook.
 */
export type NodeTimerSpec = {
  /** When the task began — plantedAt / choppedAt / minedAt / drilledAt. */
  startedAt: number;
  /** Present only on speed-rate nodes; absence selects legacy timing. */
  baseDurationMs?: number;
  /** The activity's live speed windows (speed-rate model only). */
  windows: BoostWindow[];
  /** Ready time for a legacy node. */
  legacyReadyAt: number;
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
  const { startedAt, baseDurationMs, windows, legacyReadyAt } = spec;
  const windowed = baseDurationMs !== undefined;

  const readyAt = windowed
    ? computeReadyAt({ startedAt, baseDurationMs, windows })
    : legacyReadyAt;

  const total = windowed ? baseDurationMs : legacyReadyAt - startedAt;
  const done = windowed
    ? workAccruedAt({ startedAt, at: now, windows })
    : now - startedAt;
  const progress = total <= 0 ? 1 : Math.min(Math.max(done / total, 0), 1);

  return { now, readyAt, progress, ready: now >= readyAt };
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
  private accumulatorMs = 0;

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
