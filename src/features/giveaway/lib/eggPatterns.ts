/**
 * Deterministic egg schedule for the Egg Catch mini-game.
 *
 * Every player, wherever they are, sees the SAME eggs fall over the 30 seconds:
 * the whole schedule is a pure function of the giveaway id, so it's identical on
 * every client. Only *catching* is per-player.
 *
 * Eggs don't fall at random — they come in **batches** (patterns): a column that
 * stacks above one spot, a sweep that walks you across the field, a gold egg
 * dangled on the far side, or a tempting cluster with a bomb hidden inside. The
 * batches get bigger and closer together as the clock runs down.
 */
import { RACE_DURATION_MS, hashString, mulberry32 } from "./sim";

export type EggType = "normal" | "gold" | "red";

/** Number of columns eggs can fall in. */
export const EGG_LANES = 7;

/** Points for catching each egg type (red is a bomb — it costs you). */
export const EGG_POINTS: Record<EggType, number> = {
  normal: 1,
  gold: 10,
  red: -5,
};

/** How long an egg takes to fall from the top to the catch line. */
export const EGG_FALL_MS = 1900;

export interface FallingEgg {
  id: number;
  /** Column, 0..EGG_LANES-1. */
  lane: number;
  type: EggType;
  /** ms from race start when the egg appears at the top. */
  spawnAt: number;
  /** ms it takes to fall to the catch line. */
  fallMs: number;
}

/** One egg within a batch, before it's placed on the absolute timeline. */
type BatchEgg = { lane: number; dt: number; type: EggType };

const lerp = (min: number, max: number, r: number) => min + (max - min) * r;
const randInt = (rand: () => number, n: number) => Math.floor(rand() * n);
const clampLane = (lane: number) => Math.max(0, Math.min(EGG_LANES - 1, lane));

/** Stagger between eggs stacked in the same column. */
const STACK_DT = 230;
/** Stagger between eggs as a sweep walks across lanes. */
const SWEEP_DT = 300;

/** A vertical stack in one lane — sit under it and rake them in. */
function column(rand: () => number, progress: number): BatchEgg[] {
  const lane = randInt(rand, EGG_LANES);
  const count = 3 + Math.floor(progress * 2); // 3..5
  const redAt = rand() < 0.15 + progress * 0.25 ? randInt(rand, count) : -1;
  const goldBottom = rand() < 0.15;

  return Array.from({ length: count }, (_, i) => ({
    lane,
    dt: i * STACK_DT,
    type:
      i === redAt ? "red" : goldBottom && i === count - 1 ? "gold" : "normal",
  }));
}

/** Consecutive lanes, staggered so you run along catching each in turn. */
function sweep(rand: () => number, progress: number): BatchEgg[] {
  const width = Math.min(EGG_LANES, 3 + Math.floor(progress * 3)); // 3..6
  const dir = rand() < 0.5 ? 1 : -1;
  const room = EGG_LANES - width;
  const start =
    dir > 0 ? randInt(rand, room + 1) : width - 1 + randInt(rand, room + 1);
  const redAt = rand() < 0.1 + progress * 0.3 ? randInt(rand, width) : -1;

  return Array.from({ length: width }, (_, i) => ({
    lane: clampLane(start + dir * i),
    dt: i * SWEEP_DT,
    type: i === redAt ? "red" : "normal",
  }));
}

/** A gold egg dangled on the far side while normals tempt you near the middle. */
function goldRush(rand: () => number): BatchEgg[] {
  const onLeft = rand() < 0.5;
  const goldLane = onLeft ? randInt(rand, 2) : EGG_LANES - 1 - randInt(rand, 2);
  const eggs: BatchEgg[] = [{ lane: goldLane, dt: 0, type: "gold" }];

  // A couple of normals on the opposite/centre side — you can't have both.
  const decoys = 1 + randInt(rand, 2);
  for (let i = 0; i < decoys; i += 1) {
    const lane = onLeft ? EGG_LANES - 1 - randInt(rand, 3) : randInt(rand, 3);
    eggs.push({ lane, dt: 200 + i * 250, type: "normal" });
  }
  return eggs;
}

/** A tempting tight cluster — lots of points, but a bomb is hidden inside. */
function bombCluster(rand: () => number, progress: number): BatchEgg[] {
  const centre = clampLane(1 + randInt(rand, EGG_LANES - 2));
  const count = 3 + Math.floor(progress * 2); // 3..5
  const redAt = randInt(rand, count); // always exactly one bomb

  return Array.from({ length: count }, (_, i) => ({
    // Fan around the centre lane (…, -1, 0, +1, …).
    lane: clampLane(centre + ((i % 3) - 1)),
    dt: i * STACK_DT,
    type: i === redAt ? "red" : "normal",
  }));
}

/** Pick a batch, weighted so the risky/greedy patterns show up more over time. */
function pickBatch(rand: () => number, progress: number): BatchEgg[] {
  const roll = rand();
  // Early: mostly columns + sweeps. Late: more gold rushes + bomb clusters.
  if (roll < 0.35) return column(rand, progress);
  if (roll < 0.6) return sweep(rand, progress);
  if (roll < 0.6 + 0.2 * progress) return goldRush(rand);
  if (roll < 0.75 + 0.25 * progress) return bombCluster(rand, progress);
  return sweep(rand, progress);
}

/**
 * The full 30s schedule of eggs for a giveaway. Deterministic: same id in →
 * same eggs out, on every client. Sorted by spawn time.
 */
export function eggSchedule(giveawayId: string): FallingEgg[] {
  const rand = mulberry32(hashString(`eggs:${giveawayId}`));
  const eggs: FallingEgg[] = [];

  let id = 0;
  let t = 700;
  // Stop spawning once an egg wouldn't reach the catch line before 30s.
  while (t < RACE_DURATION_MS - EGG_FALL_MS) {
    const progress = t / RACE_DURATION_MS;

    for (const e of pickBatch(rand, progress)) {
      eggs.push({
        id: id++,
        lane: e.lane,
        type: e.type,
        spawnAt: t + e.dt,
        fallMs: EGG_FALL_MS,
      });
    }

    // Gap between batches shrinks as the round heats up (± a little jitter).
    const gap = lerp(1400, 500, progress) * (0.8 + rand() * 0.4);
    t += gap;
  }

  // Drop any egg that would land after the clock runs out (a batch's later eggs
  // can spill past 30s) — it could never be caught in time.
  return eggs
    .filter((egg) => egg.spawnAt + egg.fallMs <= RACE_DURATION_MS)
    .sort((a, b) => a.spawnAt - b.spawnAt);
}
