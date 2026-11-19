import { getKeys } from "lib/object";
import type { InventoryItemName } from "./game";
import type { BeetleName } from "./beetles";
import { FLOWERS, type FlowerName } from "./flowers";
import type { WeatherEventName } from "./weather";

export type WeatherItemName =
  | "Sandbag"
  | "Balk"
  | "Pest Smoker"
  | "Thaw Stone"
  | "Merino Wool Insulation"
  | "Shade Cloth"
  | "Wildflower Lure";

type Ingredients = Partial<Record<InventoryItemName, number>>;

export type WeatherItemRecipe = {
  ingredients: Ingredients;
  /** The player pays exactly one of these on top of `ingredients`. */
  choice?: Ingredients;
};

const PEST_SMOKER_BEETLES: Partial<Record<BeetleName, number>> = {
  "Green Beetle": 10,
  "Blue Beetle": 3,
  "Pink Beetle": 2,
  "Amber Beetle": 1,
};

const LURE_FLOWERS = getKeys(FLOWERS).reduce(
  (choice, flower) => ({ ...choice, [flower]: 1 }),
  {} as Partial<Record<FlowerName, number>>,
);

// Crafted in the Weather Shop, with no coin cost and the same price on every
// island.
export const WEATHER_ITEM_RECIPES: Record<WeatherItemName, WeatherItemRecipe> =
  {
    // Sandbag and Balk amounts are provisional, pending a rebalance.
    Sandbag: { ingredients: { Sand: 10, Leather: 2 } },
    Balk: { ingredients: { Wood: 10, Leather: 2 } },
    "Pest Smoker": {
      ingredients: { Wood: 30, Feather: 30 },
      choice: PEST_SMOKER_BEETLES,
    },
    "Thaw Stone": {
      ingredients: { "Pig Bristles": 25, Stone: 5, "Merino Wool": 10 },
    },
    "Merino Wool Insulation": {
      ingredients: { "Pig Bristles": 25, "Merino Wool": 10 },
    },
    "Shade Cloth": {
      ingredients: { "Pig Bristles": 25, "Merino Wool": 10 },
    },
    "Wildflower Lure": {
      ingredients: { Honey: 5, "Green Beetle": 5 },
      choice: LURE_FLOWERS,
    },
  };

/** The event each item covers while it is placed. */
export const WEATHER_ITEM_EVENTS: Record<WeatherItemName, WeatherEventName> = {
  Sandbag: "flood",
  Balk: "tornado",
  "Pest Smoker": "insectPlague",
  "Thaw Stone": "greatFreeze",
  "Merino Wool Insulation": "heavyRains",
  "Shade Cloth": "sunshower",
  "Wildflower Lure": "beeMigration",
};

export const isWeatherItemName = (name: string): name is WeatherItemName =>
  Object.prototype.hasOwnProperty.call(WEATHER_ITEM_RECIPES, name);

/**
 * Everything one craft of `item` costs. `ingredient` is the player's pick for
 * a recipe with a choice; returns undefined when it's missing, not on offer,
 * or given for a recipe without a choice.
 */
export function getWeatherItemIngredients(
  item: WeatherItemName,
  ingredient?: InventoryItemName,
): Ingredients | undefined {
  const { ingredients, choice } = WEATHER_ITEM_RECIPES[item];

  if (!choice) return ingredient === undefined ? ingredients : undefined;

  if (
    ingredient === undefined ||
    !Object.prototype.hasOwnProperty.call(choice, ingredient)
  ) {
    return undefined;
  }

  return {
    ...ingredients,
    [ingredient]: (ingredients[ingredient] ?? 0) + (choice[ingredient] ?? 0),
  };
}
