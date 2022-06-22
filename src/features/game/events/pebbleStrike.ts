import Decimal from "decimal.js-light";
import { GameState, Rock } from "../types/game";

export type PebbleStrikeAction = {
  type: "pebble.struck";
  index: number;
};

type Options = {
  state: GameState;
  action: PebbleStrikeAction;
  createdAt?: number;
};

// 30 minutes
export const PEBBLE_RECOVERY_TIME = 30 * 60;

export enum MINE_ERRORS {
  NO_PEBBLE = "No pebble",
  STILL_GROWING = "Pebble is still recovering",
}

export function canMine(pebble: Rock, now: number = Date.now()) {
  const recoveryTime = PEBBLE_RECOVERY_TIME;
  return now - pebble.minedAt > recoveryTime * 1000;
}

export function strikePebble({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const pebble = state.pebble[action.index];

  if (!pebble) {
    throw new Error(MINE_ERRORS.NO_PEBBLE);
  }

  if (!canMine(pebble, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const amount = state.inventory.Stone || new Decimal(0);
  const experience = state.skills?.gathering || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Stone: amount.add(pebble.amount),
    },
    pebble: {
      [action.index]: {
        minedAt: Date.now(),
        amount: new Decimal(0.1),
      },
    },
  };
}
