import { produce } from "immer";
import Decimal from "decimal.js-light";
import { RecipeItemName, RECIPES } from "features/game/lib/crafting";
import {
  GameState,
  ISLAND_EXPANSIONS,
  IslandType,
} from "features/game/types/game";

export type DiscoverRecipeAction = {
  type: "recipe.discovered";
  recipe: RecipeItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: DiscoverRecipeAction;
  createdAt?: number;
};

export const RECIPE_UNLOCKS: Partial<
  Record<RecipeItemName, { island: IslandType; expansion: number }>
> = {
  "Basic Bed": {
    island: "basic",
    expansion: 2,
  },
  "Fisher Bed": {
    island: "basic",
    expansion: 6,
  },
  "Floral Bed": { island: "spring", expansion: 1 },
  "Sturdy Bed": { island: "spring", expansion: 12 },
  "Desert Bed": { island: "desert", expansion: 1 },
  "Cow Bed": { island: "desert", expansion: 12 },
  "Pirate Bed": { island: "desert", expansion: 18 },
  "Royal Bed": { island: "desert", expansion: 25 },
};

export const canDiscoverRecipe = (state: GameState, recipe: RecipeItemName) => {
  const currentIsland = state.island.type;

  const currentIslandIndex = ISLAND_EXPANSIONS.findIndex(
    (name) => name === currentIsland,
  );
  const alreadyVisibleIslands = ISLAND_EXPANSIONS.slice(0, currentIslandIndex);

  const recipeUnlock = RECIPE_UNLOCKS[recipe];
  if (!recipeUnlock) return false;

  if (alreadyVisibleIslands.includes(recipeUnlock.island)) return true;

  return (
    recipeUnlock.island === currentIsland &&
    (state.inventory["Basic Land"] ?? new Decimal(0)).gte(
      recipeUnlock.expansion,
    )
  );
};

export function discoverRecipe({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const recipeUnlock = RECIPE_UNLOCKS[action.recipe];
    if (!recipeUnlock) throw new Error("Recipe cannot be discovered");

    if (!canDiscoverRecipe(copy, action.recipe)) {
      throw new Error("Insufficient Basic Land");
    }

    copy.craftingBox.recipes[action.recipe] = RECIPES(copy)[action.recipe];

    return copy;
  });
}
