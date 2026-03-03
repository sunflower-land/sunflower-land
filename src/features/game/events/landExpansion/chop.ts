import Decimal from "decimal.js-light";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { KNOWN_IDS } from "features/game/types";
import { trackFarmActivity } from "features/game/types/farmActivity";

import {
  BoostName,
  CriticalHitName,
  GameState,
  Inventory,
  InventoryItemName,
  Reward,
  Skills,
  Tree,
} from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";
import { prngChance } from "lib/prng";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
  NO_TREE = "No tree",
  STILL_GROWING = "Tree is still growing",
}

export type PrngArgs = {
  farmId: number;
  itemId: number;
  counter: number;
};

type GetChoppedAtArgs = {
  game: GameState;
  createdAt: number;
  prngArgs?: PrngArgs;
};

export type LandExpansionChopAction = {
  type: "timber.chopped";
  index: string;
  item: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionChopAction;
  farmId: number;
  createdAt?: number;
};

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.wood.choppedAt > TREE_RECOVERY_TIME * 1000;
}

/**
 * Sets the drop amount for the current chop event on the tree
 */
export function getWoodDropAmount({
  game,
  farmId,
  itemId,
  counter,
  tree,
}: {
  game: GameState;
  farmId: number;
  itemId: number;
  counter: number;
  tree: Tree | undefined;
}): { amount: Decimal; boostsUsed: { name: BoostName; value: string }[] } {
  const { bumpkin, inventory } = game;

  const multiplier = tree?.multiplier ?? 1;
  let amount = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const getPrngChance = (chance: number, criticalHitName: CriticalHitName) =>
    prngChance({
      farmId,
      itemId,
      counter,
      chance,
      criticalHitName,
    });

  const hasWoodyTheBeaver = isCollectibleBuilt({
    name: "Woody the Beaver",
    game,
  });
  const hasApprenticeBeaver = isCollectibleBuilt({
    name: "Apprentice Beaver",
    game,
  });
  const hasForemanBeaver = isCollectibleBuilt({
    name: "Foreman Beaver",
    game,
  });

  const hasBeaverReady =
    hasWoodyTheBeaver || hasApprenticeBeaver || hasForemanBeaver;

  if (hasBeaverReady) {
    amount = amount.mul(1.2);
    if (hasForemanBeaver)
      boostsUsed.push({ name: "Foreman Beaver", value: "x1.2" });
    else if (hasApprenticeBeaver)
      boostsUsed.push({ name: "Apprentice Beaver", value: "x1.2" });
    else if (hasWoodyTheBeaver)
      boostsUsed.push({ name: "Woody the Beaver", value: "x1.2" });
  }

  if (inventory["Discord Mod"]) {
    amount = amount.mul(1.35);
    boostsUsed.push({ name: "Discord Mod", value: "x1.35" });
  }

  if (inventory.Lumberjack) {
    amount = amount.mul(1.1);
    boostsUsed.push({ name: "Lumberjack", value: "x1.1" });
  }

  if (bumpkin.skills["Tough Tree"] && getPrngChance(10, "Tough Tree")) {
    amount = amount.mul(3);
    boostsUsed.push({ name: "Tough Tree", value: "x3" });
  }

  if (bumpkin.skills["Lumberjack's Extra"]) {
    amount = amount.add(0.1);
    boostsUsed.push({ name: "Lumberjack's Extra", value: "+0.1" });
  }

  if (isCollectibleBuilt({ name: "Wood Nymph Wendy", game })) {
    amount = amount.add(0.2);
    boostsUsed.push({ name: "Wood Nymph Wendy", value: "+0.2" });
  }

  //If Tiki Totem: bonus 0.1
  if (isCollectibleBuilt({ name: "Tiki Totem", game })) {
    amount = amount.add(0.1);
    boostsUsed.push({ name: "Tiki Totem", value: "+0.1" });
  }

  if (isCollectibleBuilt({ name: "Squirrel", game })) {
    amount = amount.add(0.1);
    boostsUsed.push({ name: "Squirrel", value: "+0.1" });
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
    boostsUsed.push({
      name: FACTION_ITEMS[factionName].secondaryTool,
      value: "+0.25",
    });
  }

  // Native 1 in 5 chance of getting 1 extra wood
  if (getPrngChance(20, "Native")) {
    amount = amount.add(1);
    boostsUsed.push({ name: "Native", value: "+1" });
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount = amount.add(1);
    boostsUsed.push({ name: "Legendary Shrine", value: "+1" });
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, "Wood");
  amount = amount.add(yieldBoost);
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  amount = amount.mul(multiplier);

  if (tree?.tier === 2) {
    amount = amount.add(0.5);
    boostsUsed.push({ name: "Tier 2 Bonus", value: "+0.5" });
  }

  if (tree?.tier === 3) {
    amount = amount.add(2.5);
    boostsUsed.push({ name: "Tier 3 Bonus", value: "+2.5" });
  }

  return { amount: amount.toDecimalPlaces(4), boostsUsed };
}

/**
 * Single source of truth for tree recovery boosts. Returns boosted recovery time and boosts used.
 * Used by both getChoppedAt (game) and UI. When prngArgs is omitted, PRNG-dependent branches (e.g. Tree Turnaround instant) are skipped.
 */
export function getTreeRecoveryTimeForDisplay({
  game,
  prngArgs,
}: {
  game: GameState;
  prngArgs?: PrngArgs;
}): {
  baseTimeMs: number;
  recoveryTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseTimeMs = TREE_RECOVERY_TIME * 1000;
  const { bumpkin } = game;
  let totalSeconds = TREE_RECOVERY_TIME;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (
    bumpkin.skills["Tree Turnaround"] &&
    prngArgs &&
    prngChance({
      ...prngArgs,
      chance: 15,
      criticalHitName: "Tree Turnaround",
    })
  ) {
    boostsUsed.push({ name: "Tree Turnaround", value: "Instant" });
    return { baseTimeMs, recoveryTimeMs: 0, boostsUsed };
  }

  const hasApprenticeBeaver = isCollectibleBuilt({
    name: "Apprentice Beaver",
    game,
  });
  const hasForemanBeaver = isCollectibleBuilt({
    name: "Foreman Beaver",
    game,
  });

  const hasBeaverReady = hasApprenticeBeaver || hasForemanBeaver;

  if (hasBeaverReady) {
    totalSeconds = totalSeconds * 0.5;
    if (hasForemanBeaver)
      boostsUsed.push({ name: "Foreman Beaver", value: "x0.5" });
    else if (hasApprenticeBeaver)
      boostsUsed.push({ name: "Apprentice Beaver", value: "x0.5" });
  }

  if (bumpkin.skills["Tree Charge"]) {
    boostsUsed.push({ name: "Tree Charge", value: "x0.9" });
    totalSeconds = totalSeconds * 0.9;
  }

  const hasSuperTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });

  const hasSuperTotemOrTimeWarpTotem = hasSuperTotem || hasTimeWarpTotem;

  if (hasSuperTotemOrTimeWarpTotem) {
    totalSeconds = totalSeconds * 0.5;
    if (hasSuperTotem) boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (hasTimeWarpTotem)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Timber Hourglass", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Timber Hourglass", value: "x0.75" });
  }

  if (isTemporaryCollectibleActive({ name: "Badger Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Badger Shrine", value: "x0.75" });
  }

  return {
    baseTimeMs,
    recoveryTimeMs: totalSeconds * 1000,
    boostsUsed,
  };
}

/**
 * Set a chopped in the past to make it replenish faster. Uses getTreeRecoveryTimeForDisplay for boost logic.
 */
export function getChoppedAt({ game, createdAt, prngArgs }: GetChoppedAtArgs): {
  time: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getTreeRecoveryTimeForDisplay({ game, prngArgs });
  const buffMs = baseTimeMs - recoveryTimeMs;
  return { time: createdAt - buffMs, boostsUsed };
}

/**
 * Calculate Money Tree reward using PRNG
 */
export function getReward({
  skills,
  farmId,
  itemId,
  counter,
}: {
  skills: Skills;
  farmId: number;
  itemId: number;
  counter: number;
}): {
  reward: Reward | undefined;
  boostsUsed: { name: BoostName; value: string }[];
} {
  if (
    skills["Money Tree"] &&
    prngChance({
      farmId,
      itemId,
      counter,
      chance: 1,
      criticalHitName: "Money Tree",
    })
  ) {
    return {
      reward: { coins: 200 },
      boostsUsed: [{ name: "Money Tree", value: "200" }],
    };
  }

  return { reward: undefined, boostsUsed: [] };
}

/**
 * Returns the amount of axe required to chop down a tree
 */
export function getRequiredAxeAmount(
  inventory: Inventory,
  gameState: GameState,
  id: string,
) {
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (isCollectibleBuilt({ name: "Foreman Beaver", game: gameState })) {
    boostsUsed.push({ name: "Foreman Beaver", value: "Free" });
    return { amount: new Decimal(0), boostsUsed };
  }

  const multiplier = gameState.trees[id]?.multiplier ?? 1;

  if (inventory.Logger?.gte(1)) {
    boostsUsed.push({ name: "Logger", value: "x0.5" });
    return { amount: new Decimal(0.5).mul(multiplier), boostsUsed };
  }

  return { amount: new Decimal(1).mul(multiplier), boostsUsed };
}

export function chop({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const {
      trees,
      bumpkin: { skills },
      inventory,
    } = stateCopy;

    const { amount: requiredAxes, boostsUsed: axeBoostsUsed } =
      getRequiredAxeAmount(state.inventory, state, action.index);

    const axeAmount = inventory.Axe || new Decimal(0);
    if (axeAmount.lessThan(requiredAxes)) {
      throw new Error(CHOP_ERRORS.NO_AXES);
    }

    const tree = trees[action.index];

    if (!tree) {
      throw new Error(CHOP_ERRORS.NO_TREE);
    }

    if (tree.x === undefined && tree.y === undefined) {
      throw new Error("Tree is not placed");
    }

    if (!canChop(tree, createdAt)) {
      throw new Error(CHOP_ERRORS.STILL_GROWING);
    }

    const treeName = tree.name ?? "Tree";
    const prngObject = {
      farmId,
      itemId: KNOWN_IDS[treeName],
      counter:
        stateCopy.farmActivity[
          `${treeName === "Tree" ? "Basic Tree" : treeName} Chopped`
        ] ?? 0,
    };

    const { amount: woodHarvested, boostsUsed: woodHarvestedBoostsUsed } =
      tree.wood.amount !== undefined
        ? { amount: tree.wood.amount, boostsUsed: [] }
        : getWoodDropAmount({
            game: stateCopy,
            tree,
            ...prngObject,
          });
    const woodAmount = inventory.Wood || new Decimal(0);

    const { time, boostsUsed: choppedAtBoostsUsed } = getChoppedAt({
      createdAt,
      game: stateCopy,
      prngArgs: prngObject,
    });

    tree.wood.choppedAt = time;

    inventory.Axe = axeAmount.sub(requiredAxes);
    inventory.Wood = woodAmount.add(woodHarvested);

    // Apply reward: honor legacy stored reward OR calculate new one via PRNG
    const { reward: treeReward, boostsUsed: rewardBoostsUsed } = tree.wood
      .reward
      ? { reward: tree.wood.reward, boostsUsed: [] }
      : getReward({
          skills,
          farmId,
          itemId: prngObject.itemId,
          counter: prngObject.counter,
        });

    if (treeReward?.coins) {
      stateCopy.coins =
        stateCopy.coins + treeReward.coins * (tree.multiplier ?? 1);
    }

    if (treeReward?.items) {
      treeReward.items.forEach((item) => {
        stateCopy.inventory[item.name] = (
          stateCopy.inventory[item.name] || new Decimal(0)
        ).add(item.amount);
      });
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Tree Chopped",
      stateCopy.farmActivity,
      new Decimal(tree.multiplier ?? 1),
    );

    stateCopy.farmActivity = trackFarmActivity(
      `${treeName === "Tree" ? "Basic Tree" : treeName} Chopped`,
      stateCopy.farmActivity,
    );

    delete tree.wood.amount;
    delete tree.wood.seed;
    delete tree.wood.criticalHit;
    delete tree.wood.reward;

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [
        ...choppedAtBoostsUsed,
        ...woodHarvestedBoostsUsed,
        ...axeBoostsUsed,
        ...rewardBoostsUsed,
      ],
      createdAt,
    });

    return stateCopy;
  });
}
