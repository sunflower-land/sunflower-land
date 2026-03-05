import Decimal from "decimal.js-light";
import {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "lib/object";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getCurrentCookingItem, recalculateQueue } from "./cancelQueuedRecipe";
import {
  assertCookableName,
  CookableName,
} from "features/game/types/consumables";
import { getCookingAmount } from "./collectRecipe";
import {
  getInstantGems,
  makeGemHistory,
} from "features/game/lib/getInstantGems";

export type InstantCookRecipe = {
  type: "recipe.spedUp";
  buildingId: string;
  buildingName: BuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: InstantCookRecipe;
  createdAt?: number;
  farmId: number;
};

// To delete after cookoff
export const COOK_OFF_FOODS: CookableName[] = [
  "Fried Tofu",
  "Rice Bun",
  "Grape Juice",
  "Banana Blast",
  "Orange Cake",
  "Honey Cake",
  "Fermented Fish",
  "Fancy Fries",
  "Pancakes",
  "Tofu Scramble",
];

export function speedUpRecipe({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    const building = game.buildings[action.buildingName]?.find(
      (b) => b.id === action.buildingId,
    );

    if (!building) {
      throw new Error("Building does not exist");
    }

    const queue = building.crafting;
    const recipe = getCurrentCookingItem({ building, createdAt });

    if (!queue || !recipe) {
      throw new Error("Nothing is cooking");
    }

    const gems = getInstantGems({
      readyAt: recipe.readyAt,
      now: createdAt,
      game,
    });

    if (!game.inventory["Gem"]?.gte(gems)) {
      throw new Error("Insufficient gems");
    }

    game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(gems);
    const cookableName = assertCookableName(recipe.name);

    const amount = getCookingAmount({
      building: action.buildingName,
      game,
      recipe,
      farmId,
      counter: game.farmActivity[`${cookableName} Cooked`] || 0,
    });
    game.inventory[cookableName] = (
      game.inventory[cookableName] ?? new Decimal(0)
    ).add(amount);

    const queueWithoutSpedUpRecipe = queue.filter(
      (item) => item.readyAt !== recipe.readyAt,
    );

    building.crafting = recalculateQueue({
      queue: queueWithoutSpedUpRecipe,
      createdAt,
      buildingName: action.buildingName as CookingBuildingName,
      isInstantCook: true,
      game,
    });

    game = makeGemHistory({ game, amount: gems, createdAt });

    game.farmActivity = trackFarmActivity(
      `${cookableName} Cooked`,
      game.farmActivity,
    );

    return game;
  });
}
