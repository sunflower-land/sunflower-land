import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  BoostName,
  CriticalHitName,
  AOE,
  GameState,
  Rock,
  Skills,
} from "../../types/game";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import {
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS, RockName } from "features/game/types/resources";
import cloneDeep from "lodash.clonedeep";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  canUseYieldBoostAOE,
  isCollectibleOnFarm,
  setAOELastUsed,
} from "features/game/lib/aoe";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import { produce } from "immer";
import { STONE_RECOVERY_TIME } from "features/game/lib/constants";

export type LandExpansionStoneMineAction = {
  type: "stoneRock.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionStoneMineAction;
  createdAt?: number;
  farmId: number;
};

// 4 hours

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = STONE_RECOVERY_TIME;
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}

type GetMinedAtArgs = {
  skills: Skills;
  createdAt: number;
  game: GameState;
};

/**
 * Single source of truth for stone recovery boosts. Used by both getMinedAt (game) and UI.
 */
export function getStoneRecoveryTimeForDisplay({ game }: { game: GameState }): {
  baseTimeMs: number;
  recoveryTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseTimeMs = STONE_RECOVERY_TIME * 1000;
  const skills = game.bumpkin.skills;
  let totalSeconds = STONE_RECOVERY_TIME;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (skills["Speed Miner"]) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push({ name: "Speed Miner", value: "x0.8" });
  }

  const superTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const timeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });

  if (superTotem || timeWarpTotem) {
    totalSeconds = totalSeconds * 0.5;
    if (superTotem) boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    else if (timeWarpTotem)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push({ name: "Ore Hourglass", value: "x0.5" });
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
 * Set a mined in the past to make it replenish faster. Uses getStoneRecoveryTimeForDisplay for boost logic.
 */
export function getMinedAt({ createdAt, game }: GetMinedAtArgs): {
  time: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getStoneRecoveryTimeForDisplay({ game });
  const buffMs = baseTimeMs - recoveryTimeMs;
  return { time: createdAt - buffMs, boostsUsed };
}

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
type GetStoneDropAmountArgs = {
  game: GameState;
  rock: Rock;
  createdAt: number;
  id: string;
  farmId: number;
  counter: number;
  itemId: number;
};

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getStoneDropAmount({
  game,
  rock,
  createdAt,
  id,
  farmId,
  counter,
  itemId,
}: GetStoneDropAmountArgs): {
  amount: Decimal;
  aoe: AOE;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const {
    inventory,
    bumpkin: { skills },
    buds = {},
    aoe,
  } = game;
  const updatedAoe = cloneDeep(aoe);
  const multiplier = game.stones[id]?.multiplier ?? 1;
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const getPrngChance = (chance: number, criticalHitName: CriticalHitName) =>
    prngChance({
      farmId,
      itemId,
      counter,
      chance,
      criticalHitName,
    });

  if (
    isCollectibleBuilt({ name: "Rock Golem", game }) &&
    getPrngChance(10, "Rock Golem")
  ) {
    amount += 2; // 200%
    boostsUsed.push({ name: "Rock Golem", value: "+2" });
  }

  if (inventory.Prospector) {
    amount += 0.2; // 20%
    boostsUsed.push({ name: "Prospector", value: "+0.2" });
  }

  if (isCollectibleBuilt({ name: "Tunnel Mole", game })) {
    amount += 0.25;
    boostsUsed.push({ name: "Tunnel Mole", value: "+0.25" });
  }

  if (isCollectibleBuilt({ name: "Stone Beetle", game })) {
    amount += 0.1;
    boostsUsed.push({ name: "Stone Beetle", value: "+0.1" });
  }

  if (skills["Rock'N'Roll"]) {
    amount += 0.1;
    boostsUsed.push({ name: "Rock'N'Roll", value: "+0.1" });
  }

  if (skills["Rocky Favor"]) {
    amount += 1;
    boostsUsed.push({ name: "Rocky Favor", value: "+1" });
  }

  if (skills["Ferrous Favor"]) {
    amount -= 0.5;
    boostsUsed.push({ name: "Ferrous Favor", value: "-0.5" });
  }

  // Add native critical hit before the AoE boosts
  if (getPrngChance(20, "Native")) {
    amount += 1;
    boostsUsed.push({ name: "Native", value: "+1" });
  }

  // If within Emerald Turtle AOE: +0.5
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
      ...RESOURCE_DIMENSIONS["Stone Rock"],
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
        STONE_RECOVERY_TIME * 1000 - (rock?.stone?.boostedTime ?? 0),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Emerald Turtle", { dx, dy }, createdAt);
        amount += 0.5;
      }
      boostsUsed.push({ name: "Emerald Turtle", value: "+0.5" });
    }
  }

  if (
    isCollectibleOnFarm({ name: "Tin Turtle", game }) &&
    rock &&
    rock.x !== undefined &&
    rock.y !== undefined
  ) {
    const coordinates = game.collectibles["Tin Turtle"]![0].coordinates!;
    const tinTurtlePosition: Position = {
      ...coordinates,
      ...COLLECTIBLES_DIMENSIONS["Tin Turtle"],
    };
    const rockPosition: Position = {
      x: rock.x,
      y: rock.y,
      ...RESOURCE_DIMENSIONS["Stone Rock"],
    };

    if (isWithinAOE("Tin Turtle", tinTurtlePosition, rockPosition, skills)) {
      const dx = rock.x - tinTurtlePosition.x;
      const dy = rock.y - tinTurtlePosition.y;

      const canUseAoe = canUseYieldBoostAOE(
        updatedAoe,
        "Tin Turtle",
        { dx, dy },
        STONE_RECOVERY_TIME * 1000 - (rock?.stone?.boostedTime ?? 0),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Tin Turtle", { dx, dy }, createdAt);
        amount += 0.1;
      }
      boostsUsed.push({ name: "Tin Turtle", value: "+0.1" });
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

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push({ name: "Legendary Shrine", value: "+1" });
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, "Stone");
  amount += yieldBoost;
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  if (game.island.type === "volcano") {
    amount += 0.1;
  }

  amount *= multiplier;

  // Add yield boost for upgraded stones
  if (rock.tier === 2) {
    amount += 0.5;
  }

  if (rock.tier === 3) {
    amount += 2.5;
  }

  return {
    amount: new Decimal(amount).toDecimalPlaces(4),
    aoe: updatedAoe,
    boostsUsed,
  };
}

export function getRequiredPickaxeAmount(gameState: GameState, id: string) {
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (isCollectibleBuilt({ name: "Quarry", game: gameState })) {
    boostsUsed.push({ name: "Quarry", value: "0" });
    return { amount: new Decimal(0), boostsUsed };
  }

  const multiplier = gameState.stones[id]?.multiplier ?? 1;
  return { amount: new Decimal(1).mul(multiplier), boostsUsed };
}

export function mineStone({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { stones, bumpkin, inventory } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    const rock = stones[action.index];

    if (!rock) {
      throw new Error("No rock");
    }

    if (rock.x === undefined && rock.y === undefined) {
      throw new Error("Rock is not placed");
    }

    if (!canMine(rock, createdAt)) {
      throw new Error("Rock is still recovering");
    }

    const toolAmount = inventory.Pickaxe || new Decimal(0);
    const { amount: requiredToolAmount, boostsUsed: pickaxeBoostsUsed } =
      getRequiredPickaxeAmount(stateCopy, action.index);

    if (toolAmount.lessThan(requiredToolAmount)) {
      throw new Error("Not enough pickaxes");
    }

    const stoneName: RockName = rock.name ?? "Stone Rock";
    const counter = stateCopy.farmActivity[`${stoneName} Mined`] ?? 0;
    const itemId = KNOWN_IDS[stoneName];

    const {
      amount: stoneMined,
      aoe,
      boostsUsed: stoneMinedBoostsUsed,
    } = rock.stone.amount
      ? {
          amount: new Decimal(rock.stone.amount).toDecimalPlaces(4),
          aoe: stateCopy.aoe,
          boostsUsed: [],
        }
      : getStoneDropAmount({
          game: stateCopy,
          rock,
          createdAt,
          id: action.index,
          farmId,
          counter,
          itemId,
        });
    stateCopy.aoe = aoe;

    const amountInInventory = inventory.Stone || new Decimal(0);
    const { time, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      skills: bumpkin.skills,
      createdAt,
      game: stateCopy,
    });
    const {
      baseTimeMs,
      recoveryTimeMs,
      boostsUsed: boostedTimeBoostsUsed,
    } = getStoneRecoveryTimeForDisplay({ game: stateCopy });
    const boostedTime = baseTimeMs - recoveryTimeMs;

    rock.stone = {
      minedAt: time,
      boostedTime,
    };

    stateCopy.farmActivity = trackFarmActivity(
      "Stone Mined",
      stateCopy.farmActivity,
      new Decimal(rock?.multiplier ?? 1),
    );

    stateCopy.farmActivity = trackFarmActivity(
      `${stoneName} Mined`,
      stateCopy.farmActivity,
    );

    inventory.Pickaxe = toolAmount.sub(requiredToolAmount);
    inventory.Stone = amountInInventory.add(stoneMined);

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [
        ...minedAtBoostsUsed,
        ...stoneMinedBoostsUsed,
        ...boostedTimeBoostsUsed,
        ...pickaxeBoostsUsed,
      ],
      createdAt,
    });
    delete rock.stone.amount;
    delete rock.stone.criticalHit;

    return stateCopy;
  });
}
