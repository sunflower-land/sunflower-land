import Decimal from "decimal.js-light";
import { produce } from "immer";

import {
  FoodProcessingBuildingName,
  isFoodProcessingBuilding,
} from "features/game/types/buildings";
import {
  INSTANT_PROCESSED_RECIPES,
  InstantProcessedRecipeName,
} from "features/game/types/consumables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState, InventoryItemName } from "features/game/types/game";

export type MakeInstantRecipeAction = {
  type: "instantRecipe.made";
  recipe: InstantProcessedRecipeName;
  buildingId: string;
  buildingName: FoodProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: MakeInstantRecipeAction;
  createdAt?: number;
};

export function makeInstantRecipe({
  state,
  action,
  createdAt: _createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!isFoodProcessingBuilding(action.buildingName)) {
      throw new Error("Invalid food processing building");
    }

    const building = game.buildings[action.buildingName]?.find(
      (building) => building.id === action.buildingId,
    );

    if (!building) {
      throw new Error("Required building does not exist");
    }

    if (!building.coordinates) {
      throw new Error("Building is not placed");
    }

    const recipe = INSTANT_PROCESSED_RECIPES[action.recipe];

    if (!recipe) {
      throw new Error("Recipe does not exist");
    }

    const ingredients = recipe.ingredients;

    game.inventory = Object.entries(ingredients).reduce(
      (inventory, [ingredient, amount]) => {
        const count =
          inventory[ingredient as InventoryItemName] ?? new Decimal(0);

        if (count.lt(amount ?? 0)) {
          throw new Error(`Insufficient ingredient: ${ingredient}`);
        }

        return {
          ...inventory,
          [ingredient]: count.sub(amount),
        };
      },
      game.inventory,
    );

    const previous = game.inventory[action.recipe] ?? new Decimal(0);
    game.inventory[action.recipe] = previous.add(1);

    game.farmActivity = trackFarmActivity(
      `${action.recipe} Made`,
      game.farmActivity,
    );
  });
}
