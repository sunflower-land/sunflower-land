import Decimal from "decimal.js-light";
import { GameState, InventoryItemName, Tree } from "../types/game";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe selected",
  NO_AXES = "No axes left",
  STILL_GROWING = "Tree is still growing",
}

// 1 hour
export const TREE_RECOVERY_SECONDS = 5;

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.choppedAt > TREE_RECOVERY_SECONDS * 1000;
}

export type ChopAction = {
  type: "tree.chopped";
  index: number;
  item: InventoryItemName;
};

type Options = {
  state: GameState;
  action: ChopAction;
  createdAt?: number;
};

export function chop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (action.item !== "Axe") {
    throw new Error(CHOP_ERRORS.MISSING_AXE);
  }

  const axeAmount = state.inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(1)) {
    throw new Error(CHOP_ERRORS.NO_AXES);
  }

  const tree = state.trees[action.index];
  console.log({ tree, createdAt });
  if (!canChop(tree, createdAt)) {
    throw new Error(CHOP_ERRORS.STILL_GROWING);
  }

  const woodAmount = state.inventory.Wood || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Axe: axeAmount.sub(1),
      Wood: woodAmount.add(tree.wood),
    },
    trees: {
      ...state.trees,
      [action.index]: {
        choppedAt: Date.now(),
        /**
         *  A pseudo random number to keep players engaged with variable rewards
         *  Cycles between 3-5 rewards
         */
        wood: new Decimal(Math.max(tree.wood.add(1).toNumber() % 6, 3)),
      },
    },
  };
}
