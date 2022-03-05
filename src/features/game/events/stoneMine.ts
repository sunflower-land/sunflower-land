import Decimal from "decimal.js-light";
import { GameState, Rock } from "../types/game";

export type StoneMineAction = {
  type: "stone.mined";
  index: number;
};

type Options = {
  state: GameState;
  action: StoneMineAction;
  createdAt?: number;
};

// 4 hours
export const STONE_RECOVERY_TIME = 4 * 60 * 60;

export enum MINE_ERRORS {
  NO_PICKAXES = "No pickaxes left",
  NO_ROCK = "No rock",
  STILL_GROWING = "Rock is still recovering",
}

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = STONE_RECOVERY_TIME;
  return now - rock.minedAt > recoveryTime * 1000;
}

export function mineStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const rock = state.stones[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = state.inventory["Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = state.inventory.Stone || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Pickaxe: toolAmount.sub(1),
      Stone: amount.add(rock.amount),
    },
    stones: {
      ...state.stones,
      [action.index]: {
        minedAt: Date.now(),
        // Placeholder, RNG happens off chain
        amount: new Decimal(2),
      },
    },
  };
}
