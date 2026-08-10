import { FISH } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import type { FishName } from "features/game/types/fishing";
import { RACE_DURATION_MS, hashString, mulberry32 } from "./sim";

/**
 * Fishing Frenzy — a deterministic stream of fish for the fishing mini-game.
 *
 * Fish drift across a horizontal river; every player sees the SAME fish (the
 * whole schedule is a pure function of the giveaway id), and each fish traverses
 * the WHOLE river edge-to-edge, so wherever a player sits on the bank each fish
 * passes them exactly once. Only who hooks what differs — you cast when a fish
 * drifts in front of you. A fish is worth the real experience it gives when
 * eaten (see the consumables FISH table), so bigger, rarer, faster fish pay out
 * more.
 */

type Speed = "slow" | "medium" | "fast" | "veryfast";

/** ms for a fish to drift fully across the river, by speed tier. */
const CROSS_MS: Record<Speed, number> = {
  slow: 7200,
  medium: 5400,
  fast: 4000,
  veryfast: 2900,
};

/**
 * The catchable species: a spread from common+slow+cheap to rare+fast+valuable.
 * `weight` is the relative spawn chance (rarer = lower). XP and icon are pulled
 * from the real game data so the payout is the fish's true worth.
 */
const POOL_SPEC: { name: FishName; weight: number; speed: Speed }[] = [
  { name: "Anchovy", weight: 6, speed: "slow" },
  { name: "Red Snapper", weight: 5, speed: "slow" },
  { name: "Butterflyfish", weight: 5, speed: "slow" },
  { name: "Sea Bass", weight: 4, speed: "medium" },
  { name: "Blowfish", weight: 4, speed: "medium" },
  { name: "Olive Flounder", weight: 3, speed: "medium" },
  { name: "Tuna", weight: 3, speed: "medium" },
  { name: "Clownfish", weight: 3, speed: "medium" },
  { name: "Surgeonfish", weight: 3, speed: "fast" },
  { name: "Halibut", weight: 2, speed: "fast" },
  { name: "Sea Horse", weight: 2, speed: "fast" },
  { name: "Squid", weight: 2, speed: "fast" },
  { name: "Angelfish", weight: 2, speed: "fast" },
  { name: "Horse Mackerel", weight: 2, speed: "fast" },
  { name: "Trout", weight: 1, speed: "veryfast" },
  { name: "Ray", weight: 1, speed: "veryfast" },
];

export interface FishSpecies {
  name: FishName;
  xp: number;
  image: string;
  weight: number;
  speed: Speed;
}

/** The pool, with XP + icon resolved (species missing either are dropped). */
export const FISH_POOL: FishSpecies[] = POOL_SPEC.flatMap((spec) => {
  const xp = FISH[spec.name]?.experience;
  const image = (ITEM_DETAILS as Record<string, { image?: string }>)[spec.name]
    ?.image;
  if (!xp || !image) return [];
  return [{ ...spec, xp, image }];
});

export interface StreamFish {
  id: number;
  name: FishName;
  xp: number;
  image: string;
  /** Lane down the river band, as a fraction 0 (top) → 1 (bottom). */
  lane: number;
  /** True = enters from the left drifting right; false = the reverse. */
  fromLeft: boolean;
  /** ms from game start when it enters the river. */
  spawnAt: number;
  /** ms to drift fully across the river. */
  crossMs: number;
}

const lerp = (min: number, max: number, r: number) => min + (max - min) * r;

/** Weighted species pick from the pool. */
function pickSpecies(rand: () => number): FishSpecies {
  const total = FISH_POOL.reduce((sum, f) => sum + f.weight, 0);
  let roll = rand() * total;
  for (const f of FISH_POOL) {
    roll -= f.weight;
    if (roll <= 0) return f;
  }
  return FISH_POOL[FISH_POOL.length - 1];
}

/**
 * The full stream of fish for a giveaway. Deterministic: same id in → same fish
 * out, on every client. Sorted by spawn time. Fish get denser as the clock runs
 * down.
 */
export function fishSchedule(giveawayId: string): StreamFish[] {
  const rand = mulberry32(hashString(`fishing:${giveawayId}`));
  const fish: StreamFish[] = [];

  let id = 0;
  let t = 500;
  while (t < RACE_DURATION_MS - 1200) {
    const progress = t / RACE_DURATION_MS;
    const count = rand() < 0.45 ? 2 : 1;

    for (let i = 0; i < count; i += 1) {
      const spec = pickSpecies(rand);
      fish.push({
        id: id++,
        name: spec.name,
        xp: spec.xp,
        image: spec.image,
        lane: 0.12 + rand() * 0.76,
        fromLeft: rand() < 0.5,
        spawnAt: Math.round(t + i * 350),
        crossMs: Math.round(CROSS_MS[spec.speed] * (0.85 + rand() * 0.3)),
      });
    }

    // Gap between spawns shrinks as the round heats up (± jitter).
    t += lerp(1100, 520, progress) * (0.8 + rand() * 0.4);
  }

  return fish.sort((a, b) => a.spawnAt - b.spawnAt);
}

/**
 * A fish's progress across the river at `elapsed` ms: 0 as it enters, 1 as it
 * leaves. Only in [0, 1] is it on-screen and catchable.
 */
export function fishProgress(fish: StreamFish, elapsed: number): number {
  return (elapsed - fish.spawnAt) / fish.crossMs;
}

/** A fish's X as a fraction across the river (0 = left edge, 1 = right edge). */
export function fishXFraction(fish: StreamFish, elapsed: number): number {
  const p = fishProgress(fish, elapsed);
  return fish.fromLeft ? p : 1 - p;
}
