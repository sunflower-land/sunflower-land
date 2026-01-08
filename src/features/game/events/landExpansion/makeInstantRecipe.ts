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
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/0921abae-0d89-4e79-9a7b-5f20de6d53ab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H1",
        location: "makeInstantRecipe.ts:entry",
        message: "instantRecipe.made entry",
        data: {
          recipe: action.recipe,
          buildingId: action.buildingId,
          buildingName: action.buildingName,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

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

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/0921abae-0d89-4e79-9a7b-5f20de6d53ab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H2",
        location: "makeInstantRecipe.ts:before-deduct",
        message: "ingredients & inventory before deduction",
        data: {
          ingredients,
          inventorySnapshot: {
            recipeCount: game.inventory[action.recipe] ?? null,
          },
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

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

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/0921abae-0d89-4e79-9a7b-5f20de6d53ab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H3",
        location: "makeInstantRecipe.ts:after-add",
        message: "inventory after recipe creation",
        data: {
          recipe: action.recipe,
          newCount: game.inventory[action.recipe],
          farmActivity: game.farmActivity?.[`${action.recipe} Made`],
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    game.farmActivity = trackFarmActivity(
      `${action.recipe} Made`,
      game.farmActivity,
    );
  });
}
