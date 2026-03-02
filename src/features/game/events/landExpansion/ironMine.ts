import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
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
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS, RockName } from "features/game/types/resources";
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

// 8 hours
export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = IRON_RECOVERY_TIME;
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
};

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

  const superTotemActive = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const timeWarpTotemActive = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  if (superTotemActive || timeWarpTotemActive) {
    totalSeconds = totalSeconds * 0.5;
    if (superTotemActive)
      boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (timeWarpTotemActive)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push({ name: "Ore Hourglass", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Mole Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Mole Shrine", value: "x0.75" });
  }

  if (game.bumpkin.skills["Iron Hustle"]) {
    totalSeconds = totalSeconds * 0.7;
    boostsUsed.push({ name: "Iron Hustle", value: "x0.7" });
  }

  return {
    baseTimeMs,
    recoveryTimeMs: totalSeconds * 1000,
    boostsUsed,
  };
}

/**
 * Set a mined in the past to make it replenish faster. Uses getIronRecoveryTimeForDisplay for boost logic.
 */
export function getMinedAt({ createdAt, game }: GetMinedAtArgs): {
  time: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getIronRecoveryTimeForDisplay({ game });
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

  if (game.bumpkin.skills["Iron Bumpkin"]) {
    amount += 0.1;
    boostsUsed.push({ name: "Iron Bumpkin", value: "+0.1" });
  }

  if (game.bumpkin.skills["Rocky Favor"]) {
    amount -= 0.5;
    boostsUsed.push({ name: "Rocky Favor", value: "-0.5" });
  }

  if (game.bumpkin.skills["Ferrous Favor"]) {
    amount += 1;
    boostsUsed.push({ name: "Ferrous Favor", value: "+1" });
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
        IRON_RECOVERY_TIME * 1000 - (rock?.stone?.boostedTime ?? 0),
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

  if (game.island.type === "volcano") {
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

    if (!canMine(ironRock, createdAt)) {
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

    const { time, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      createdAt,
      game: stateCopy,
    });

    const {
      baseTimeMs,
      recoveryTimeMs,
      boostsUsed: boostedTimeBoostsUsed,
    } = getIronRecoveryTimeForDisplay({ game: stateCopy });
    const boostedTime = baseTimeMs - recoveryTimeMs;

    ironRock.stone = {
      minedAt: time,
      boostedTime,
    };

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
