import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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
  const game = cloneDeep(state);
  const { bumpkin } = game;

  const building = game.buildings[action.building]?.find(
    (b) => b.id === action.buildingId
  );

  if (!building) {
    throw new Error("Building does not exist");
  }

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const recipe = building.crafting;
  if (!recipe) {
    throw new Error("Building is not cooking anything");
  }

  if (createdAt < recipe.readyAt) {
    throw new Error("Recipe is not ready");
  }

  delete building.crafting;

  const consumableCount = game.inventory[recipe.name] || new Decimal(0);

  bumpkin.activity = trackActivity(
    `${recipe.name} Collected`,
    bumpkin.activity
  );

  return {
    ...game,
    inventory: {
      ...game.inventory,
      [recipe.name]: consumableCount.add(1),
    },
  };
}
