import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BumpkinSkillName } from "features/game/types/bumpkinSkills";
import {
  Collectibles,
  GameState,
  Inventory,
  InventoryItemName,
  Tree,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
  NO_TREE = "No tree",
  STILL_GROWING = "Tree is still growing",
}

type GetChoppedAtArgs = {
  skills: Partial<Record<BumpkinSkillName, number>>;
  collectibles: Collectibles;
  createdAt: number;
};

export type LandExpansionChopAction = {
  type: "timber.chopped";
  index: string;
  item: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionChopAction;
  createdAt?: number;
};

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.wood.choppedAt > TREE_RECOVERY_TIME * 1000;
}

/**
 * Set a chopped in the past to make it replenish faster
 */
export function getChoppedAt({
  collectibles,
  skills,
  createdAt,
}: GetChoppedAtArgs): number {
  let time = createdAt;
  if (
    isCollectibleBuilt("Apprentice Beaver", collectibles) ||
    isCollectibleBuilt("Foreman Beaver", collectibles)
  ) {
    time = time - (TREE_RECOVERY_TIME / 2) * 1000;
  }

  if (skills["Tree Hugger"]) {
    time = time - TREE_RECOVERY_TIME * 0.2 * 1000;
  }

  return time;
}

/**
 * Returns the amount of axe required to chop down a tree
 */
export function getRequiredAxeAmount(
  inventory: Inventory,
  collectibles: Collectibles
) {
  if (isCollectibleBuilt("Foreman Beaver", collectibles)) {
    return new Decimal(0);
  }

  if (inventory.Logger?.gte(1)) {
    return new Decimal(0.5);
  }

  return new Decimal(1);
}

export function chop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { trees, bumpkin, collectibles, inventory } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const requiredAxes = getRequiredAxeAmount(state.inventory, collectibles);

  const axeAmount = inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(requiredAxes)) {
    throw new Error(CHOP_ERRORS.NO_AXES);
  }

  const tree = trees[action.index];

  if (!tree) {
    throw new Error(CHOP_ERRORS.NO_TREE);
  }

  if (!canChop(tree, createdAt)) {
    throw new Error(CHOP_ERRORS.STILL_GROWING);
  }

  const woodHarvested = tree.wood.amount;
  const woodAmount = inventory.Wood || new Decimal(0);

  tree.wood = {
    choppedAt: getChoppedAt({
      createdAt,
      skills: bumpkin.skills,
      collectibles,
    }),
    // Placeholder amount for next drop. This will get overridden on the next autosave.
    amount: 1,
  };
  inventory.Axe = axeAmount.sub(requiredAxes);
  inventory.Wood = woodAmount.add(woodHarvested);

  bumpkin.activity = trackActivity("Tree Chopped", bumpkin.activity);

  return stateCopy;
}
