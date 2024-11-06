import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  CHICKEN_TIME_TO_EGG,
  MUTANT_CHICKEN_BOOST_AMOUNT,
} from "features/game/lib/constants";
import { Bumpkin, GameState, Inventory } from "features/game/types/game";
import { produce } from "immer";

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
  gameState: GameState,
  createdAt: number,
  bumpkin: Bumpkin,
) => {
  const { skills } = bumpkin;
  let milliseconds = CHICKEN_TIME_TO_EGG;

  if (inventory["Wrangler"]?.gt(0)) {
    milliseconds *= 0.9;
  }

  if (isCollectibleBuilt({ name: "Speed Chicken", game: gameState })) {
    milliseconds *= 0.9;
  }

  if (skills["Stable Hand"]) {
    milliseconds *= 0.9;
  }

  if (isCollectibleBuilt({ name: "El Pollo Veloz", game: gameState })) {
    milliseconds -= 1000 * 60 * 60 * 4;
  }

  //Return default values if no boost applied

  const chickenTime = CHICKEN_TIME_TO_EGG - milliseconds;
  return createdAt - chickenTime;
};

export const getWheatRequiredToFeed = (game: GameState) => {
  if (isCollectibleBuilt({ name: "Gold Egg", game })) {
    return new Decimal(0);
  }

  const defaultAmount = new Decimal(1);

  if (isCollectibleBuilt({ name: "Fat Chicken", game })) {
    return defaultAmount.minus(defaultAmount.mul(MUTANT_CHICKEN_BOOST_AMOUNT));
  }

  return defaultAmount;
};

export function feedChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    throw new Error("You can no longer feed chickens");
  });
}
