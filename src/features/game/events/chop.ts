import Decimal from "decimal.js-light";
import { GameState, Inventory, InventoryItemName, Tree } from "../types/game";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
  NO_TREE = "No tree",
  STILL_GROWING = "Tree is still growing",
}

// 2 hours
export const TREE_RECOVERY_SECONDS = 2 * 60 * 60;

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.choppedAt > TREE_RECOVERY_SECONDS * 1000;
}

type GetChoppedAtAtgs = {
  inventory: Inventory;
  createdAt: number;
};

/**
 * Set a chopped in the past to make it replenish faster
 */
function getChoppedAt({ inventory, createdAt }: GetChoppedAtAtgs): number {
  if (
    inventory["Apprentice Beaver"]?.gte(1) ||
    inventory["Foreman Beaver"]?.gte(1)
  ) {
    return createdAt - (TREE_RECOVERY_SECONDS / 2) * 1000;
  }

  return createdAt;
}

/**
 * Returns the amount of axe required to chop down a tree
 */
export function getRequiredAxeAmount(inventory: Inventory) {
  if (inventory["Foreman Beaver"]) {
    return new Decimal(0);
  }

  if (inventory.Logger) {
    return new Decimal(0.5);
  }

  return new Decimal(1);
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
  const requiredAxes = getRequiredAxeAmount(state.inventory);
  if (action.item !== "Axe" && requiredAxes.gt(0)) {
    throw new Error(CHOP_ERRORS.MISSING_AXE);
  }

  const axeAmount = state.inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(requiredAxes)) {
    throw new Error(CHOP_ERRORS.NO_AXES);
  }

  const tree = state.trees[action.index];

  if (!tree) {
    throw new Error(CHOP_ERRORS.NO_TREE);
  }

  if (!canChop(tree, createdAt)) {
    throw new Error(CHOP_ERRORS.STILL_GROWING);
  }

  const woodAmount = state.inventory.Wood || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Axe: axeAmount.sub(requiredAxes),
      Wood: woodAmount.add(tree.wood),
    },
    trees: {
      ...state.trees,
      [action.index]: {
        choppedAt: getChoppedAt({ createdAt, inventory: state.inventory }),
        // Placeholder, random numbers generated on server side
        wood: new Decimal(3),
      },
    },
  };
}
