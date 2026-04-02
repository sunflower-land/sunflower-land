import {
  COOKABLES,
  PIRATE_CAKE,
  FISH,
  Consumable,
  FACTION_FOOD,
  TRADE_FOOD,
  AGED_FISH,
  PRIME_AGED_FISH,
} from "features/game/types/consumables";
import { Inventory } from "features/game/types/game";
import { BuildingName } from "features/game/types/buildings";

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
    ...Object.values(FISH).sort((a, b) => a.name.localeCompare(b.name)),
    ...Object.values(AGED_FISH).sort((a, b) => a.name.localeCompare(b.name)),
    ...Object.values(PRIME_AGED_FISH).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  ];
}

export function getAvailableFood(inventory: Inventory): Consumable[] {
  return getAllFoods().filter(
    (consumable) => !!inventory[consumable.name]?.gt(0),
  );
}
