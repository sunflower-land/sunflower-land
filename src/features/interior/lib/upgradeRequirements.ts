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
    // Unlock the Level One Floor
    coins: 1_000,
    inventory: { Wood: new Decimal(2500) },
  },
  "level-one-2": {
    coins: 10_000,
    inventory: { Stone: new Decimal(2000) },
  },
  "level-one-3": {
    coins: 50_000,
    inventory: { Iron: new Decimal(500), Obsidian: new Decimal(1) },
  },
  "level-one-4": {
    coins: 100_000,
    inventory: { Gold: new Decimal(100), Obsidian: new Decimal(5) },
  },
  "level-one-5": {
    coins: 150_000,
    inventory: { Crimstone: new Decimal(100), Obsidian: new Decimal(10) },
  },
  "level-one-6": {
    coins: 250_000,
    inventory: { Gold: new Decimal(250), Wood: new Decimal(5000) },
  },
  "level-one-full": {
    coins: 500_000,
    inventory: { Crimstone: new Decimal(250), Obsidian: new Decimal(35) },
  },
};
