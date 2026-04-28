import Decimal from "decimal.js-light";
import { HomeExpansionTier, InventoryItemName } from "features/game/types/game";

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
  "level-one-start": {
    coins: 1_000,
    inventory: { Obsidian: new Decimal(5) },
  },
  "level-one-2": {
    coins: 5_000,
    inventory: { Obsidian: new Decimal(15) },
  },
  "level-one-3": {
    coins: 15_000,
    inventory: { Obsidian: new Decimal(35) },
  },
  "level-one-4": {
    coins: 30_000,
    inventory: { Obsidian: new Decimal(75) },
  },
  "level-one-5": {
    coins: 60_000,
    inventory: { Obsidian: new Decimal(125) },
  },
  "level-one-6": {
    coins: 100_000,
    inventory: { Obsidian: new Decimal(180) },
  },
  "level-one-full": {
    coins: 200_000,
    inventory: { Obsidian: new Decimal(250) },
  },
};
