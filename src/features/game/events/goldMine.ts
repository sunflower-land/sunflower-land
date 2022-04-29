import Decimal from "decimal.js-light";
import { GameState, Rock } from "../types/game";

export type GoldMineAction = {
  type: "gold.mined";
  index: number;
};

type Options = {
  state: GameState;
  action: GoldMineAction;
  createdAt?: number;
};

// 24 hours
export const GOLD_RECOVERY_TIME = 24 * 60 * 60;

export enum MINE_ERRORS {
  NO_PICKAXES = "No pickaxes left",
  NO_ROCK = "No rock",
  STILL_GROWING = "Rock is still recovering",
}

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = GOLD_RECOVERY_TIME;
  return now - rock.minedAt > recoveryTime * 1000;
}

export function mineGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const rock = state.gold[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = state.inventory["Iron Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = state.inventory.Gold || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      "Iron Pickaxe": toolAmount.sub(1),
      Gold: amount.add(rock.amount),
    },
    gold: {
      ...state.gold,
      [action.index]: {
        minedAt: Date.now(),
        // Placeholder, server does randomization
        amount: new Decimal(2),
      },
    },
  };
}
