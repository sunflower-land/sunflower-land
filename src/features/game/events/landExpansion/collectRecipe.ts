import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";

import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { prngChance } from "lib/prng";
import { isCookingBuilding } from "./cook";
import { isWearableActive } from "features/game/lib/wearables";

export type CollectRecipeAction = {
  type: "recipes.collected";
  building: BuildingName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectRecipeAction;
  createdAt?: number;
  farmId: number;
};

export const getCookingAmount = ({
  building,
  recipe,
  farmId,
  counter,
  game,
}: {
  building: BuildingName;
  recipe: BuildingProduct;
  farmId: number;
  counter: number;
  game: GameState;
}): number => {
  let amount = 1;

  // Double Nom - Guarantee +1 food
  if (recipe.skills?.["Double Nom"] && isCookingBuilding(building)) {
    amount += 1;
  }

  // Fiery Jackpot - 20% Chance to double the amount from Fire Pit
  if (
    building === "Fire Pit" &&
    game.bumpkin.skills["Fiery Jackpot"] &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[recipe.name],
      counter,
      chance: 20,
      criticalHitName: "Fiery Jackpot",
    })
  ) {
    amount += 1;
  }

  if (
    isWearableActive({ name: "Master Chef's Cleaver", game }) &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[recipe.name],
      counter,
      chance: 10,
      criticalHitName: "Master Chef's Cleaver",
    })
  ) {
    amount += 1;
  }

  return amount;
};

export function collectRecipe({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;

    const building = game.buildings[action.building]?.find(
      (b) => b.id === action.buildingId,
    );

    if (!building) {
      throw new Error(translate("error.buildingNotExist"));
    }

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const recipes = building.crafting ?? [];
    if (!recipes.length) {
      throw new Error(translate("error.buildingNotCooking"));
    }

    const nothingReady = recipes.every((recipe) => recipe.readyAt > createdAt);
    if (nothingReady) {
      throw new Error(translate("error.recipeNotReady"));
    }

    // Collect all recipes that are ready
    building.crafting = (building.crafting ?? []).reduce((acc, recipe) => {
      if (recipe.readyAt <= createdAt) {
        const amount = getCookingAmount({
          building: action.building,
          game,
          recipe,
          farmId,
          counter: bumpkin.activity[`${recipe.name} Cooked`] || 0,
        });
        const consumableCount = game.inventory[recipe.name] || new Decimal(0);
        game.inventory[recipe.name] = consumableCount.add(amount);

        bumpkin.activity = trackActivity(
          `${recipe.name} Cooked`,
          bumpkin.activity,
        );

        return acc;
      }

      return [...acc, recipe];
    }, [] as BuildingProduct[]);

    return game;
  });
}
