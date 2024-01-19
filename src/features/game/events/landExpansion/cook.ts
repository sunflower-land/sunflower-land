import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { CookableName, COOKABLES } from "features/game/types/consumables";
import { Bumpkin, GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { getCookingTime } from "features/game/expansion/lib/boosts";
import { translate } from "lib/i18n/translate";

export type RecipeCookedAction = {
  type: "recipe.cooked";
  item: CookableName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RecipeCookedAction;
  createdAt?: number;
};

type GetReadyAtArgs = {
  item: CookableName;
  bumpkin: Bumpkin;
  createdAt: number;
  game: GameState;
};

export const getReadyAt = ({
  item,
  bumpkin,
  createdAt,
  game,
}: GetReadyAtArgs) => {
  const seconds = getCookingTime(COOKABLES[item].cookingSeconds, bumpkin, game);

  return createdAt + seconds * 1000;
};

export function cook({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy: GameState = cloneDeep(state);

  const { building: requiredBuilding, ingredients } = COOKABLES[action.item];
  const { buildings, bumpkin } = stateCopy;
  const buildingsOfRequiredType = buildings[requiredBuilding];

  if (!Object.keys(buildings).length || !buildingsOfRequiredType) {
    throw new Error(translate("error.requiredBuildingNotExist"));
  }

  const building = buildingsOfRequiredType.find(
    (building) => building.id === action.buildingId
  );

  if (bumpkin === undefined) {
    throw new Error(translate("harvestflower.noBumpkin"));
  }

  if (!building) {
    throw new Error(translate("error.requiredBuildingNotExist"));
  }

  if (building.crafting !== undefined) {
    throw new Error(translate("error.cookingInProgress"));
  }

  // const stockAmount = stateCopy.stock[action.item] || new Decimal(0);

  // if (stockAmount.lessThan(1)) {
  //   throw new Error("Not enough stock");
  // }

  stateCopy.inventory = getKeys(ingredients).reduce((inventory, ingredient) => {
    const count = inventory[ingredient] || new Decimal(0);
    const amount = ingredients[ingredient] || new Decimal(0);

    if (count.lessThan(amount)) {
      throw new Error(`Insufficient ingredient: ${ingredient}`);
    }

    return {
      ...inventory,
      [ingredient]: count.sub(amount),
    };
  }, stateCopy.inventory);

  building.crafting = {
    name: action.item,
    readyAt: getReadyAt({
      item: action.item,
      bumpkin,
      createdAt,
      game: stateCopy,
    }),
  };

  // stateCopy.stock[action.item] = stockAmount.minus(new Decimal(1));

  return stateCopy;
}
