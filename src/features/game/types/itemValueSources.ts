import type Decimal from "decimal.js-light";
import type { InventoryItemName } from "./game";
import { CROPS, GREENHOUSE_CROPS } from "./crops";
import { PATCH_FRUIT, GREENHOUSE_FRUIT } from "./fruits";
import { COOKABLES } from "./consumables";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "./tools";

/**
 * The per-repo adapter under `itemValue.ts` (which both repos keep
 * byte-identical). The client and API spell the crop, fruit, cooking and tool
 * tables slightly differently, so each repo normalises them here.
 */

export type ItemValues = Partial<Record<InventoryItemName, number>>;

export type ItemRecipe = {
  kind: "food" | "tool";
  coins?: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
  /** Cooking or crafting time, for the time premium. */
  seconds: number;
  /** Where a dish is cooked; the Fire Pit's are the beginner tier. */
  building?: string;
};

const sellPrices = (table: Record<string, { sellPrice: number }>) =>
  Object.fromEntries(
    Object.entries(table).map(([item, { sellPrice }]) => [item, sellPrice]),
  ) as ItemValues;

/** Crops and fruit, at the sell price. */
export const CROP_VALUES: ItemValues = {
  ...sellPrices(CROPS),
  ...sellPrices(GREENHOUSE_CROPS),
};

export const FRUIT_VALUES: ItemValues = {
  ...sellPrices(PATCH_FRUIT),
  ...sellPrices(GREENHOUSE_FRUIT),
};

/** Cooked food and crafted tools, valued by rolling up their recipes. */
export const ITEM_RECIPES: Partial<Record<InventoryItemName, ItemRecipe>> = {
  ...Object.fromEntries(
    Object.entries(COOKABLES)
      .filter(([, cookable]) => !cookable.disabled)
      .map(([item, { ingredients, cookingSeconds, building }]) => [
        item,
        { kind: "food", ingredients, seconds: cookingSeconds, building },
      ]),
  ),
  ...Object.fromEntries(
    Object.entries({ ...WORKBENCH_TOOLS, ...TREASURE_TOOLS }).map(
      ([item, { price, ingredients }]) => [
        item,
        { kind: "tool", coins: price, ingredients: ingredients(), seconds: 0 },
      ],
    ),
  ),
};
