import Decimal from "decimal.js-light";
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

export function eggIsReady(chicken: Chicken) {
  return Date.now() - chicken.fedAt > FEEDING_TIME;
}

export const FEEDING_TIME = 1000 * 60 * 60 * 24 * 2; // 48 hours

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

  if (!eggIsReady(chicken)) {
    throw new Error("This chicken hasn't layed an egg");
  }

  delete chickens[action.index];

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Egg: (state.inventory.Egg || new Decimal(0))?.add(1),
    },
    chickens,
  };
}
