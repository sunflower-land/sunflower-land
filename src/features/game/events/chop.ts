import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { TREE_RECOVERY_TIME } from "../lib/constants";
import { GameState, Inventory, InventoryItemName, Tree } from "../types/game";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
  NO_TREE = "No tree",
  STILL_GROWING = "Tree is still growing",
}

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.choppedAt > TREE_RECOVERY_TIME * 1000;
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
    return createdAt - (TREE_RECOVERY_TIME / 2) * 1000;
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
  state: Readonly<GameState>;
  action: ChopAction;
  createdAt?: number;
};

export function chop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const requiredAxes = getRequiredAxeAmount(stateCopy.inventory);
  if (action.item !== "Axe" && requiredAxes.gt(0)) {
    throw new Error(CHOP_ERRORS.MISSING_AXE);
  }

  const axeAmount = stateCopy.inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(requiredAxes)) {
    throw new Error(CHOP_ERRORS.NO_AXES);
  }

  const tree = stateCopy.trees[action.index];

  if (!tree) {
    throw new Error(CHOP_ERRORS.NO_TREE);
  }

  if (!canChop(tree, createdAt)) {
    throw new Error(CHOP_ERRORS.STILL_GROWING);
  }

  const woodAmount = stateCopy.inventory.Wood || new Decimal(0);

  return {
    ...stateCopy,
    inventory: {
      ...stateCopy.inventory,
      Axe: axeAmount.sub(requiredAxes),
      Wood: woodAmount.add(tree.wood),
    },
    trees: {
      ...stateCopy.trees,
      [action.index]: {
        ...stateCopy.trees[action.index],
        choppedAt: getChoppedAt({ createdAt, inventory: stateCopy.inventory }),
        // Placeholder, random numbers generated on server side
        wood: new Decimal(3),
      },
    },
  };
}
