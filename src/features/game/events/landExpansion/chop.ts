import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { CHOP_STAMINA_COST } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BumpkinSkillName } from "features/game/types/bumpkinSkills";
import {
  Collectibles,
  GameState,
  InventoryItemName,
  LandExpansionTree,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { replenishStamina } from "./replenishStamina";

type GetChoppedAtArgs = {
  skills: Partial<Record<BumpkinSkillName, number>>;
  collectibles: Collectibles;
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
  collectibles,
  skills,
  createdAt,
}: GetChoppedAtArgs): number {
  if (
    isCollectibleBuilt("Apprentice Beaver", collectibles) ||
    isCollectibleBuilt("Foreman Beaver", collectibles)
  ) {
    return createdAt - (TREE_RECOVERY_SECONDS / 2) * 1000;
  }

  if (skills["Tree Hugger"]) {
    return createdAt - TREE_RECOVERY_SECONDS * 0.8 * 1000;
  }

  return createdAt;
}

/**
 * Returns the amount of axe required to chop down a tree
 */
export function getRequiredAxeAmount(collectibles: Collectibles) {
  if (isCollectibleBuilt("Foreman Beaver", collectibles)) {
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
  const { expansions, bumpkin, collectibles, inventory } = stateCopy;
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

  const requiredAxes = getRequiredAxeAmount(collectibles);

  if (action.item !== "Axe" && requiredAxes.gt(0)) {
    throw new Error("No axe");
  }

  const axeAmount = inventory.Axe || new Decimal(0);
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
  const woodAmount = inventory.Wood || new Decimal(0);

  tree.wood = {
    choppedAt: getChoppedAt({
      createdAt,
      skills: bumpkin.skills,
      collectibles,
    }),
    // Amount for next drop
    amount: 3,
  };
  inventory.Axe = axeAmount.sub(requiredAxes);
  inventory.Wood = woodAmount.add(woodHarvested);

  bumpkin.stamina.value -= CHOP_STAMINA_COST;

  bumpkin.activity = trackActivity("Tree Chopped", bumpkin.activity);

  return stateCopy;
}
