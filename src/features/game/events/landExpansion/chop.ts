import Decimal from "decimal.js-light";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { hasFeatureAccess } from "lib/flags";
import {
  computeReadyAt,
  getTreeBoostWindows,
} from "features/game/lib/boostWindows";
import { KNOWN_IDS } from "features/game/types";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";
import { trackFarmActivity } from "features/game/types/farmActivity";

import type {
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
import { mfTrack } from "lib/moonforgeAnalytics";

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

export function canChop(tree: Tree, game: GameState, now: number = Date.now()) {
  return now > getTreeReadyAt(tree, game);
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

  const toughTreeLevel = getSkillLevel(bumpkin.skills, "Tough Tree");
  if (
    toughTreeLevel &&
    getPrngChance(
      SKILL_RANKS["Tough Tree"].ranks[toughTreeLevel - 1],
      "Tough Tree",
    )
  ) {
    amount = amount.mul(3);
    boostsUsed.push({ name: "Tough Tree", value: "x3" });
  }

  const lumberjacksExtraLevel = getSkillLevel(
    bumpkin.skills,
    "Lumberjack's Extra",
  );
  if (lumberjacksExtraLevel) {
    const v =
      SKILL_RANKS["Lumberjack's Extra"].ranks[lumberjacksExtraLevel - 1];
    amount = amount.add(v);
    boostsUsed.push({ name: "Lumberjack's Extra", value: `+${v}` });
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

  const treeTurnaroundLevel = getSkillLevel(bumpkin.skills, "Tree Turnaround");
  if (
    treeTurnaroundLevel &&
    prngArgs &&
    prngChance({
      ...prngArgs,
      chance: SKILL_RANKS["Tree Turnaround"].ranks[treeTurnaroundLevel - 1],
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

  const treeChargeLevel = getSkillLevel(bumpkin.skills, "Tree Charge");
  if (treeChargeLevel) {
    const m = SKILL_RANKS["Tree Charge"].ranks[treeChargeLevel - 1];
    boostsUsed.push({ name: "Tree Charge", value: `x${m}` });
    totalSeconds = totalSeconds * m;
  }

  // Under SPEED_BOOSTS the temporary tree boosts (totems, Timber Hourglass,
  // Badger Shrine) are retroactive speed-rate windows (see boostWindows), so
  // they're excluded from the baked recovery here — the recovery left is the
  // permanent-boost-only base duration. Flag-off keeps the discount-at-start.
  // Not recorded in boostsUsed for the windowed case; their contribution is
  // derived over the recovery, not baked at chop time.
  const boostsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");

  const hasSuperTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });

  const hasSuperTotemOrTimeWarpTotem = hasSuperTotem || hasTimeWarpTotem;

  if (!boostsWindowed && hasSuperTotemOrTimeWarpTotem) {
    totalSeconds = totalSeconds * 0.5;
    if (hasSuperTotem) boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (hasTimeWarpTotem)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  if (
    !boostsWindowed &&
    isTemporaryCollectibleActive({ name: "Timber Hourglass", game })
  ) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Timber Hourglass", value: "x0.75" });
  }

  if (
    !boostsWindowed &&
    isTemporaryCollectibleActive({ name: "Badger Shrine", game })
  ) {
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
 * The chop time to persist, plus (under SPEED_BOOSTS) the base recovery duration.
 *
 * Legacy model: back-date `choppedAt` into the past so the tree replenishes
 * faster — the temporary boost discount is baked in at chop time.
 *
 * Speed-rate model (SPEED_BOOSTS): store the REAL chop time and a
 * `baseDurationMs` carrying only the permanent boosts; the temporary boosts
 * (totems/Timber Hourglass/Badger Shrine) are derived live from windows so they
 * credit only the overlap and apply retroactively. Uses
 * getTreeRecoveryTimeForDisplay for boost logic.
 */
export function getChoppedAt({ game, createdAt, prngArgs }: GetChoppedAtArgs): {
  time: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getTreeRecoveryTimeForDisplay({ game, prngArgs });

  if (hasFeatureAccess(game, "SPEED_BOOSTS")) {
    return { time: createdAt, baseDurationMs: recoveryTimeMs, boostsUsed };
  }

  const buffMs = baseTimeMs - recoveryTimeMs;
  return { time: createdAt - buffMs, boostsUsed };
}

/**
 * When a chopped tree is ready to chop again, across both boost models. Trees
 * chopped under the speed-rate model (with `baseDurationMs`) derive their ready
 * time live from the tree boost windows; legacy trees use their back-dated
 * `choppedAt` + base recovery time.
 *
 * `baseDurationMs` is a PERMANENT per-tree migration marker: the read path keys
 * off its presence, NOT the `SPEED_BOOSTS` flag (matching `getCropReadyAt`). A
 * tree chopped while the flag was on therefore keeps windowed timing even if the
 * flag is later disabled. This is intentional — windowed trees store the real
 * `choppedAt` + a permanent-boost-only `baseDurationMs`, so falling back to
 * `choppedAt + base recovery` would drop their baked permanent-boost credit and
 * wrongly lengthen recovery on rollback.
 */
export function getTreeReadyAt(tree: Tree, game: GameState): number {
  const { baseDurationMs, choppedAt } = tree.wood;

  if (baseDurationMs !== undefined) {
    return computeReadyAt({
      startedAt: choppedAt,
      baseDurationMs,
      windows: getTreeBoostWindows(game),
    });
  }

  return choppedAt + TREE_RECOVERY_TIME * 1000;
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
  const moneyTreeLevel = getSkillLevel(skills, "Money Tree");
  if (
    moneyTreeLevel &&
    prngChance({
      farmId,
      itemId,
      counter,
      chance: SKILL_RANKS["Money Tree"].ranks[moneyTreeLevel - 1],
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

    if (!canChop(tree, stateCopy, createdAt)) {
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

    const {
      time,
      baseDurationMs,
      boostsUsed: choppedAtBoostsUsed,
    } = getChoppedAt({
      createdAt,
      game: stateCopy,
      prngArgs: prngObject,
    });

    tree.wood.choppedAt = time;
    // Speed-rate model stores the base recovery; legacy/flag-off back-dates
    // choppedAt instead, so clear any stale baseDurationMs from a prior chop.
    if (baseDurationMs !== undefined) {
      tree.wood.baseDurationMs = baseDurationMs;
    } else {
      delete tree.wood.baseDurationMs;
    }

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

    mfTrack("resource_collected", {
      resource_type: "Wood",
      amount: Number(woodHarvested),
    });

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
