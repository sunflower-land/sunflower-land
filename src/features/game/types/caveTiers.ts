import Decimal from "decimal.js-light";
import type { InventoryItemName, IslandType } from "./game";

// Both repos keep this file byte-identical.

/** The Cave has eight tiers; each adds one Myco Bin and its patch. */
export const CAVE_MAX_TIER = 8;

/** A tier reached by expanding (Tier I comes with building the Cave). */
export type CaveExpansionTier = 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Any Cave tier, I to VIII. */
export type CaveTierLevel = 1 | CaveExpansionTier;

export type CaveTier = {
  /** The island (or any later one) the player must have reached. */
  island: IslandType;
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
  /** How long construction takes before the tier can be completed. */
  buildMs: number;
};

const HOUR_MS = 60 * 60 * 1000;

// Costs: discussion #7721 Balance Update (7 Oct 2026) — Coins, Mud, Wood and
// Stone every tier, Leather at III–IV, Pig Bristles from V. Mud rescaled
// (Bryn, 2026-10-21) to start at 80 and keep the alpha shape: doubling to
// tier V, then x1.5, tier VIII rounded to 2,200. At 20 Mud per 12h batch, Mud is the real gate on every
// tier, so build times (settled 2026-10-21, 2h → 48h) are set for feel: each
// step at most 2x, capped under the late-island land expansions.
export const CAVE_TIERS: Record<CaveExpansionTier, CaveTier> = {
  2: {
    island: "desert",
    coins: 500,
    ingredients: {
      Mud: new Decimal(80),
      Wood: new Decimal(25),
      Stone: new Decimal(10),
    },
    buildMs: 2 * HOUR_MS,
  },
  3: {
    island: "volcano",
    coins: 1000,
    ingredients: {
      Mud: new Decimal(160),
      Wood: new Decimal(50),
      Stone: new Decimal(25),
      Leather: new Decimal(10),
    },
    buildMs: 4 * HOUR_MS,
  },
  4: {
    island: "swamp",
    coins: 2500,
    ingredients: {
      Mud: new Decimal(320),
      Wood: new Decimal(75),
      Stone: new Decimal(50),
      Leather: new Decimal(15),
    },
    buildMs: 8 * HOUR_MS,
  },
  5: {
    island: "spooky",
    coins: 5000,
    ingredients: {
      Mud: new Decimal(640),
      Wood: new Decimal(100),
      Stone: new Decimal(75),
      "Pig Bristles": new Decimal(20),
    },
    buildMs: 12 * HOUR_MS,
  },
  6: {
    island: "crystal",
    coins: 10_000,
    ingredients: {
      Mud: new Decimal(960),
      Wood: new Decimal(150),
      Stone: new Decimal(100),
      "Pig Bristles": new Decimal(30),
    },
    buildMs: 24 * HOUR_MS,
  },
  7: {
    island: "galaxy",
    coins: 20_000,
    ingredients: {
      Mud: new Decimal(1440),
      Wood: new Decimal(200),
      Stone: new Decimal(150),
      "Pig Bristles": new Decimal(40),
    },
    buildMs: 36 * HOUR_MS,
  },
  8: {
    island: "marble",
    coins: 40_000,
    ingredients: {
      Mud: new Decimal(2200),
      Wood: new Decimal(250),
      Stone: new Decimal(200),
      "Pig Bristles": new Decimal(50),
    },
    buildMs: 48 * HOUR_MS,
  },
};

/** The tier the Cave would expand to next, or undefined at the last tier. */
export function getNextCaveTier(tier: number): CaveExpansionTier | undefined {
  const next = tier + 1;
  return next >= 2 && next <= CAVE_MAX_TIER
    ? (next as CaveExpansionTier)
    : undefined;
}
