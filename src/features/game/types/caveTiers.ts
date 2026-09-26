import Decimal from "decimal.js-light";
import type { InventoryItemName, IslandType } from "./game";

// Both repos keep this file byte-identical.

/** The Cave has eight tiers; each adds one Myco-Composter and its patch. */
export const CAVE_MAX_TIER = 8;

/** A tier reached by expanding (Tier I comes with building the Cave). */
export type CaveExpansionTier = 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CaveTier = {
  /** The island (or any later one) the player must have reached. */
  island: IslandType;
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
  /** How long construction takes before the tier can be completed. */
  buildMs: number;
  /** What else the tier opens in the Cave. */
  unlocks?: "merchant" | "merchantOffers";
};

const HOUR_MS = 60 * 60 * 1000;

// TODO(Cave balance 465): placeholder costs and build times. Input types follow
// the spec; quantities and durations are invented.
export const CAVE_TIERS: Record<CaveExpansionTier, CaveTier> = {
  2: {
    island: "desert",
    coins: 10_000,
    ingredients: { Mud: new Decimal(20), Stone: new Decimal(50) },
    buildMs: 4 * HOUR_MS,
  },
  3: {
    island: "volcano",
    coins: 25_000,
    ingredients: { Mud: new Decimal(40), Rawhide: new Decimal(10) },
    buildMs: 8 * HOUR_MS,
  },
  4: {
    island: "swamp",
    coins: 0,
    ingredients: {
      Mud: new Decimal(60),
      Iron: new Decimal(50),
      Gold: new Decimal(20),
    },
    buildMs: 12 * HOUR_MS,
  },
  5: {
    island: "spooky",
    coins: 0,
    ingredients: {
      Mud: new Decimal(80),
      Rawhide: new Decimal(25),
      Crimstone: new Decimal(5),
    },
    buildMs: 24 * HOUR_MS,
    unlocks: "merchant",
  },
  6: {
    island: "crystal",
    coins: 0,
    ingredients: {
      Mud: new Decimal(100),
      Rawhide: new Decimal(40),
      Truffle: new Decimal(10),
    },
    buildMs: 36 * HOUR_MS,
  },
  7: {
    island: "galaxy",
    coins: 75_000,
    ingredients: {
      Mud: new Decimal(120),
      Rawhide: new Decimal(50),
      Truffle: new Decimal(20),
    },
    buildMs: 48 * HOUR_MS,
  },
  8: {
    island: "marble",
    coins: 150_000,
    ingredients: {
      Mud: new Decimal(150),
      Rawhide: new Decimal(60),
      Truffle: new Decimal(30),
    },
    buildMs: 72 * HOUR_MS,
    unlocks: "merchantOffers",
  },
};

/** The tier the Cave would expand to next, or undefined at the last tier. */
export function getNextCaveTier(tier: number): CaveExpansionTier | undefined {
  const next = tier + 1;
  return next >= 2 && next <= CAVE_MAX_TIER
    ? (next as CaveExpansionTier)
    : undefined;
}
