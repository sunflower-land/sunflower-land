import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GOLD_RECOVERY_TIME } from "../lib/constants";
import { GameState, Rock } from "../types/game";

export type GoldMineAction = {
  type: "gold.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: GoldMineAction;
  createdAt?: number;
};

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
  const stateCopy = cloneDeep(state);
  const rock = stateCopy.gold[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = stateCopy.inventory["Iron Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = stateCopy.inventory.Gold || new Decimal(0);

  return {
    ...stateCopy,
    inventory: {
      ...stateCopy.inventory,
      "Iron Pickaxe": toolAmount.sub(1),
      Gold: amount.add(rock.amount),
    },
    gold: {
      ...stateCopy.gold,
      [action.index]: {
        minedAt: Date.now(),
        // Placeholder, server does randomization
        amount: new Decimal(2),
      },
    },
  };
}
