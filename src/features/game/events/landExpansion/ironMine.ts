import Decimal from "decimal.js-light";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type {
  AOE,
  BoostName,
  CriticalHitName,
  GameState,
  Rock,
} from "../../types/game";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { produce } from "immer";
import {
  type Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  RESOURCE_DIMENSIONS,
  type RockName,
} from "features/game/types/resources";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import cloneDeep from "lodash.clonedeep";
import {
  canUseYieldBoostAOE,
  isCollectibleOnFarm,
  setAOELastUsed,
} from "features/game/lib/aoe";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { IRON_RECOVERY_TIME } from "features/game/lib/constants";
import { hasFeatureAccess } from "lib/flags";
import { canMine, getMineReadyAt } from "features/game/lib/resourceNodes";

export type LandExpansionIronMineAction = {
  type: "ironRock.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionIronMineAction;
  createdAt: number;
  farmId: number;
};

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
};

/**
 * The iron rock's real recovery duration (ms), for gating the yield-AOE re-use.
 * Windowed rocks derive it from the live speed windows so an active boost shortens
 * it to match the actual recovery (matching how legacy rocks folded the discount
 * into `boostedTime`); legacy rocks keep their back-dated boosted time.
 */
function getIronRecoveryDurationMs(rock: Rock, game: GameState): number {
  return rock.stone.baseDurationMs !== undefined
    ? getMineReadyAt(rock, "Iron Rock", game) - rock.stone.minedAt
    : IRON_RECOVERY_TIME * 1000 - (rock?.stone?.boostedTime ?? 0);
}

/**
 * Single source of truth for iron recovery boosts. Used by both getMinedAt (game) and UI.
 */
export function getIronRecoveryTimeForDisplay({ game }: { game: GameState }): {
  baseTimeMs: number;
  recoveryTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseTimeMs = IRON_RECOVERY_TIME * 1000;
  let totalSeconds = IRON_RECOVERY_TIME;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // Under SPEED_BOOSTS the temporary iron boosts (totems, Ore Hourglass, Mole
  // Shrine) are retroactive speed-rate windows (see boostWindows), so they're
  // excluded from the baked recovery here — what remains is the permanent-boost-
  // only base duration. Flag-off keeps the legacy discount-at-start.
  const boostsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");

  const superTotemActive = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const timeWarpTotemActive = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  if (!boostsWindowed && (superTotemActive || timeWarpTotemActive)) {
    totalSeconds = totalSeconds * 0.5;
    if (superTotemActive)
      boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (timeWarpTotemActive)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  if (
    !boostsWindowed &&
    isTemporaryCollectibleActive({ name: "Ore Hourglass", game })
  ) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push({ name: "Ore Hourglass", value: "x0.5" });
  }

  if (
    !boostsWindowed &&
    isTemporaryCollectibleActive({ name: "Mole Shrine", game })
  ) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Mole Shrine", value: "x0.75" });
  }

  const ironHustleLevel = getSkillLevel(game.bumpkin.skills, "Iron Hustle");
  if (ironHustleLevel) {
    const v = SKILL_RANKS["Iron Hustle"].ranks[ironHustleLevel - 1];
    totalSeconds = totalSeconds * v;
    boostsUsed.push({ name: "Iron Hustle", value: `x${v}` });
  }

  return {
    baseTimeMs,
    recoveryTimeMs: totalSeconds * 1000,
    boostsUsed,
  };
}

/**
 * The mine time to persist, plus (under SPEED_BOOSTS) the base recovery duration.
 *
 * Legacy model: back-date `minedAt` into the past so the rock replenishes faster.
 * Speed-rate model (SPEED_BOOSTS): store the REAL mine time and a `baseDurationMs`
 * carrying only the permanent boosts; the temporary boosts are derived live from
 * windows. Uses getIronRecoveryTimeForDisplay for boost logic.
 */
export function getMinedAt({ createdAt, game }: GetMinedAtArgs): {
  time: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getIronRecoveryTimeForDisplay({ game });

  if (hasFeatureAccess(game, "SPEED_BOOSTS")) {
    return { time: createdAt, baseDurationMs: recoveryTimeMs, boostsUsed };
  }

  const buffMs = baseTimeMs - recoveryTimeMs;
  return { time: createdAt - buffMs, boostsUsed };
}

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getIronDropAmount({
  game,
  rock,
  createdAt,
  farmId,
  counter,
  itemId,
}: {
  game: GameState;
  rock: Rock;
  createdAt: number;
  farmId: number;
  counter: number;
  itemId: number;
}): {
  amount: Decimal;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { aoe } = game;
  const updatedAoe = cloneDeep(aoe);

  const getPrngChance = (chance: number, criticalHitName: CriticalHitName) =>
    prngChance({
      farmId,
      itemId,
      counter,
      chance,
      criticalHitName,
    });

  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isCollectibleBuilt({ name: "Rocky the Mole", game })) {
    amount += 0.25;
    boostsUsed.push({ name: "Rocky the Mole", value: "+0.25" });
  }

  if (isCollectibleBuilt({ name: "Radiant Ray", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Radiant Ray", value: "+0.1" });
  }

  if (isCollectibleBuilt({ name: "Iron Idol", game })) {
    amount += 1;
    boostsUsed.push({ name: "Iron Idol", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Iron Beetle", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Iron Beetle", value: "+0.1" });
  }

  const ironBumpkinLevel = getSkillLevel(game.bumpkin.skills, "Iron Bumpkin");
  if (ironBumpkinLevel) {
    const v = SKILL_RANKS["Iron Bumpkin"].ranks[ironBumpkinLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Iron Bumpkin", value: `+${v}` });
  }

  // Rocky Favor: debuff to Iron yield (buff to Stone applied in stoneMine)
  const rockyFavorLevel = getSkillLevel(game.bumpkin.skills, "Rocky Favor");
  if (rockyFavorLevel) {
    const v = SKILL_RANKS["Rocky Favor"].debuff[rockyFavorLevel - 1];
    amount -= v;
    boostsUsed.push({ name: "Rocky Favor", value: `-${v}` });
  }

  // Ferrous Favor: buff to Iron yield (debuff to Stone applied in stoneMine)
  const ferrousFavorLevel = getSkillLevel(game.bumpkin.skills, "Ferrous Favor");
  if (ferrousFavorLevel) {
    const v = SKILL_RANKS["Ferrous Favor"].buff[ferrousFavorLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Ferrous Favor", value: `+${v}` });
  }

  if (getPrngChance(20, "Native")) {
    amount += 1;
    boostsUsed.push({ name: "Native", value: "+1" });
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
      ...RESOURCE_DIMENSIONS["Iron Rock"],
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
        getIronRecoveryDurationMs(rock, game),
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

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, "Iron");
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

export function mineIron({
  state,
  action,
  createdAt,
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { iron, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    const ironRock = iron[action.index];

    if (!ironRock) {
      throw new Error("No iron");
    }

    if (ironRock.x === undefined && ironRock.y === undefined) {
      throw new Error("Iron rock is not placed");
    }

    if (
      !canMine(ironRock, ironRock.name ?? "Iron Rock", stateCopy, createdAt)
    ) {
      throw new Error("Iron is still recovering");
    }

    const toolAmount = stateCopy.inventory["Stone Pickaxe"] || new Decimal(0);
    const requiredToolAmount = ironRock.multiplier ?? 1;

    if (toolAmount.lessThan(requiredToolAmount)) {
      throw new Error("No pickaxes left");
    }

    const ironName: RockName = ironRock.name ?? "Iron Rock";
    const counter = stateCopy.farmActivity[`${ironName} Mined`] ?? 0;
    const itemId = KNOWN_IDS[ironName];

    const {
      amount: ironMined,
      aoe,
      boostsUsed: ironBoostsUsed,
    } = ironRock.stone.amount
      ? {
          amount: new Decimal(ironRock.stone.amount).toDecimalPlaces(4),
          aoe: stateCopy.aoe,
          boostsUsed: [],
        }
      : getIronDropAmount({
          game: stateCopy,
          rock: ironRock,
          createdAt,
          farmId,
          counter,
          itemId,
        });

    stateCopy.aoe = aoe;

    const amountInInventory = stateCopy.inventory.Iron || new Decimal(0);

    const {
      time,
      baseDurationMs,
      boostsUsed: minedAtBoostsUsed,
    } = getMinedAt({
      createdAt,
      game: stateCopy,
    });

    const {
      baseTimeMs,
      recoveryTimeMs,
      boostsUsed: boostedTimeBoostsUsed,
    } = getIronRecoveryTimeForDisplay({ game: stateCopy });

    ironRock.stone = { minedAt: time };
    if (baseDurationMs !== undefined) {
      // Speed-rate model: real minedAt + permanent-only baseDurationMs. Temporary
      // boosts are derived live from windows, so there's no baked discount; keep
      // boostedTime at 0 so the yield-AOE budget uses the real windowed duration.
      ironRock.stone.baseDurationMs = baseDurationMs;
      ironRock.stone.boostedTime = 0;
    } else {
      ironRock.stone.boostedTime = baseTimeMs - recoveryTimeMs;
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Iron Mined",
      stateCopy.farmActivity,
      new Decimal(ironRock.multiplier ?? 1),
    );

    stateCopy.farmActivity = trackFarmActivity(
      `${ironName} Mined`,
      stateCopy.farmActivity,
    );

    stateCopy.inventory["Stone Pickaxe"] = toolAmount.sub(requiredToolAmount);
    stateCopy.inventory.Iron = amountInInventory.add(ironMined);

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [
        ...ironBoostsUsed,
        ...minedAtBoostsUsed,
        ...boostedTimeBoostsUsed,
      ],
      createdAt,
    });
    delete ironRock.stone.amount;
    delete ironRock.stone.criticalHit;

    return stateCopy;
  });
}
