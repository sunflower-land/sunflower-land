import { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useNow } from "lib/utils/hooks/useNow";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";
import {
  getDisplaySeconds,
  getSurfacedSpeed,
  getTickIntervalMs,
} from "./timerDisplay";

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
  /** Live clock, ticking at the cadence the current reading needs. */
  now: number;
  readyAt: number;
  /**
   * The rate to SURFACE — what every ⚡ decoration is gated on. 1 when unboosted,
   * on the legacy model, or in the actual-time view. See `getSurfacedSpeed`.
   */
  speed: number;
  /**
   * Remaining WORK in seconds. Art thresholds and fill bars must use this, not
   * `displaySeconds` — how grown a plant is doesn't change with a display setting.
   */
  workLeftSeconds: number;
  /** Remaining wall-clock seconds until ready. */
  countdownSeconds: number;
  /** The reading to show, per the player's `showActualTime` setting. */
  displaySeconds: number;
};

/**
 * The countdown maths shared by every node with a speed-boostable timer (crops,
 * trees, rocks, fruit, flowers, greenhouse pots, oil).
 *
 * A windowed task has two readings — see `timerDisplay.ts`. This returns both,
 * plus the one the player has chosen, and ticks at whichever cadence that reading
 * needs. `readyAt` is derived live from the windows, so it already accounts for a
 * boost that expires part-way through; it only moves when a booster is placed or
 * burned.
 */
export function useNodeTimer({
  startedAt,
  baseDurationMs,
  windows,
  legacyReadyAt,
  live = true,
}: UseNodeTimerArgs): NodeTimer {
  const { showActualTime } = useContext(Context);
  const windowed = baseDurationMs !== undefined;

  const readyAt = windowed
    ? computeReadyAt({ startedAt, baseDurationMs, windows })
    : legacyReadyAt;

  // Coarse 1s clock purely to pick the current speed. Kept separate from the
  // display clock below, whose interval depends on `speed` — reading it off the
  // same clock would make the cadence depend on itself.
  const tickNow = useNow({ live: live && windowed, autoEndAt: readyAt });
  // The rate in force. Drives the tick cadence; only `getSurfacedSpeed` below
  // decides whether the player is shown it.
  const speed = windowed ? getEffectiveSpeedAt({ at: tickNow, windows }) : 1;

  const now = useNow({
    live,
    autoEndAt: readyAt,
    intervalMs: getTickIntervalMs({ showActualTime, speed }),
  });

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
    speed: getSurfacedSpeed({ showActualTime, speed }),
    workLeftSeconds,
    countdownSeconds,
    displaySeconds: getDisplaySeconds({
      showActualTime,
      workLeftSeconds,
      countdownSeconds,
    }),
  };
}
