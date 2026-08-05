import {
  COOKABLES,
  PIRATE_CAKE,
  FISH,
  type Consumable,
  type ConsumableName,
  FACTION_FOOD,
  TRADE_FOOD,
  AGED_FISH,
  PRIME_AGED_FISH,
  FIRE_PIT_COOKABLES,
  KITCHEN_COOKABLES,
  BAKERY_COOKABLES,
  DELI_COOKABLES,
  JUICE_COOKABLES,
} from "features/game/types/consumables";
import type { Inventory } from "features/game/types/game";
import type { BuildingName } from "features/game/types/buildings";
import { getKeys } from "lib/object";

export const BUILDING_ORDER: BuildingName[] = [
  "Fire Pit",
  "Kitchen",
  "Deli",
  "Smoothie Shack",
  "Bakery",
];

export function getAllFoods(): Consumable[] {
  return [
    ...Object.values(COOKABLES)
      .sort((a, b) => a.cookingSeconds - b.cookingSeconds)
      .sort(
        (a, b) =>
          BUILDING_ORDER.indexOf(a.building) -
          BUILDING_ORDER.indexOf(b.building),
      ),
    ...Object.values(PIRATE_CAKE),
    ...Object.values(FACTION_FOOD),
    ...Object.values(TRADE_FOOD),
    ...Object.values(FISH).sort((a, b) => a.experience - b.experience),
    ...Object.values(AGED_FISH).sort((a, b) => a.experience - b.experience),
    ...Object.values(PRIME_AGED_FISH).sort(
      (a, b) => a.experience - b.experience,
    ),
  ];
}

export function getAvailableFood(inventory: Inventory): Consumable[] {
  return getAllFoods().filter(
    (consumable) => !!inventory[consumable.name]?.gt(0),
  );
}

// Cooked meals are split by the building that cooks them; Pirate Cake and
// Faction/Trade food don't come from a cooking building, so they land in
// "special" (mirrors the "special" label used elsewhere for one-off items).
// Fish and Aged Fish (aged + prime aged) stay their own categories, as in
// the Chest/Basket inventory view.
export type FoodCategory =
  | "Fire Pit"
  | "Kitchen"
  | "Bakery"
  | "Deli"
  | "Smoothie Shack"
  | "special"
  | "fish"
  | "agedFish";

export const FOOD_CATEGORIES: FoodCategory[] = [
  "Fire Pit",
  "Kitchen",
  "Bakery",
  "Deli",
  "Smoothie Shack",
  "special",
  "fish",
  "agedFish",
];

const FOOD_CATEGORY_NAMES: Record<FoodCategory, Set<ConsumableName>> = {
  "Fire Pit": new Set<ConsumableName>(getKeys(FIRE_PIT_COOKABLES)),
  Kitchen: new Set<ConsumableName>(getKeys(KITCHEN_COOKABLES)),
  Bakery: new Set<ConsumableName>(getKeys(BAKERY_COOKABLES)),
  Deli: new Set<ConsumableName>(getKeys(DELI_COOKABLES)),
  "Smoothie Shack": new Set<ConsumableName>(getKeys(JUICE_COOKABLES)),
  special: new Set<ConsumableName>([
    ...getKeys(PIRATE_CAKE),
    ...getKeys(FACTION_FOOD),
    ...getKeys(TRADE_FOOD),
  ]),
  fish: new Set<ConsumableName>(getKeys(FISH)),
  agedFish: new Set<ConsumableName>([
    ...getKeys(AGED_FISH),
    ...getKeys(PRIME_AGED_FISH),
  ]),
};

export function groupFoodByCategory(
  food: Consumable[],
): { category: FoodCategory; items: Consumable[] }[] {
  return FOOD_CATEGORIES.map((category) => ({
    category,
    items: food.filter((item) => FOOD_CATEGORY_NAMES[category].has(item.name)),
  })).filter((group) => group.items.length > 0);
}
