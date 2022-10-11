import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { IRON_RECOVERY_TIME } from "../lib/constants";
import { GameState, Rock } from "../types/game";

export type IronMineAction = {
  type: "iron.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: IronMineAction;
  createdAt?: number;
};

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
  const stateCopy = cloneDeep(state);
  const rock = stateCopy.iron[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = stateCopy.inventory["Stone Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = stateCopy.inventory.Iron || new Decimal(0);

  return {
    ...stateCopy,
    inventory: {
      ...stateCopy.inventory,
      "Stone Pickaxe": toolAmount.sub(1),
      Iron: amount.add(rock.amount),
    },
    iron: {
      ...stateCopy.iron,
      [action.index]: {
        minedAt: Date.now(),
        // Placeholder, server does randomization
        amount: new Decimal(2),
      },
    },
  };
}
