import { computeReadyAt, type BoostWindow } from "./boostWindows";

/**
 * How often a pre-action panel re-reads the clock.
 *
 * These projections go stale as a booster burns down — a panel left open would
 * otherwise keep showing the saving that applied when it was opened. They are
 * rendered at minute granularity, and a guide can list dozens of rows, so a
 * once-a-minute tick keeps them honest without a per-second re-render storm.
 */
export const PRE_ACTION_TICK_MS = 60 * 1000;

/**
 * "Start this now — how long until it's ready?", given the live boost windows.
 *
 * For the pre-action panels (seed shop, guides), which show a duration for a task
 * that has not begun. `computeReadyAt` models a window expiring part-way through,
 * so a boost that runs out mid-task credits only the part it covers.
 *
 * With no windows this is the identity, which is what makes it safe to apply
 * unconditionally: flag off, or an activity that was never migrated, both yield
 * an empty window set and the un-projected number comes back unchanged.
 */
export function projectSeconds({
  seconds,
  windows,
  at,
}: {
  seconds: number;
  windows: BoostWindow[];
  at: number;
}): number {
  if (windows.length === 0) return seconds;

  return (
    (computeReadyAt({
      startedAt: at,
      baseDurationMs: seconds * 1000,
      windows,
    }) -
      at) /
    1000
  );
}

/**
 * The full pre-action display decision, shared by every guide/shop panel.
 *
 * The projected duration is the real "start now → ready in X", which already
 * accounts for a booster running out part-way through: a 4h crop under a 1.35×
 * hourglass with only 30 minutes left reads ~3h 50m, not 2h 58m, because only
 * the first half-hour is boosted.
 *
 * A panel has two kinds of boost to account for:
 *
 * - NAMED boosts (`boostsUsed`) are already folded into `seconds`; they can be
 *   itemised, so the panel makes its time clickable.
 * - A live speed WINDOW carries no name (a `BoostWindow` is just an interval and
 *   a rate), so it shows only as a shorter projected time, with nothing to
 *   itemise.
 */
export function getPreActionDisplay({
  seconds,
  baseSeconds,
  namedBoostCount,
  windows,
  at,
}: {
  seconds: number;
  baseSeconds: number;
  namedBoostCount: number;
  windows: BoostWindow[];
  at: number;
}): {
  displaySeconds: number;
  /** Whether the panel has boosts it can list (and so should be clickable). */
  hasNamedBoosts: boolean;
  /** Whether to use the boosted layout (struck-through base time). */
  isBoosted: boolean;
} {
  const displaySeconds = projectSeconds({ seconds, windows, at });
  const hasNamedBoosts = namedBoostCount > 0;

  return {
    displaySeconds,
    hasNamedBoosts,
    isBoosted: isPreActionBoosted({
      displaySeconds,
      baseSeconds,
      hasNamedBoosts,
    }),
  };
}

/**
 * Whether a pre-action panel should use its boosted layout (a struck-through
 * base time). Exported for the shared detail layouts, which are handed an
 * already-projected duration rather than the windows behind it.
 */
export function isPreActionBoosted({
  displaySeconds,
  baseSeconds,
  hasNamedBoosts,
}: {
  displaySeconds: number;
  baseSeconds?: number;
  hasNamedBoosts: boolean;
}): boolean {
  if (baseSeconds === undefined) return false;

  return (
    displaySeconds < baseSeconds ||
    (hasNamedBoosts && displaySeconds > baseSeconds)
  );
}
