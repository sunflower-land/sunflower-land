import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  CompetitionTaskName,
  getCompetitionPointsPerTask,
} from "features/game/types/competitions";
import { CookableName } from "features/game/types/consumables";
import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { translate } from "lib/i18n/translate";
import { COOK_OFF_FOODS } from "./speedUpRecipe";

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

        // Increment points for the cookoff competition
        if (
          hasFeatureAccess(game, "PEGGYS_COOKOFF") &&
          COOK_OFF_FOODS.includes(recipe.name)
        ) {
          const cookoffFoodsTasks: Partial<
            Record<CookableName, CompetitionTaskName>
          > = {
            "Fried Tofu": "Cook Fried Tofu",
            "Rice Bun": "Cook Rice Bun",
            "Grape Juice": "Prepare Grape Juice",
            "Banana Blast": "Prepare Banana Blast",
            "Orange Cake": "Cook Orange Cake",
            "Fermented Fish": "Cook Fermented Fish",
            "Fancy Fries": "Cook Fancy Fries",
            Pancakes: "Cook Pancakes",
            "Tofu Scramble": "Cook Tofu Scramble",
            "Honey Cake": "Cook Honey Cake",
          };

          const task = cookoffFoodsTasks[recipe.name];
          const peggyCompetition = game.competitions.progress["PEGGYS_COOKOFF"];

          if (task && peggyCompetition) {
            peggyCompetition.points += getCompetitionPointsPerTask({
              game,
              name: "PEGGYS_COOKOFF",
              task,
            });
            peggyCompetition.currentProgress[task] =
              (peggyCompetition.currentProgress[task] ?? 0) +
              getCompetitionPointsPerTask({
                game,
                name: "PEGGYS_COOKOFF",
                task,
              });
          }
        }
        return acc;
      }

      return [...acc, recipe];
    }, [] as BuildingProduct[]);

    return game;
  });
}
