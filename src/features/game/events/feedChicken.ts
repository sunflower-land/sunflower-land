import Decimal from "decimal.js-light";
import {
  CHICKEN_TIME_TO_EGG,
  MUTANT_CHICKEN_BOOST_AMOUNT,
} from "../lib/constants";
import { GameState, Inventory } from "../types/game";

export type FeedAction = {
  type: "chicken.feed";
  index: number;
};

type Options = {
  state: GameState;
  action: FeedAction;
  createdAt?: number;
};

const makeFedAt = (inventory: Inventory, createdAt: number) => {
  if (inventory["Wrangler"]?.gt(0) && inventory["Speed Chicken"]?.gt(0)) {
    return (
      createdAt - CHICKEN_TIME_TO_EGG * (0.1 + MUTANT_CHICKEN_BOOST_AMOUNT)
    );
  }

  if (inventory["Wrangler"]?.gt(0)) {
    return createdAt - CHICKEN_TIME_TO_EGG * 0.1;
  }

  if (inventory["Speed Chicken"]?.gt(0)) {
    return createdAt - CHICKEN_TIME_TO_EGG * MUTANT_CHICKEN_BOOST_AMOUNT;
  }

  return createdAt;
};

export const getWheatRequiredToFeed = (inventory: Inventory) => {
  const hasFatChicken = inventory["Fat Chicken"]?.gt(0);
  const defaultAmount = new Decimal(1);

  if (hasFatChicken) {
    return defaultAmount.minus(defaultAmount.mul(MUTANT_CHICKEN_BOOST_AMOUNT));
  }

  return defaultAmount;
};

export function getMaxChickens(inventory: Inventory) {
  if (inventory["Chicken Coop"]) {
    return 15;
  }

  return 10;
}

export function feedChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const maxChickens = getMaxChickens(state.inventory);

  if (!state.inventory?.Chicken || state.inventory.Chicken?.lt(action.index)) {
    throw new Error("This chicken does not exist");
  }

  if (action.index > maxChickens - 1) {
    throw new Error("Cannot have more than 15 chickens");
  }

  const chickens = state.chickens || {};

  if (chickens[action.index]) {
    console.log({ fedAt: chickens[action.index].fedAt, createdAt });
  }

  if (
    chickens[action.index] &&
    createdAt - chickens[action.index].fedAt < CHICKEN_TIME_TO_EGG
  ) {
    throw new Error("This chicken is not hungry");
  }

  const wheatRequired = getWheatRequiredToFeed(state.inventory);

  if (!state.inventory.Wheat || state.inventory.Wheat.lt(wheatRequired)) {
    throw new Error("No wheat to feed chickens");
  }

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Wheat: state.inventory.Wheat.minus(wheatRequired),
    },
    chickens: {
      ...chickens,
      [action.index]: {
        fedAt: makeFedAt(state.inventory, createdAt),
        multiplier: 1,
      },
    },
  };
}
