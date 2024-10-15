import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";

export type CollectRecipeAction = {
  type: "recipe.collected";
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

    const recipe = building.crafting;
    const amount = new Decimal(recipe?.amount || 1);
    if (!recipe) {
      throw new Error(translate("error.buildingNotCooking"));
    }

    if (createdAt < recipe.readyAt) {
      throw new Error(translate("error.recipeNotReady"));
    }

    delete building.crafting;

    const consumableCount = game.inventory[recipe.name] || new Decimal(0);

    bumpkin.activity = trackActivity(`${recipe.name} Cooked`, bumpkin.activity);

    game.inventory[recipe.name] = consumableCount.add(amount);

    return game;
  });
}
