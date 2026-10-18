import { useNow } from "lib/utils/hooks/useNow";
import {
  computeReadyAt,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";

type UseNodeTimerArgs = {
  /** When the task began — plantedAt / choppedAt / minedAt / drilledAt. */
  startedAt: number;
  /**
   * The task's un-boosted work, with permanent boosts folded in. Present only on
   * nodes started under the speed-rate model; its absence selects the legacy
   * back-dated timing (the read path keys off the marker, NOT the flag).
   */
  baseDurationMs?: number;
  /** The activity's live speed windows (e.g. getTreeBoostWindows). */
  windows: BoostWindow[];
  /** Ready time for a legacy node, used when `baseDurationMs` is absent. */
  legacyReadyAt: number;
  /**
   * Whether anything is actually running. False for an empty plot/patch, so the
   * component doesn't re-render on a clock it isn't showing. Defaults to true.
   */
  live?: boolean;
};

type NodeTimer = {
  /** Live clock, ticking once a second while the task runs. */
  now: number;
  readyAt: number;
  /**
   * Remaining WORK in seconds. Art thresholds and fill bars must use this, not
   * `countdownSeconds` — how grown a plant is doesn't move at wall-clock rate
   * while a boost window is running.
   */
  workLeftSeconds: number;
  /** Remaining wall-clock seconds until ready — the reading every timer shows. */
  countdownSeconds: number;
};

/**
 * The countdown maths shared by every node with a speed-boostable timer (crops,
 * trees, rocks, fruit, flowers, greenhouse pots, oil).
 *
 * Every timer shows the actual wall-clock time until ready. `readyAt` is derived
 * live from the windows, so it already accounts for a boost that expires
 * part-way through; it only moves when a booster is placed or burned.
 */
export function useNodeTimer({
  startedAt,
  baseDurationMs,
  windows,
  legacyReadyAt,
  live = true,
}: UseNodeTimerArgs): NodeTimer {
  const windowed = baseDurationMs !== undefined;

  const readyAt = windowed
    ? computeReadyAt({ startedAt, baseDurationMs, windows })
    : legacyReadyAt;

  const now = useNow({ live, autoEndAt: readyAt });

  const countdownSeconds = Math.max((readyAt - now) / 1000, 0);
  const workLeftSeconds = windowed
    ? Math.max(
        (baseDurationMs - workAccruedAt({ startedAt, at: now, windows })) /
          1000,
        0,
      )
    : countdownSeconds;

  return {
    now,
    readyAt,
    workLeftSeconds,
    countdownSeconds,
  };
}
