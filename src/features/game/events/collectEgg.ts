import Decimal from "decimal.js-light";
import { CHICKEN_TIME_TO_EGG } from "../lib/constants";
import { Chicken, GameState } from "../types/game";

export type CollectAction = {
  type: "chicken.collectEgg";
  index: number;
};

type Options = {
  state: GameState;
  action: CollectAction;
  createdAt?: number;
};

export function eggIsReady(chicken: Chicken, createdAt: number) {
  return createdAt - chicken.fedAt >= CHICKEN_TIME_TO_EGG;
}

export function collectEggs({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const chickens = state.chickens || {};
  const chicken = chickens[action.index];

  if (!chicken) {
    throw new Error("This chicken does not exist");
  }

  if (!eggIsReady(chicken, createdAt)) {
    throw new Error("This chicken hasn't layed an egg");
  }

  const mutantChicken = chicken.reward?.items[0];

  delete chickens[action.index];

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Egg: (state.inventory.Egg || new Decimal(0))?.add(1 * chicken.multiplier),
      ...(mutantChicken && {
        [mutantChicken.name]: (
          state.inventory[mutantChicken.name] || new Decimal(0)
        )?.add(mutantChicken.amount),
      }),
    },
    chickens,
  };
}
