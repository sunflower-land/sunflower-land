import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";

export type CollectRecipeAction = {
  type: "recipes.collected";
  building: BuildingName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectRecipeAction;
  createdAt?: number;
};

export function collectRecipe({
  state,
  action,
  createdAt = Date.now(),
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
        const amount = new Decimal(recipe?.amount || 1);
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
