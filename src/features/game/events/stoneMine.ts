import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { STONE_RECOVERY_TIME } from "../lib/constants";
import { GameState, Rock } from "../types/game";

export type StoneMineAction = {
  type: "stone.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: StoneMineAction;
  createdAt?: number;
};

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
  const stateCopy = cloneDeep(state);
  const rock = stateCopy.stones[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = stateCopy.inventory["Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = stateCopy.inventory.Stone || new Decimal(0);

  return {
    ...stateCopy,
    inventory: {
      ...stateCopy.inventory,
      Pickaxe: toolAmount.sub(1),
      Stone: amount.add(rock.amount),
    },
    stones: {
      ...stateCopy.stones,
      [action.index]: {
        minedAt: Date.now(),
        // Placeholder, RNG happens off chain
        amount: new Decimal(2),
      },
    },
  };
}
