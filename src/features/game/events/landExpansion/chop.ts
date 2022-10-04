import Decimal from "decimal.js-light";
import { CHOP_STAMINA_COST } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BumpkinSkillName } from "features/game/types/bumpkinSkills";
import {
  GameState,
  Inventory,
  InventoryItemName,
  LandExpansionTree,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { replenishStamina } from "./replenishStamina";

type GetChoppedAtArgs = {
  inventory: Inventory;
  skills: Partial<Record<BumpkinSkillName, number>>;
  createdAt: number;
};

export type LandExpansionChopAction = {
  type: "timber.chopped";
  index: number;
  expansionIndex: number;
  item: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionChopAction;
  createdAt?: number;
};

const TREE_RECOVERY_SECONDS = 2 * 60 * 60;

export function canChop(tree: LandExpansionTree, now: number = Date.now()) {
  return now - tree.wood.choppedAt > TREE_RECOVERY_SECONDS * 1000;
}

/**
 * Set a chopped in the past to make it replenish faster
 */
export function getChoppedAt({
  inventory,
  skills,
  createdAt,
}: GetChoppedAtArgs): number {
  if (
    inventory["Apprentice Beaver"]?.gte(1) ||
    inventory["Foreman Beaver"]?.gte(1)
  ) {
    return createdAt - (TREE_RECOVERY_SECONDS / 2) * 1000;
  }

  if (skills["Tree Hugger"]) {
    return createdAt - (TREE_RECOVERY_SECONDS - 0.2) * 1000;
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

  return new Decimal(1);
}

export function chop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const replenishedState = replenishStamina({
    state,
    action: { type: "bumpkin.replenishStamina" },
    createdAt,
  });

  const stateCopy = cloneDeep(replenishedState);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  const { trees } = expansion;

  if (!trees) {
    throw new Error("Expansion has no trees");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.stamina.value < CHOP_STAMINA_COST) {
    throw new Error("You do not have enough stamina");
  }

  const requiredAxes = getRequiredAxeAmount(stateCopy.inventory);

  if (action.item !== "Axe" && requiredAxes.gt(0)) {
    throw new Error("No axe");
  }

  const axeAmount = stateCopy.inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(requiredAxes)) {
    throw new Error("No axes left");
  }

  const tree = trees[action.index];

  if (!tree) {
    throw new Error("No tree");
  }

  if (!canChop(tree, createdAt)) {
    throw new Error("Tree is still growing");
  }

  const woodHarvested = tree.wood.amount;
  const woodAmount = stateCopy.inventory.Wood || new Decimal(0);

  tree.wood = {
    choppedAt: getChoppedAt({
      createdAt,
      inventory: stateCopy.inventory,
      skills: bumpkin.skills,
    }),
    // Amount for next drop
    amount: 3,
  };
  stateCopy.inventory.Axe = axeAmount.sub(requiredAxes);
  stateCopy.inventory.Wood = woodAmount.add(woodHarvested);

  bumpkin.stamina.value -= CHOP_STAMINA_COST;

  bumpkin.activity = trackActivity("Tree Chopped", bumpkin.activity);

  return stateCopy;
}
