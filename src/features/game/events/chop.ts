import Decimal from "decimal.js-light";
import { GameState, InventoryItemName, Tree } from "../types/game";

// 1 hour
const RECOVERY_MS = 60 * 60 * 1000;

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.choppedAt > RECOVERY_MS;
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
    throw new Error("You need an axe!");
  }

  const axeAmount = state.inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(1)) {
    throw new Error("No axes left!");
  }

  const tree = state.trees[action.index];
  if (!canChop(tree, createdAt)) {
    throw new Error("Tree is still growing!");
  }

  const woodAmount = state.inventory.Wood || new Decimal(0);
  return {
    ...state,
    inventory: {
      ...state.inventory,
      Axe: axeAmount.sub(1),
      Wood: woodAmount.add(1),
    },
    trees: {
      ...state.trees,
      [action.index]: {
        choppedAt: Date.now(),
        wood: 0,
      },
    },
  };
}
