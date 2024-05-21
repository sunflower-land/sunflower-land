import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";

export type OilGreenhouseAction = {
  type: "greenhouse.oiled";
  amount: number;
};

export const MAX_GREENHOUSE_OIL = 100;

type Options = {
  state: Readonly<GameState>;
  action: OilGreenhouseAction;
  createdAt?: number;
};

export function oilGreenhouse({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  const oil = game.inventory.Oil ?? new Decimal(0);

  if (oil.lt(action.amount)) {
    throw new Error("Missing oil");
  }

  if (!Number.isInteger(action.amount) || action.amount <= 0) {
    throw new Error("Incorrect amount");
  }

  const totalOil = game.greenhouse.oil + action.amount;

  if (totalOil > MAX_GREENHOUSE_OIL) {
    throw new Error("Greenhouse is full");
  }

  game.inventory.Oil = oil.sub(action.amount);
  game.greenhouse.oil = totalOil;

  return game;
}
