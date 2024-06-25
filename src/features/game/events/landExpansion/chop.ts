import Decimal from "decimal.js-light";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BumpkinSkillName } from "features/game/types/bumpkinSkills";
import {
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
  game: GameState;
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
  game,
  skills,
  createdAt,
}: GetChoppedAtArgs): number {
  const hasBeaverReady =
    isCollectibleBuilt({ name: "Apprentice Beaver", game }) ||
    isCollectibleBuilt({ name: "Foreman Beaver", game });

  let totalSeconds = TREE_RECOVERY_TIME;

  if (hasBeaverReady) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (skills["Tree Hugger"]) {
    totalSeconds = totalSeconds * 0.8;
  }

  if (isCollectibleActive({ name: "Time Warp Totem", game })) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (isCollectibleActive({ name: "Timber Hourglass", game })) {
    totalSeconds = totalSeconds * 0.75;
  }

  const buff = TREE_RECOVERY_TIME - totalSeconds;

  return createdAt - buff * 1000;
}

/**
 * Returns the amount of axe required to chop down a tree
 */
export function getRequiredAxeAmount(
  inventory: Inventory,
  gameState: GameState
) {
  if (isCollectibleBuilt({ name: "Foreman Beaver", game: gameState })) {
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
    throw new Error("You do not have a Bumpkin!");
  }

  const requiredAxes = getRequiredAxeAmount(state.inventory, state);

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
      game: stateCopy,
    }),
    // Placeholder amount for next drop. This will get overridden on the next autosave.
    amount: 1,
  };
  inventory.Axe = axeAmount.sub(requiredAxes);
  inventory.Wood = woodAmount.add(woodHarvested);

  bumpkin.activity = trackActivity("Tree Chopped", bumpkin.activity);

  return stateCopy;
}
