import Decimal from "decimal.js-light";
import { CHICKEN_FEEDING_TIME } from "../lib/constants";
import { Chicken, GameState } from "../types/game";

export type CollectAction = {
  type: "chicken.collectEgg";
  index: number;
};

export const getSecondsToEgg = (fedAt: number) => {
  const timePassedSinceFed = Date.now() - fedAt;

  if (timePassedSinceFed >= CHICKEN_FEEDING_TIME) return 0;

  return Math.ceil((CHICKEN_FEEDING_TIME - timePassedSinceFed) / 1000);
};

type Options = {
  state: GameState;
  action: CollectAction;
  createdAt?: number;
};

export function eggIsReady(chicken: Chicken) {
  return Date.now() - chicken.fedAt > CHICKEN_FEEDING_TIME;
}

// export const FEEDING_TIME = 1000 * 60 * 60 * 24 * 2; // 48 hours
// 48 hours

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
