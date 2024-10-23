import { produce } from "immer";
import Decimal from "decimal.js-light";
import { RecipeItemName, RECIPES } from "features/game/lib/crafting";
import { GameState } from "features/game/types/game";

export type DiscoverRecipeAction = {
  type: "recipe.discovered";
  recipe: RecipeItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: DiscoverRecipeAction;
  createdAt?: number;
};

export const REQUIRED_LAND_COUNT: Partial<Record<RecipeItemName, number>> = {
  "Basic Bed": 6,
  "Sturdy Bed": 10,
  "Floral Bed": 12,
};

export function discoverRecipe({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const requiredLandCount = REQUIRED_LAND_COUNT[action.recipe];
    if (!requiredLandCount) throw new Error("Recipe cannot be discovered");

    if (
      (copy.inventory["Basic Land"] ?? new Decimal(0)).lt(requiredLandCount)
    ) {
      throw new Error("Insufficient Basic Land");
    }

    copy.craftingBox.recipes[action.recipe] = RECIPES[action.recipe];

    return copy;
  });
}
