import type { GameState } from "../types/game";
import {
  EXPIRY_COOLDOWNS,
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
 * overlaps). The task is ready when accrued work reaches `baseDurationMs`.
 *
 * Because a window is fully determined by the boost's `createdAt`/`removedAt`,
 * the ready time is DERIVED live — which is what makes the boost credit only the
 * overlap and apply retroactively to tasks already in progress.
 */
export type BoostWindow = { from: number; to: number; speed: number };

/** Sparrow Shrine: 1.35× plot crop growth speed. */
export const SPARROW_SHRINE_CROP_SPEED = 1.35;

/** The windowed speed boosts that apply to crop growth. */
export const getCropBoostWindows = (game: GameState): BoostWindow[] =>
  getBoostWindows({
    game,
    name: "Sparrow Shrine",
    speed: SPARROW_SHRINE_CROP_SPEED,
  });

/**
 * Build the active windows for a single temporary collectible from live game
 * state. Each placement yields `[createdAt, min(createdAt + cooldown, removedAt)]`
 * at the given speed. Overlapping windows for the same boost are merged (a player
 * cannot stack a boost with itself).
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

  const windows = getCollectiblesAcrossLocations(game, name)
    .filter((placed) => placed.createdAt !== undefined)
    .map((placed) => {
      const from = placed.createdAt as number;
      const expiry = from + cooldown;
      const to =
        placed.removedAt !== undefined
          ? Math.min(expiry, placed.removedAt)
          : expiry;
      return { from, to, speed };
    })
    .filter((window) => window.to > window.from);

  return mergeWindows(windows);
}

/** Merge overlapping/touching same-speed windows into disjoint intervals. */
function mergeWindows(windows: BoostWindow[]): BoostWindow[] {
  if (windows.length <= 1) return windows;

  const sorted = [...windows].sort((a, b) => a.from - b.from);
  const merged: BoostWindow[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (current.from <= last.to) {
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
