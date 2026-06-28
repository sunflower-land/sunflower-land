import type { BoostHistoryWindow, GameState, PlacedItem } from "../types/game";
import {
  EXPIRY_COOLDOWNS,
  isCollectibleBuilt,
  type TemporaryCollectibleName,
} from "./collectibleBuilt";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";

/**
 * Speed-rate boost model ("Clash of Clans builder/research potion").
 *
 * Instead of locking a one-time duration discount in when an action starts, a
 * temporary boost is a RATE multiplier that applies over its active wall-clock
 * window. A task needs `baseDurationMs` of "work"; work accrues at the effective
 * speed at each instant (1× normally, the product of any covering windows during
 * overlaps, e.g. two 1.35× boosts → 1.8225×). The task is ready when accrued
 * work reaches `baseDurationMs`.
 *
 * Because a window is fully determined by the boost's `createdAt`/`removedAt`,
 * the ready time is DERIVED live — which is what makes the boost credit only the
 * overlap and apply retroactively to tasks already in progress.
 */
export type BoostWindow = { from: number; to: number; speed: number };

/**
 * Speed multipliers for the windowed crop-plot boosts — the single place to tune
 * them. Stacking is multiplicative (effective speed = product of active boosts).
 * `sunshower` is the base sunshower rate; `sunshowerGuardian` replaces it while a
 * matching season Guardian is built.
 */
export const CROP_PLOT_BOOST_SPEED = {
  "Sparrow Shrine": 1.35,
  "Harvest Hourglass": 1.35,
  "Super Totem": 2,
  "Time Warp Totem": 2,
  "Power hour": 2,
  sunshower: 2,
  sunshowerGuardian: 4,
} as const;

/** Window for the Power Hour buff (1h from activation), if active. */
const getPowerHourWindows = (game: GameState): BoostWindow[] => {
  const buff = game.buffs?.["Power hour"];
  if (buff?.startedAt === undefined) return [];
  return [
    {
      from: buff.startedAt,
      to: buff.startedAt + buff.durationMS,
      speed: CROP_PLOT_BOOST_SPEED["Power hour"],
    },
  ];
};

const SEASON_GUARDIAN = {
  spring: "Spring Guardian",
  summer: "Summer Guardian",
  autumn: "Autumn Guardian",
  winter: "Winter Guardian",
} as const;

/**
 * Window for the sunshower calendar event, if one has started. Sunshower lasts
 * until the END of the (UTC) day it began on — not a rolling 24h — so the window
 * runs from `startedAt` to the next UTC midnight. A built season Guardian doubles
 * the boost (2× → 4×).
 */
const getSunshowerWindows = (game: GameState): BoostWindow[] => {
  const startedAt = game.calendar?.sunshower?.startedAt;
  if (startedAt === undefined) return [];

  const day = new Date(startedAt);
  const to = Date.UTC(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate() + 1,
  );

  const hasGuardian = isCollectibleBuilt({
    game,
    name: SEASON_GUARDIAN[game.season.season],
  });

  return [
    {
      from: startedAt,
      to,
      speed: hasGuardian
        ? CROP_PLOT_BOOST_SPEED.sunshowerGuardian
        : CROP_PLOT_BOOST_SPEED.sunshower,
    },
  ];
};

/**
 * Windows for the totems. Super Totem & Time Warp Totem are the SAME 2× boost and
 * explicitly do NOT stack with each other, so both names' windows are merged into
 * one same-speed set (overlaps coalesce instead of multiplying).
 */
const getTotemWindows = (game: GameState): BoostWindow[] =>
  mergeWindows([
    ...getBoostWindows({
      game,
      name: "Super Totem",
      speed: CROP_PLOT_BOOST_SPEED["Super Totem"],
    }),
    ...getBoostWindows({
      game,
      name: "Time Warp Totem",
      speed: CROP_PLOT_BOOST_SPEED["Time Warp Totem"],
    }),
  ]);

/**
 * The windowed speed boosts that apply to (plot) crop growth. Each is its own
 * window so overlapping boosts stack multiplicatively (Sparrow 1.35 × Harvest
 * 1.35 = 1.8225×); placements of the same boost are merged within
 * `getBoostWindows`.
 */
export const getCropPlotBoostWindows = (game: GameState): BoostWindow[] => [
  ...getBoostWindows({
    game,
    name: "Sparrow Shrine",
    speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
  }),
  ...getBoostWindows({
    game,
    name: "Harvest Hourglass",
    speed: CROP_PLOT_BOOST_SPEED["Harvest Hourglass"],
  }),
  ...getTotemWindows(game),
  ...getPowerHourWindows(game),
  ...getSunshowerWindows(game),
];

/**
 * Build the active windows for a single temporary collectible. Each LIVE placement
 * yields `[createdAt, min(createdAt + cooldown, removedAt)]`; FINALISED intervals
 * recorded in `game.boostHistory` (when the booster was burned or renewed) are
 * unioned in so the boost's contribution survives the placed record being deleted
 * or its `createdAt` reset. All windows take the given speed; overlapping ones for
 * the same boost are merged (a player cannot stack a boost with itself).
 */
export function getBoostWindows({
  game,
  name,
  speed,
}: {
  game: GameState;
  name: TemporaryCollectibleName;
  speed: number;
}): BoostWindow[] {
  const cooldown = EXPIRY_COOLDOWNS[name];

  const live = getCollectiblesAcrossLocations(game, name)
    .filter(
      (
        placed,
      ): placed is Omit<PlacedItem, "createdAt"> & { createdAt: number } =>
        placed.createdAt !== undefined,
    )
    .map((placed) => {
      const from = placed.createdAt;
      const expiry = from + cooldown;
      const to =
        placed.removedAt !== undefined
          ? Math.min(expiry, placed.removedAt)
          : expiry;
      return { from, to, speed };
    });

  const history = (game.boostHistory?.[name] ?? []).map((window) => ({
    from: window.from,
    to: window.to,
    speed,
  }));

  return mergeWindows([...live, ...history].filter((w) => w.to > w.from));
}

/** Finalised boost windows older than this (relative to now) can't affect any
 *  in-progress timer, so they're pruned from `boostHistory`. */
const MAX_BOOST_HISTORY_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Record a finalised active window for a temporary boost collectible into
 * `game.boostHistory` so its contribution survives the placed record being burned
 * (deleted) or renewed (createdAt reset). Mutates `game` in place (immer-draft
 * friendly). Recorded for ALL temporary collectibles — most have a time effect
 * that will be windowed eventually, so this is future-proof; entries for boosts no
 * window engine reads are inert and pruned. No-op for empty/zero-length windows.
 * Prunes stale intervals as it appends.
 */
export function appendBoostHistory(
  game: GameState,
  name: TemporaryCollectibleName,
  window: BoostHistoryWindow,
  now: number,
): void {
  if (window.to <= window.from) return;

  if (!game.boostHistory) game.boostHistory = {};
  const kept = (game.boostHistory[name] ?? []).filter(
    (w) => w.to >= now - MAX_BOOST_HISTORY_AGE_MS,
  );
  kept.push({ from: window.from, to: window.to });
  game.boostHistory[name] = kept;
}

/** Merge overlapping/touching same-speed windows into disjoint intervals. */
function mergeWindows(windows: BoostWindow[]): BoostWindow[] {
  if (windows.length <= 1) return windows;

  const sorted = [...windows].sort((a, b) => a.from - b.from);
  const merged: BoostWindow[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    // Only coalesce windows of the same speed; differing speeds must stay
    // separate so overlaps multiply (handled later in buildSegments).
    if (current.speed === last.speed && current.from <= last.to) {
      last.to = Math.max(last.to, current.to);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Split `[startedAt, lastBoundary]` into contiguous segments, each tagged with
 * the effective speed over that segment (product of covering windows, or 1 in
 * gaps). Work past the final boundary always accrues at 1×.
 */
function buildSegments({
  startedAt,
  windows,
}: {
  startedAt: number;
  windows: BoostWindow[];
}): BoostWindow[] {
  const clipped = windows
    .map((window) => ({
      from: Math.max(window.from, startedAt),
      to: window.to,
      speed: window.speed,
    }))
    .filter((window) => window.to > window.from);

  if (clipped.length === 0) return [];

  const boundaries = [
    ...new Set<number>([
      startedAt,
      ...clipped.flatMap((window) => [window.from, window.to]),
    ]),
  ].sort((a, b) => a - b);

  const segments: BoostWindow[] = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const from = boundaries[i];
    const to = boundaries[i + 1];
    const mid = (from + to) / 2;
    const speed = clipped.reduce(
      (acc, window) =>
        window.from <= mid && mid < window.to ? acc * window.speed : acc,
      1,
    );
    segments.push({ from, to, speed });
  }

  return segments;
}

/**
 * The instant at which accrued work reaches `baseDurationMs` given the boost
 * windows. With no windows this is simply `startedAt + baseDurationMs`.
 */
export function computeReadyAt({
  startedAt,
  baseDurationMs,
  windows,
}: {
  startedAt: number;
  baseDurationMs: number;
  windows: BoostWindow[];
}): number {
  if (baseDurationMs <= 0) return startedAt;

  const segments = buildSegments({ startedAt, windows });

  let accumulated = 0;
  for (const segment of segments) {
    const segmentWork = (segment.to - segment.from) * segment.speed;
    if (accumulated + segmentWork >= baseDurationMs) {
      return segment.from + (baseDurationMs - accumulated) / segment.speed;
    }
    accumulated += segmentWork;
  }

  // Tail beyond the final boundary runs at 1× speed.
  const tailStart = segments.length
    ? segments[segments.length - 1].to
    : startedAt;
  return tailStart + (baseDurationMs - accumulated);
}

/**
 * The effective speed at instant `at`: the product of every window covering it
 * (1 when none do). UI uses this to size its tick interval (`1000 / speed`) so
 * the displayed countdown ticks down by ~1s per visual tick while boosted,
 * rather than jumping by `speed` every real second.
 */
export function getEffectiveSpeedAt({
  at,
  windows,
}: {
  at: number;
  windows: BoostWindow[];
}): number {
  return windows.reduce(
    (speed, window) =>
      window.from <= at && at < window.to ? speed * window.speed : speed,
    1,
  );
}

/**
 * How much work (in base-duration ms) has accrued by `at`. Dual of
 * `computeReadyAt`: `workAccruedAt({ at: computeReadyAt(...) }) === baseDurationMs`.
 * Used by the UI so the countdown ticks at the boosted rate while a window is
 * active (and the progress bar fills correspondingly faster).
 */
export function workAccruedAt({
  startedAt,
  at,
  windows,
}: {
  startedAt: number;
  at: number;
  windows: BoostWindow[];
}): number {
  if (at <= startedAt) return 0;

  const segments = buildSegments({ startedAt, windows });

  let work = 0;
  for (const segment of segments) {
    if (at <= segment.from) return work;
    const end = Math.min(at, segment.to);
    work += (end - segment.from) * segment.speed;
    if (at <= segment.to) return work;
  }

  const tailStart = segments.length
    ? segments[segments.length - 1].to
    : startedAt;
  if (at > tailStart) work += at - tailStart;

  return work;
}
