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
 * Produce: "worth the feed that made it" - the crops to level the animal
 * 0 -> 15 on its favourite food at sell price, over its produce, with the
 * secondary drop at twice the primary (ticket 370's crop counts).
 * Beetles: worth the Cow feeding they replace (BEETLE_FEEDING_XP against 60 XP
 * for 5 Corn), so they double with rarity.
 * Mushrooms: 1 Wild Mushroom = 2 Wheat (the Slop lane, pigFeeds.ts); a Magic
 * Mushroom is 10 Wild Mushrooms, the Cave's spawn ratio (one Mushroom tile
 * in ten is Magic, cavePatch.ts). The island is kinder, 5 Wild per 16h to
 * 3 Magic per 36h, so this errs high.
 * Mud: between its input (10 Carrots per 40 Mud) and its use (10 Mud is a
 * quarter more XP on three feeds).
 * Resources: the tool chain's ratios (a Stone's Pickaxe, an Iron's Stone
 * Pickaxe, ...) with Stone at two Kale; Obsidian from the Lava Pit's inputs
 * and Sunstone as three Obsidian (exchangeObsidian.ts).
 */
export const BASE_VALUES = {
  Wood: 2,
  Stone: 5,
  Iron: 30,
  Gold: 160,
  Crimstone: 500,
  Oil: 230,
  Obsidian: 4000,
  Sunstone: 12000,

  Egg: 8,
  Feather: 16,
  Wool: 38,
  "Merino Wool": 76,
  Milk: 95,
  Leather: 190,
  Honey: 40,
  Truffle: 110,
  "Pig Bristles": 20,

  Mud: 2,
  "Wild Mushroom": 14,
  "Magic Mushroom": 140,
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

  return total * premium;
}

/** True when the item has an in-game value the Merchant can price with. */
export function hasItemValue(item: InventoryItemName): boolean {
  return getItemValue(item) !== undefined;
}
