import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum REMOVE_CHICKEN_ERRORS {
  INVALID_CHICKEN = "This chicken does not exist",
  CHICKEN_BREWING_EGG = "This chicken is brewing an egg",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
}

export type RemoveChickenAction = {
  type: "chicken.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveChickenAction;
};

export function removeChicken({ state, action }: Options) {
  const stateCopy = cloneDeep(state) as GameState;

  const { chickens, inventory, bumpkin } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!chickens[action.id]) {
    throw new Error(REMOVE_CHICKEN_ERRORS.INVALID_CHICKEN);
  }

  if (chickens[action.id].fedAt) {
    throw new Error(REMOVE_CHICKEN_ERRORS.CHICKEN_BREWING_EGG);
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_CHICKEN_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  }

  delete chickens[action.id];

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
