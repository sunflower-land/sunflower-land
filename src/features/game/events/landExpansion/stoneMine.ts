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
export const STONE_RECOVERY_TIME = 4 * 60 * 60;

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = STONE_RECOVERY_TIME;
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}

type GetMinedAtArgs = {
  skills: Skills;
  createdAt: number;
  game: GameState;
};

function getBoostedTime({
  skills,
  game,
}: Pick<GetMinedAtArgs, "skills" | "game">): {
  boostedTime: number;
  boostsUsed: BoostName[];
} {
  let totalSeconds = STONE_RECOVERY_TIME;
  const boostsUsed: BoostName[] = [];

  if (skills["Speed Miner"]) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push("Speed Miner");
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
    if (superTotem) boostsUsed.push("Super Totem");
    else if (timeWarpTotem) boostsUsed.push("Time Warp Totem");
  }

  if (isTemporaryCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push("Ore Hourglass");
  }

  if (isTemporaryCollectibleActive({ name: "Badger Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push("Badger Shrine");
  }

  const buff = STONE_RECOVERY_TIME - totalSeconds;

  return { boostedTime: buff * 1000, boostsUsed };
}

/**
 * Set a mined in the past to make it replenish faster
 */
export function getMinedAt({ skills, createdAt, game }: GetMinedAtArgs): {
  time: number;
  boostsUsed: BoostName[];
} {
  const { boostedTime, boostsUsed } = getBoostedTime({
    skills,
    game,
  });

  return { time: createdAt - boostedTime, boostsUsed };
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
  boostsUsed: BoostName[];
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
  const boostsUsed: BoostName[] = [];

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
    boostsUsed.push("Rock Golem");
  }

  if (inventory.Prospector) {
    amount += 0.2; // 20%
    boostsUsed.push("Prospector");
  }

  if (isCollectibleBuilt({ name: "Tunnel Mole", game })) {
    amount += 0.25;
    boostsUsed.push("Tunnel Mole");
  }

  if (isCollectibleBuilt({ name: "Stone Beetle", game })) {
    amount += 0.1;
    boostsUsed.push("Stone Beetle");
  }

  if (skills["Rock'N'Roll"]) {
    amount += 0.1;
    boostsUsed.push("Rock'N'Roll");
  }

  if (skills["Rocky Favor"]) {
    amount += 1;
    boostsUsed.push("Rocky Favor");
  }

  if (skills["Ferrous Favor"]) {
    amount -= 0.5;
    boostsUsed.push("Ferrous Favor");
  }

  // Add native critical hit before the AoE boosts
  if (getPrngChance(20, "Native")) {
    amount += 1;
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
      boostsUsed.push("Emerald Turtle");
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
      boostsUsed.push("Tin Turtle");
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
    boostsUsed.push(FACTION_ITEMS[factionName].secondaryTool);
  }

  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    amount += 1;
    boostsUsed.push("Legendary Shrine");
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, "Stone");
  amount += yieldBoost;
  if (budUsed) boostsUsed.push(budUsed);

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
  const boostsUsed: BoostName[] = [];
  if (isCollectibleBuilt({ name: "Quarry", game: gameState })) {
    boostsUsed.push("Quarry");
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
    const { boostedTime, boostsUsed: boostedTimeBoostsUsed } = getBoostedTime({
      skills: bumpkin.skills,
      game: stateCopy,
    });

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
