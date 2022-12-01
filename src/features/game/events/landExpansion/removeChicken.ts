import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { getKeys } from "features/game/types/craftables";

export enum REMOVE_CHICKEN_ERRORS {
  INVALID_CHICKEN = "This chicken does not exist",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
}

export type RemoveChickenAction = {
  type: "chicken.removed";
  chickenIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveChickenAction;
  createdAt?: number;
};

export function removeChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state) as GameState;

  const { chickens, inventory, bumpkin } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!chickens[action.chickenIndex]) {
    throw new Error(REMOVE_CHICKEN_ERRORS.INVALID_CHICKEN);
  }

  if (action.chickenIndex === -1) {
    throw new Error(REMOVE_CHICKEN_ERRORS.INVALID_CHICKEN);
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_CHICKEN_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  }

  const chickenKeys = getKeys(chickens);
  const lastChickenIndex = chickenKeys.pop() || 0;
  chickens[action.chickenIndex] = {
    ...chickens[lastChickenIndex],
  };
  delete chickens[lastChickenIndex];

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
