import Decimal from "decimal.js-light";
import {
  isWithinAOE,
  type Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isCollectibleOnFarm,
  canUseYieldBoostAOE,
  setAOELastUsed,
} from "features/game/lib/aoe";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { GOLD_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { isWearableActive } from "features/game/lib/wearables";
import { KNOWN_IDS } from "features/game/types";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type { GameState, BoostName, Rock, AOE } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";
import { prngChance } from "lib/prng";
import cloneDeep from "lodash.clonedeep";
import { canMine, getMineReadyAt } from "features/game/lib/resourceNodes";

export type LandExpansionGoldMineAction = {
  type: "goldRock.mined";
  index: string;
};

/**
 * The gold's real recovery duration (ms), for gating the yield-AOE re-use. It
 * is derived from the live speed windows, so an active boost shortens it to match
 * the actual recovery.
 */
function getGoldRecoveryDurationMs(rock: Rock, game: GameState): number {
  return getMineReadyAt(rock, "Gold Rock", game) - rock.stone.minedAt;
}

type PrngArgs = {
  farmId: number;
  itemId: number;
  counter: number;
};

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
  prngArgs?: PrngArgs;
};

/**
 * Single source of truth for gold recovery boosts. Used by both getMinedAt (game) and UI.
 * When prngArgs is omitted, PRNG-dependent branches (e.g. Pickaxe Shark instant) are skipped.
 */
export function getGoldRecoveryTimeForDisplay({
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
  const baseTimeMs = GOLD_RECOVERY_TIME * 1000;
  let totalSeconds = GOLD_RECOVERY_TIME;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // The temporary gold boosts (totems, Ore Hourglass, Mole Shrine) are
  // retroactive speed-rate windows (see boostWindows), so they're excluded from
  // the baked recovery here — what remains is the permanent-boost-only base
  // duration. The Pickaxe Shark PRNG-instant early-return is a PERMANENT boost
  // and stays unconditional.

  if (
    isWearableActive({ name: "Pickaxe Shark", game }) &&
    prngArgs &&
    prngChance({
      ...prngArgs,
      chance: 10,
      criticalHitName: "Pickaxe Shark",
    })
  ) {
    return {
      baseTimeMs,
      recoveryTimeMs: 0,
      boostsUsed: [{ name: "Pickaxe Shark", value: "Instant" }],
    };
  }

  if (isWearableActive({ name: "Pickaxe Shark", game })) {
    totalSeconds = totalSeconds * 0.85;
    boostsUsed.push({ name: "Pickaxe Shark", value: "x0.85" });
  }

  const midasSprintLevel = getSkillLevel(game.bumpkin.skills, "Midas Sprint");
  if (midasSprintLevel) {
    const v = SKILL_RANKS["Midas Sprint"].ranks[midasSprintLevel - 1];
    totalSeconds = totalSeconds * v;
    boostsUsed.push({ name: "Midas Sprint", value: `x${v}` });
  }

  const midasRushLevel = getSkillLevel(game.bumpkin.skills, "Midas Rush");
  if (midasRushLevel) {
    const v = SKILL_RANKS["Midas Rush"].ranks[midasRushLevel - 1];
    totalSeconds = totalSeconds * v;
    boostsUsed.push({ name: "Midas Rush", value: `x${v}` });
  }

  return {
    baseTimeMs,
    recoveryTimeMs: totalSeconds * 1000,
    boostsUsed,
  };
}

/**
 * The mine time to persist, plus the base recovery duration.
 *
 * Speed-rate model: store the REAL mine time and a `baseDurationMs` carrying only
 * the permanent boosts; the temporary boosts are derived live from
 * windows. Uses getGoldRecoveryTimeForDisplay for boost logic.
 */
export function getMinedAt({ createdAt, game, prngArgs }: GetMinedAtArgs): {
  time: number;
  baseDurationMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { recoveryTimeMs, boostsUsed } = getGoldRecoveryTimeForDisplay({
    game,
    prngArgs,
  });

  return { time: createdAt, baseDurationMs: recoveryTimeMs, boostsUsed };
}

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionGoldMineAction;
  createdAt: number;
  farmId: number;
};

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getGoldDropAmount({
  game,
  rock,
  createdAt,
  farmId,
  itemId,
  counter,
}: {
  game: GameState;
  rock: Rock;
  createdAt: number;
  farmId: number;
  itemId: number;
  counter: number;
}): {
  amount: Decimal;
  boostsUsed: { name: BoostName; value: string }[];
  aoe: AOE;
} {
  const {
    inventory,
    bumpkin: { skills },
    buds = {},
    aoe,
  } = game;
  const updatedAoe = cloneDeep(aoe);

  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (inventory["Gold Rush"]) {
    amount += 0.5;
    boostsUsed.push({ name: "Gold Rush", value: "+0.5" });
  }

  const goldenTouchLevel = getSkillLevel(skills, "Golden Touch");
  if (goldenTouchLevel) {
    const v = SKILL_RANKS["Golden Touch"].ranks[goldenTouchLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Golden Touch", value: `+${v}` });
  }

  if (
    prngChance({
      farmId,
      itemId,
      counter,
      chance: 20,
      criticalHitName: "Native",
    })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Native", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Nugget", game })) {
    amount += 0.25;
    boostsUsed.push({ name: "Nugget", value: "+0.25" });
  }

  if (isCollectibleBuilt({ name: "Gilded Swordfish", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Gilded Swordfish", value: "+0.1" });
  }

  if (isCollectibleBuilt({ name: "Gold Beetle", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Gold Beetle", value: "+0.1" });
  }

  if (
    isCollectibleOnFarm({ name: "Emerald Turtle", game }) &&
    rock &&
    rock.x !== undefined &&
    rock.y !== undefined
  ) {
    const coordinates = game.collectibles["Emerald Turtle"]![0].coordinates!;
    const emeraldTurtlePosition: Position = {
      ...coordinates,
      ...COLLECTIBLES_DIMENSIONS["Emerald Turtle"],
    };

    const rockPosition: Position = {
      x: rock.x,
      y: rock.y,
      ...RESOURCE_DIMENSIONS["Gold Rock"],
    };

    if (
      isWithinAOE(
        "Emerald Turtle",
        emeraldTurtlePosition,
        rockPosition,
        game.bumpkin.skills,
      )
    ) {
      const dx = rock.x - emeraldTurtlePosition.x;
      const dy = rock.y - emeraldTurtlePosition.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Emerald Turtle",
        { dx, dy },
        getGoldRecoveryDurationMs(rock, game),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Emerald Turtle", { dx, dy }, createdAt);
        amount += 0.5;
      }
      boostsUsed.push({ name: "Emerald Turtle", value: "+0.5" });
    }
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
    amount += 0.25;
    boostsUsed.push({
      name: FACTION_ITEMS[factionName].secondaryTool,
      value: "+0.25",
    });
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, "Gold");
  amount += yieldBoost;
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  if (hasRequiredIslandExpansion(game.island.type, "volcano")) {
    amount += 0.1;
    boostsUsed.push({ name: "Volcano Bonus", value: "+0.1" });
  }

  const multiplier = rock.multiplier ?? 1;
  amount *= multiplier;
  if (rock.tier === 2) {
    amount += 0.5;
    boostsUsed.push({ name: "Tier 2 Bonus", value: "+0.5" });
  }
  if (rock.tier === 3) {
    amount += 2.5;
    boostsUsed.push({ name: "Tier 3 Bonus", value: "+2.5" });
  }

  return {
    amount: new Decimal(amount).toDecimalPlaces(4),
    aoe: updatedAoe,
    boostsUsed,
  };
}

export function mineGold({
  state,
  action,
  createdAt,
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { gold, bumpkin, inventory } = stateCopy;
    const { index } = action;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    const goldRock = gold[index];

    if (!goldRock) {
      throw new Error("No gold");
    }

    if (goldRock.x === undefined && goldRock.y === undefined) {
      throw new Error("Gold rock is not placed");
    }

    if (
      !canMine(goldRock, goldRock.name ?? "Gold Rock", stateCopy, createdAt)
    ) {
      throw new Error("Gold is still recovering");
    }

    const toolAmount = inventory["Iron Pickaxe"] || new Decimal(0);
    const requiredToolAmount = goldRock.multiplier ?? 1;

    if (toolAmount.lessThan(requiredToolAmount)) {
      throw new Error("No pickaxes left");
    }
    const goldRockName = goldRock.name ?? "Gold Rock";
    const counter = stateCopy.farmActivity[`${goldRockName} Mined`] ?? 0;
    const itemId = KNOWN_IDS[goldRockName];
    const prngObject = {
      farmId,
      itemId,
      counter,
    };
    const {
      amount: goldMined,
      aoe,
      boostsUsed: goldBoostsUsed,
    } = goldRock.stone.amount
      ? {
          amount: new Decimal(goldRock.stone.amount).toDecimalPlaces(4),
          aoe: stateCopy.aoe,
          boostsUsed: [],
        }
      : getGoldDropAmount({
          game: stateCopy,
          rock: goldRock,
          createdAt,
          ...prngObject,
        });

    stateCopy.aoe = aoe;

    const amountInInventory = inventory.Gold || new Decimal(0);

    const {
      time,
      baseDurationMs,
      boostsUsed: minedAtBoostsUsed,
    } = getMinedAt({
      createdAt,
      game: stateCopy,
      prngArgs: prngObject,
    });

    const { boostsUsed: boostedTimeBoostsUsed } = getGoldRecoveryTimeForDisplay(
      {
        game: stateCopy,
        prngArgs: prngObject,
      },
    );

    goldRock.stone = { minedAt: time };
    // Speed-rate model: real minedAt + permanent-only baseDurationMs. Temporary
    // boosts are derived live from windows, so there's no baked discount; keep
    // boostedTime at 0 so the yield-AOE budget uses the real windowed duration.
    goldRock.stone.baseDurationMs = baseDurationMs;
    goldRock.stone.boostedTime = 0;

    stateCopy.farmActivity = trackFarmActivity(
      "Gold Mined",
      stateCopy.farmActivity,
      new Decimal(goldRock.multiplier ?? 1),
    );

    stateCopy.farmActivity = trackFarmActivity(
      `${goldRockName} Mined`,
      stateCopy.farmActivity,
    );

    inventory["Iron Pickaxe"] = toolAmount.sub(requiredToolAmount);
    inventory.Gold = amountInInventory.add(goldMined);

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [
        ...goldBoostsUsed,
        ...minedAtBoostsUsed,
        ...boostedTimeBoostsUsed,
      ],
      createdAt,
    });

    delete goldRock.stone.amount;
    delete goldRock.stone.criticalHit;

    return stateCopy;
  });
}
