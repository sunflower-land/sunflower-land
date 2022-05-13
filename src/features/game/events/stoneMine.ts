import Decimal from "decimal.js-light";
import { GameState, Rock, Inventory } from "../types/game";

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

type GetMinedAtAtgs = {
  inventory: Inventory;
  createdAt: number;
};

/**
 * Set a mined in the past to make it replenish faster
 */
function getMinedAt({ inventory, createdAt }: GetMinedAtAtgs): number {
  if (inventory["Amateur Mole"]?.gte(1) || inventory["Master Mole"]?.gte(1)) {
    return createdAt - (STONE_RECOVERY_TIME / 2) * 1000;
  }

  return createdAt;
}

/**
 * Returns the amount of pickaxes required to mine down a stone
 */
export function getRequiredPickAxesAmount(inventory: Inventory) {
  if (inventory["Master Mole"]) {
    return new Decimal(0);
  }

  return new Decimal(1);
}

export function mineStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const requiredPickAxes = getRequiredPickAxesAmount(state.inventory);
  const rock = state.stones[action.index];

  if (!rock) {
    throw new Error(MINE_ERRORS.NO_ROCK);
  }

  if (!canMine(rock, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_GROWING);
  }

  const toolAmount = state.inventory["Pickaxe"] || new Decimal(0);
  if (toolAmount.lessThan(requiredPickAxes)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const amount = state.inventory.Stone || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Pickaxe: toolAmount.sub(requiredPickAxes),
      Stone: amount.add(rock.amount),
    },
    stones: {
      ...state.stones,
      [action.index]: {
        minedAt: getMinedAt({ createdAt, inventory: state.inventory }),
        // Placeholder, RNG happens off chain
        amount: new Decimal(2),
      },
    },
  };
}
