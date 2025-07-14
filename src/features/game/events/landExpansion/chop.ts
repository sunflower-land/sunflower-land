import Decimal from "decimal.js-light";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  BumpkinRevampSkillName,
  BumpkinSkillName,
} from "features/game/types/bumpkinSkills";
import {
  CriticalHitName,
  GameState,
  Inventory,
  InventoryItemName,
  Tree,
} from "features/game/types/game";
import { produce } from "immer";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
  NO_TREE = "No tree",
  STILL_GROWING = "Tree is still growing",
}

type GetChoppedAtArgs = {
  skills: Partial<
    Record<BumpkinSkillName, number> & Record<BumpkinRevampSkillName, number>
  >;
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

export function getWoodDropAmount({
  criticalDropGenerator = () => false,
  game,
}: {
  game: GameState;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
}) {
  const { bumpkin, inventory } = game;
  let amount = new Decimal(1);

  const hasBeaverReady =
    isCollectibleBuilt({ name: "Woody the Beaver", game }) ||
    isCollectibleBuilt({ name: "Apprentice Beaver", game }) ||
    isCollectibleBuilt({ name: "Foreman Beaver", game });

  if (hasBeaverReady) {
    amount = amount.mul(1.2);
  }

  if (inventory["Discord Mod"]) {
    amount = amount.mul(1.35);
  }

  if (inventory.Lumberjack) {
    amount = amount.mul(1.1);
  }

  if (bumpkin.skills["Tough Tree"] && criticalDropGenerator("Tough Tree")) {
    amount = amount.mul(3);
  }

  if (bumpkin.skills["Lumberjack's Extra"]) {
    amount = amount.add(0.1);
  }

  if (isCollectibleBuilt({ name: "Wood Nymph Wendy", game })) {
    amount = amount.add(0.2);
  }

  //If Tiki Totem: bonus 0.1
  if (isCollectibleBuilt({ name: "Tiki Totem", game })) {
    amount = amount.add(0.1);
  }

  if (isCollectibleBuilt({ name: "Squirrel", game })) {
    amount = amount.add(0.1);
  }

  // Apply the faction shield boost if in the right faction
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({
      game,
      name: FACTION_ITEMS[factionName].secondaryTool,
    })
  ) {
    amount = amount.add(0.25);
  }

  // Native 1 in 5 chance of getting 1 extra wood
  if (criticalDropGenerator("Native")) {
    amount = amount.add(1);
  }

  amount = amount.add(getBudYieldBoosts(game.buds ?? {}, "Wood"));

  return amount.toDecimalPlaces(4);
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

  // 10% faster
  if (skills["Tree Charge"]) {
    totalSeconds = totalSeconds * 0.9;
  }

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
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
  gameState: GameState,
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
  return produce(state, (stateCopy) => {
    const { trees, bumpkin, inventory } = stateCopy;

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

    const woodHarvested = getWoodDropAmount({
      game: stateCopy,
      criticalDropGenerator: (name) => tree.wood.criticalHit?.[name] ?? false,
    }).toNumber();
    const woodAmount = inventory.Wood || new Decimal(0);

    tree.wood = {
      choppedAt: getChoppedAt({
        createdAt,
        skills: bumpkin.skills,
        game: stateCopy,
      }),
    };
    inventory.Axe = axeAmount.sub(requiredAxes);
    inventory.Wood = woodAmount.add(woodHarvested);

    bumpkin.activity = trackActivity("Tree Chopped", bumpkin.activity);

    return stateCopy;
  });
}
