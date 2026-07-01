import { getActiveGuardian } from "./getActiveGuardian";
import type { BoostHistoryWindow, GameState, PlacedItem } from "../types/game";
import {
  EXPIRY_COOLDOWNS,
  type TemporaryCollectibleName,
} from "./collectibleBuilt";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";
import type { RockName } from "../types/resources";

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

/**
 * Speed multipliers for the windowed tree (wood) recovery boosts — the single
 * place to tune them. Stacking is multiplicative; Super & Time Warp Totem share
 * the same 2× and merge so they don't stack with each other.
 */
export const TREE_BOOST_SPEED = {
  "Super Totem": 2,
  "Time Warp Totem": 2,
  "Timber Hourglass": 1.35,
  "Badger Shrine": 1.35,
} as const;

/**
 * Speed multipliers for the windowed mine/rock recovery boosts — the single
 * place to tune them. Stacking is multiplicative; Super & Time Warp Totem share
 * the same 2× and merge so they don't stack with each other. Coverage differs by
 * resource (see `getMineBoostWindows`): Badger Shrine speeds up stone, Mole
 * Shrine speeds up iron/gold/crimstone, and Ore Hourglass + the totems speed up
 * stone/iron/gold.
 */
export const MINE_BOOST_SPEED = {
  "Super Totem": 2,
  "Time Warp Totem": 2,
  "Ore Hourglass": 2,
  "Badger Shrine": 1.35,
  "Mole Shrine": 1.35,
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

  const hasGuardian = !!getActiveGuardian({ game }).activeGuardian;

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
 * Merge the Super Totem & Time Warp Totem windows for ONE activity into a single
 * same-speed set. The two totems are the SAME boost for a given activity and
 * explicitly do NOT stack with each other, so their windows coalesce (overlaps
 * merge instead of multiplying). Both must share `speed` within an activity
 * (crops, trees & mines: 2×); an activity where the two totems had DIFFERENT
 * speeds could not use this helper — unequal speeds would multiply rather than
 * pick the higher.
 */
export const getMergedTotemWindows = (
  game: GameState,
  speed: number,
): BoostWindow[] =>
  mergeWindows([
    ...getBoostWindows({ game, name: "Super Totem", speed }),
    ...getBoostWindows({ game, name: "Time Warp Totem", speed }),
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
  ...getMergedTotemWindows(game, CROP_PLOT_BOOST_SPEED["Super Totem"]),
  ...getPowerHourWindows(game),
  ...getSunshowerWindows(game),
];

/**
 * The windowed speed boosts that apply to tree (wood) recovery. Each is its own
 * window so overlapping boosts stack multiplicatively; the two totems merge so
 * they don't stack with each other (both 2×). Mirrors `getCropPlotBoostWindows`
 * for the trees activity.
 */
export const getTreeBoostWindows = (game: GameState): BoostWindow[] => [
  ...getMergedTotemWindows(game, TREE_BOOST_SPEED["Super Totem"]),
  ...getBoostWindows({
    game,
    name: "Timber Hourglass",
    speed: TREE_BOOST_SPEED["Timber Hourglass"],
  }),
  ...getBoostWindows({
    game,
    name: "Badger Shrine",
    speed: TREE_BOOST_SPEED["Badger Shrine"],
  }),
];

/**
 * The windowed speed boosts that apply to a rock's recovery, by resource family.
 * Coverage differs per resource: stone gets Badger Shrine (not Mole), iron & gold
 * get Mole Shrine (not Badger), crimstone gets Mole Shrine only, and sunstone (+
 * the unmigrated Ascension Crystal) have no temporary recovery boost — the empty
 * set makes `computeReadyAt` reduce to `minedAt + baseDurationMs`. The two totems
 * merge so they don't stack (both 2×); Ore Hourglass applies to stone/iron/gold.
 * Tier-2/3 rock names (e.g. Fused Stone, Prime Gold) map to their base family.
 * Mirrors `getTreeBoostWindows` for the mines activity.
 */
export const getMineBoostWindows = (
  game: GameState,
  rockName: RockName,
): BoostWindow[] => {
  switch (rockName) {
    case "Stone Rock":
    case "Fused Stone Rock":
    case "Reinforced Stone Rock":
      return [
        ...getMergedTotemWindows(game, MINE_BOOST_SPEED["Super Totem"]),
        ...getBoostWindows({
          game,
          name: "Ore Hourglass",
          speed: MINE_BOOST_SPEED["Ore Hourglass"],
        }),
        ...getBoostWindows({
          game,
          name: "Badger Shrine",
          speed: MINE_BOOST_SPEED["Badger Shrine"],
        }),
      ];
    case "Iron Rock":
    case "Refined Iron Rock":
    case "Tempered Iron Rock":
    case "Gold Rock":
    case "Pure Gold Rock":
    case "Prime Gold Rock":
      return [
        ...getMergedTotemWindows(game, MINE_BOOST_SPEED["Super Totem"]),
        ...getBoostWindows({
          game,
          name: "Ore Hourglass",
          speed: MINE_BOOST_SPEED["Ore Hourglass"],
        }),
        ...getBoostWindows({
          game,
          name: "Mole Shrine",
          speed: MINE_BOOST_SPEED["Mole Shrine"],
        }),
      ];
    case "Crimstone Rock":
      return getBoostWindows({
        game,
        name: "Mole Shrine",
        speed: MINE_BOOST_SPEED["Mole Shrine"],
      });
    case "Sunstone Rock":
    case "Ascension Crystal":
      return [];
  }
};

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
