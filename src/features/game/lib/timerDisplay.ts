import {
  computeReadyAt,
  getEffectiveSpeedAt,
  type BoostWindow,
} from "./boostWindows";

/**
 * The two readings of a windowed timer.
 *
 * Under the speed-rate model a boost is a RATE, so a task's remaining "time" is
 * ambiguous: there is the remaining WORK (in un-boosted base duration) and the
 * remaining WALL-CLOCK time until it is actually ready. A 3h crop under a 2×
 * window has 3h of work left but is ready in 1h 30m.
 *
 * The `settings.showActualTime` preference picks which one every timer displays;
 * the work reading stays the default (see GameProvider).
 */
export function getDisplaySeconds({
  showActualTime,
  workLeftSeconds,
  countdownSeconds,
}: {
  showActualTime: boolean;
  workLeftSeconds: number;
  countdownSeconds: number;
}): number {
  return showActualTime ? countdownSeconds : workLeftSeconds;
}

/**
 * How often the displayed number needs to change.
 *
 * The work reading drains FASTER than a clock while a boost is active (2× speed
 * burns 2s of work per real second), so it re-renders at `1000 / speed` to drop
 * ~1 per visual tick instead of jumping by `speed` every second. The wall-clock
 * reading always ticks once a second. Floored at 250ms so an extreme stack can't
 * spin the render loop.
 */
export function getTickIntervalMs({
  showActualTime,
  speed,
}: {
  showActualTime: boolean;
  speed: number;
}): number {
  if (showActualTime) return 1000;

  return Math.max(Math.round(1000 / Math.max(speed, 1)), 250);
}

/**
 * The rate to SURFACE, which is not always the rate in force.
 *
 * A ⚡ decoration — the rate in a timer popover, the pulsing bolt on a plot,
 * patch, flower bed or greenhouse pot — exists to explain a number that does not
 * account for the boost. In the actual-time view every number already does, so
 * the decoration would be claiming the same boost a second time. Collapsing the
 * rate to 1 here turns all of them off at once, since each one is gated on
 * `speed > 1`.
 *
 * This is display only. The true rate still drives the tick cadence and the
 * ready-time maths — see `useNodeTimer`.
 */
export function getSurfacedSpeed({
  showActualTime,
  speed,
}: {
  showActualTime: boolean;
  speed: number;
}): number {
  return showActualTime ? 1 : speed;
}

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
 * What a pre-action panel (seed shop, guides) should show for a task the player
 * has not started, given the boosters running right now.
 *
 * The two readings differ in what they can honestly say, and each states the
 * boost exactly once:
 *
 * - Speed view: the duration is un-projected, so the useful extra information is
 *   the RATE the activity is running at — "4h, currently 2×".
 * - Actual-time view: the duration becomes the real "start now → ready in X",
 *   which already accounts for a booster running out part-way through. A 4h crop
 *   under a 1.35× hourglass with only 30 minutes left reads ~3h 50m, not 2h 58m,
 *   because only the first half-hour is boosted. The rate is folded into that
 *   number, so it is NOT reported separately — the panels key their ⚡ label off
 *   `speed`, and repeating it there would claim the same boost twice.
 */
export function getPreActionTime({
  showActualTime,
  seconds,
  windows,
  at,
}: {
  showActualTime: boolean;
  seconds: number;
  windows: BoostWindow[];
  at: number;
}): {
  /** The duration to render. */
  displaySeconds: number;
  /** The rate to surface — see `getSurfacedSpeed`. */
  speed: number;
} {
  return {
    displaySeconds: showActualTime
      ? projectSeconds({ seconds, windows, at })
      : seconds,
    speed: getSurfacedSpeed({
      showActualTime,
      speed: getEffectiveSpeedAt({ at, windows }),
    }),
  };
}

/**
 * The full pre-action display decision, shared by every guide/shop panel.
 *
 * A panel has two kinds of boost to account for, and they differ in what can be
 * said about them:
 *
 * - NAMED boosts (`boostsUsed`) are already folded into `seconds`; they can be
 *   itemised, so the panel makes its time clickable.
 * - A live speed WINDOW is not folded in and carries no name (a `BoostWindow` is
 *   just an interval and a rate), so it shows as a rate or a shorter projected
 *   time, but has nothing to itemise.
 */
export function getPreActionDisplay({
  showActualTime,
  seconds,
  baseSeconds,
  namedBoostCount,
  windows,
  at,
}: {
  showActualTime: boolean;
  seconds: number;
  baseSeconds: number;
  namedBoostCount: number;
  windows: BoostWindow[];
  at: number;
}): {
  displaySeconds: number;
  speed: number;
  /** Whether the panel has boosts it can list (and so should be clickable). */
  hasNamedBoosts: boolean;
  /** Whether to use the boosted layout (rate and/or struck-through base time). */
  isBoosted: boolean;
} {
  const { displaySeconds, speed } = getPreActionTime({
    showActualTime,
    seconds,
    windows,
    at,
  });
  const hasNamedBoosts = namedBoostCount > 0;

  return {
    displaySeconds,
    speed,
    hasNamedBoosts,
    isBoosted: isPreActionBoosted({
      displaySeconds,
      baseSeconds,
      speed,
      hasNamedBoosts,
    }),
  };
}

/**
 * Whether a pre-action panel should use its boosted layout (rate and/or a
 * struck-through base time). Exported for the shared detail layouts, which are
 * handed an already-projected duration rather than the windows behind it.
 */
export function isPreActionBoosted({
  displaySeconds,
  baseSeconds,
  speed = 1,
  hasNamedBoosts,
}: {
  displaySeconds: number;
  baseSeconds?: number;
  speed?: number;
  hasNamedBoosts: boolean;
}): boolean {
  if (speed > 1) return true;
  if (baseSeconds === undefined) return false;

  return (
    (hasNamedBoosts && displaySeconds !== baseSeconds) ||
    displaySeconds < baseSeconds
  );
}
