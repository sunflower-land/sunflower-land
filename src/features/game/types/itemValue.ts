import type { InventoryItemName } from "./game";
import { BEETLE_FEEDING_XP } from "./beetles";
import {
  CROP_VALUES,
  FRUIT_VALUES,
  ITEM_RECIPES,
  type ItemValues,
} from "./itemValueSources";

// Both repos keep this file byte-identical. `itemValueSources.ts` is the
// per-repo adapter over the crop, fruit, cooking and tool tables.

/**
 * In-game values, in coins at the crop sell-price scale (Carrot 0.8, Kale 10,
 * Rice 320). Every anchor below is derived from an in-game chain and never
 * from the marketplace, so the Goblin Cave Merchant's offers stay stable
 * between visits and both repos agree on them. These are the numbers to tune.
 *
 * Round 2 (Bryn's trade-sheet review, 2026-10-21): the table is a
 * least-squares fit, in log space, to the 39 trades Bryn priced by hand, with
 * plants fixed at sell price, then rounded. The original chains are kept
 * below as the sanity check for each.
 *
 * Produce: roughly the feed that made it (Egg 10, Milk 90); Leather is what a
 * Cow and a few Corn cost, about a Gold, and the wools sit low because they
 * have weak sinks (Merino barely above Wool).
 * Beetles: the Cow feeding they replace (BEETLE_FEEDING_XP), doubling with
 * rarity, so Pink and Amber are asked for in fives.
 * Mushrooms: both are free spawns on a timer, so neither carries its recipe
 * weight: Magic at 60 (Bryn: ~50), Wild at 40 so Oil asks for a few, not a
 * dozen.
 * Mud: 40 Mud for 5 Merino Wool.
 * Resources: Gold is 15 Eggs or 1,000 Potatoes; Iron 160 Soybeans for 10;
 * Crimstone 10 Wool; Obsidian 400 Turnips. Wood and Stone are set by ratio
 * (Stone a third of Iron, Wood a third of Stone), not the coin chain: taken
 * literally an Axe makes Wood 20 and the chain puts Gold at 2,540, which
 * none of Bryn's rows support. Sunstone stays three Obsidian.
 * Sand Drill: a use value, not its recipe (966) - a Sand Shovel does the job.
 */
export const BASE_VALUES = {
  Wood: 5,
  Stone: 15,
  Iron: 40,
  Gold: 180,
  Crimstone: 550,
  Oil: 160,
  Obsidian: 4000,
  Sunstone: 12000,

  Egg: 10,
  Feather: 20,
  Wool: 30,
  "Merino Wool": 35,
  Milk: 90,
  Leather: 120,
  Honey: 35,
  Truffle: 80,
  "Pig Bristles": 20,

  Mud: 4,
  "Wild Mushroom": 40,
  "Magic Mushroom": 60,
  "Sand Drill": 120,
  "Green Beetle": BEETLE_FEEDING_XP["Green Beetle"] * 0.75,
  "Blue Beetle": BEETLE_FEEDING_XP["Blue Beetle"] * 0.75,
  "Pink Beetle": BEETLE_FEEDING_XP["Pink Beetle"] * 0.75,
  "Amber Beetle": BEETLE_FEEDING_XP["Amber Beetle"] * 0.75,
} satisfies ItemValues;

/**
 * Cooking and crafting time adds a quarter per day, capped at double, on top
 * of the ingredients: a 20h Pizza Margherita is worth about 1.2x its Tomato,
 * Cheese and Wheat.
 */
const TIME_PREMIUM_PER_DAY = 0.25;
const MAX_TIME_PREMIUM = 2;

/**
 * A dish is worth about half its ingredients: XP has an infinite sink and the
 * dish cannot be traded on, so 5 Gold buys 5 Beetroot Cakes (Bryn's sheet
 * fitted 0.49).
 */
const FOOD_VALUE_FACTOR = 0.5;

const DAY_SECONDS = 24 * 60 * 60;

const cache = new Map<string, number | undefined>();

/**
 * An item's in-game value in coins, or `undefined` when nothing prices it.
 * Plants are their sell price, anchors are `BASE_VALUES`, and recipes roll up
 * their ingredients (recursively, so Cheese prices through Milk) plus coins
 * and the time premium.
 */
export function getItemValue(item: InventoryItemName): number | undefined {
  if (cache.has(item)) return cache.get(item);

  // Mark before recursing, so a recipe loop prices as unknown, not forever.
  cache.set(item, undefined);
  const value = computeItemValue(item);
  cache.set(item, value);

  return value;
}

function computeItemValue(item: InventoryItemName): number | undefined {
  const anchor = (BASE_VALUES as ItemValues)[item];
  if (anchor !== undefined) return anchor;

  const plant = CROP_VALUES[item] ?? FRUIT_VALUES[item];
  if (plant !== undefined) return plant;

  const recipe = ITEM_RECIPES[item];
  if (!recipe) return undefined;

  let total = recipe.coins ?? 0;
  for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
    const value = getItemValue(ingredient as InventoryItemName);
    if (value === undefined || amount === undefined) return undefined;
    total += value * amount.toNumber();
  }

  const premium = Math.min(
    MAX_TIME_PREMIUM,
    1 + (recipe.seconds / DAY_SECONDS) * TIME_PREMIUM_PER_DAY,
  );

  return total * premium * (recipe.kind === "food" ? FOOD_VALUE_FACTOR : 1);
}

/** True when the item has an in-game value the Merchant can price with. */
export function hasItemValue(item: InventoryItemName): boolean {
  return getItemValue(item) !== undefined;
}
