import Decimal from "decimal.js-light";
import { GameState, Rock } from "../types/game";

export type IronMineAction = {
  type: "iron.mined";
  index: number;
};

type Options = {
  state: GameState;
  action: IronMineAction;
  createdAt?: number;
};

// 12 hours
export const IRON_RECOVERY_TIME = 12 * 60 * 60;

export enum MINE_ERRORS {
  NO_PICKAXES = "No pickaxes left",
  NO_ROCK = "No rock",
  STILL_GROWING = "Rock is still recovering",
}

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = IRON_RECOVERY_TIME;
  return now - rock.minedAt > recoveryTime * 1000;
}

export function mineIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const rock = state.iron[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = state.inventory["Stone Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = state.inventory.Iron || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      "Stone Pickaxe": toolAmount.sub(1),
      Iron: amount.add(rock.amount),
    },
    iron: {
      ...state.iron,
      [action.index]: {
        minedAt: Date.now(),
        // Placeholder, server does randomization
        amount: new Decimal(2),
      },
    },
  };
}
