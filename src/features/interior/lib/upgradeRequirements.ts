import Decimal from "decimal.js-light";
import type {
  HomeExpansionTier,
  InventoryItemName,
} from "features/game/types/game";

/**
 * Cost the player pays to UNLOCK a given home-expansion tier.
 *
 * The first upgrade (volcano → "level-one-start") unlocks the new floor — its
 * cost is keyed under `"level-one-start"`. Each subsequent entry is the cost
 * to advance from the previous tier into THIS tier.
 *
 * Placeholder costs — escalating coins + Obsidian. Easy to retune by editing
 * this single object. If you add new tiers, add them to
 * HOME_EXPANSION_TIER_ORDER (interiorLayouts.ts) AND here.
 */
export type UpgradeCost = {
  coins: number;
  inventory: Partial<Record<InventoryItemName, Decimal>>;
};

export const HOME_EXPANSION_UPGRADE_REQUIREMENTS: Record<
  HomeExpansionTier,
  UpgradeCost
> = {
  // Level 0 → 1 — unlock the Level One Floor
  "level-one-start": {
    coins: 1_500,
    inventory: {
      Wood: new Decimal(650),
      Stone: new Decimal(230),
    },
  },
  // Level 1 → 2
  "level-one-2": {
    coins: 3_000,
    inventory: {
      Wood: new Decimal(850),
      Stone: new Decimal(500),
      Iron: new Decimal(25),
    },
  },
  // Level 2 → 3
  "level-one-3": {
    coins: 6_000,
    inventory: {
      Wood: new Decimal(1_000),
      Stone: new Decimal(800),
      Iron: new Decimal(80),
      Gold: new Decimal(10),
    },
  },
  // Level 3 → 4
  "level-one-4": {
    coins: 12_000,
    inventory: {
      Wood: new Decimal(1_200),
      Stone: new Decimal(1_000),
      Iron: new Decimal(180),
      Gold: new Decimal(40),
      Crimstone: new Decimal(8),
    },
  },
  // Level 4 → 5
  "level-one-5": {
    coins: 22_000,
    inventory: {
      Wood: new Decimal(1_350),
      Stone: new Decimal(1_200),
      Iron: new Decimal(300),
      Gold: new Decimal(100),
      Crimstone: new Decimal(30),
    },
  },
  // Level 5 → 6
  "level-one-6": {
    coins: 40_000,
    inventory: {
      Wood: new Decimal(1_500),
      Stone: new Decimal(1_400),
      Iron: new Decimal(450),
      Gold: new Decimal(220),
      Crimstone: new Decimal(75),
    },
  },
  // Level 6 → 7 (Premium)
  "level-one-full": {
    coins: 65_000,
    inventory: {
      Wood: new Decimal(1_800),
      Stone: new Decimal(1_700),
      Iron: new Decimal(600),
      Gold: new Decimal(400),
      Crimstone: new Decimal(120),
    },
  },
};
