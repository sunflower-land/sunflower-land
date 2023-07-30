import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  CHICKEN_TIME_TO_EGG,
  MUTANT_CHICKEN_BOOST_AMOUNT,
} from "features/game/lib/constants";
import {
  Bumpkin,
  Collectibles,
  GameState,
  Inventory,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type LandExpansionFeedChickenAction = {
  type: "chicken.fed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionFeedChickenAction;
  createdAt?: number;
};

const makeFedAt = (
  inventory: Inventory,
  collectibles: Collectibles,
  createdAt: number,
  bumpkin: Bumpkin
) => {
  const { skills } = bumpkin;
  let milliseconds = CHICKEN_TIME_TO_EGG;

  if (inventory["Wrangler"]?.gt(0)) {
    milliseconds *= 0.9;
  }

  if (isCollectibleBuilt("Speed Chicken", collectibles)) {
    milliseconds *= 0.9;
  }

  if (skills["Stable Hand"]) {
    milliseconds *= 0.9;
  }

  if (isCollectibleBuilt("El Pollo Veloz", collectibles)) {
    milliseconds -= 1000 * 60 * 60 * 4;
  }

  //Return default values if no boost applied

  const chickenTime = CHICKEN_TIME_TO_EGG - milliseconds;
  return createdAt - chickenTime;
};

export const getWheatRequiredToFeed = (collectibles: Collectibles) => {
  if (isCollectibleBuilt("Gold Egg", collectibles)) {
    return new Decimal(0);
  }

  const defaultAmount = new Decimal(1);

  if (isCollectibleBuilt("Fat Chicken", collectibles)) {
    return defaultAmount.minus(defaultAmount.mul(MUTANT_CHICKEN_BOOST_AMOUNT));
  }

  return defaultAmount;
};

export function feedChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin, inventory, collectibles } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const chickens = stateCopy.chickens || {};
  const chicken = chickens[action.id];

  if (!chicken) {
    throw new Error("This chicken does not exist");
  }

  const isChickenHungry =
    chicken?.fedAt && createdAt - chicken.fedAt < CHICKEN_TIME_TO_EGG;

  if (isChickenHungry) {
    throw new Error("This chicken is not hungry");
  }

  const wheatRequired = getWheatRequiredToFeed(collectibles);

  if (
    wheatRequired.gt(0) &&
    (!inventory.Wheat || inventory.Wheat.lt(wheatRequired))
  ) {
    throw new Error("No wheat to feed chickens");
  }

  const currentWheat = inventory.Wheat || new Decimal(0);
  inventory.Wheat = currentWheat.minus(wheatRequired);
  chickens[action.id] = {
    ...chickens[action.id],
    fedAt: makeFedAt(inventory, collectibles, createdAt, bumpkin),
    multiplier: 1,
  };

  return stateCopy;
}
