import Decimal from "decimal.js-light";
import { CHICKEN_FEEDING_TIME } from "../lib/constants";
import { GameState } from "../types/game";

export type FeedAction = {
  type: "chicken.feed";
  index: number;
};

type Options = {
  state: GameState;
  action: FeedAction;
  createdAt?: number;
};

export function feedChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (!state.inventory?.Chicken || state.inventory.Chicken?.lt(action.index)) {
    throw new Error("This chicken does not exist");
  }

  if (action.index > 9) {
    throw new Error("Cannot have more than 10 chickens");
  }

  const chickens = state.chickens || {};

  if (chickens[action.index]) {
    console.log({ fedAt: chickens[action.index].fedAt, createdAt });
  }
  if (
    chickens[action.index] &&
    createdAt - chickens[action.index].fedAt < CHICKEN_FEEDING_TIME
  ) {
    throw new Error("This chicken is not hungry");
  }

  if (!state.inventory.Wheat || state.inventory.Wheat.lt(1)) {
    throw new Error("No wheat to feed chickens");
  }

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Wheat: state.inventory.Wheat.minus(new Decimal(1)),
    },
    chickens: {
      ...chickens,
      [action.index]: {
        fedAt: Date.now(),
        multiplier: 1,
      },
    },
  };
}
