import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import {
  isWithinAOE,
  Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isCollectibleOnFarm,
  canUseYieldBoostAOE,
  setAOELastUsed,
} from "features/game/lib/aoe";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { GOLD_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { KNOWN_IDS } from "features/game/types";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState, BoostName, Rock, AOE } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";
import { prngChance } from "lib/prng";
import cloneDeep from "lodash.clonedeep";

export type LandExpansionGoldMineAction = {
  type: "goldRock.mined";
  index: string;
};

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
  farmId: number;
  itemId: number;
  counter: number;
};

const getBoostedTime = ({
  game,
  farmId,
  itemId,
  counter,
}: {
  game: GameState;
  farmId: number;
  itemId: number;
  counter: number;
}): {
  boostedTime: number;
  boostsUsed: BoostName[];
} => {
  let totalSeconds = GOLD_RECOVERY_TIME;
  const boostsUsed: BoostName[] = [];

  if (
    isWearableActive({ name: "Pickaxe Shark", game }) &&
    prngChance({
      farmId,
      itemId,
      counter,
      chance: 10,
      criticalHitName: "Pickaxe Shark",
    })
  ) {
    return {
      boostedTime: GOLD_RECOVERY_TIME * 1000,
      boostsUsed: ["Pickaxe Shark"],
    };
  }

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
    if (superTotemActive) boostsUsed.push("Super Totem");
    else if (timeWarpTotemActive) boostsUsed.push("Time Warp Totem");
  }

  if (isTemporaryCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push("Ore Hourglass");
  }

  if (isWearableActive({ name: "Pickaxe Shark", game })) {
    totalSeconds = totalSeconds * 0.85;
    boostsUsed.push("Pickaxe Shark");
  }

  if (isTemporaryCollectibleActive({ name: "Mole Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push("Mole Shrine");
  }

  if (game.bumpkin.skills["Midas Sprint"]) {
    totalSeconds = totalSeconds * 0.9;
    boostsUsed.push("Midas Sprint");
  }

  if (game.bumpkin.skills["Midas Rush"]) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push("Midas Rush");
  }

  const buff = GOLD_RECOVERY_TIME - totalSeconds;

  return { boostedTime: buff * 1000, boostsUsed };
};

/**
 * Set a mined in the past to make it replenish faster
 */
export function getMinedAt({
  createdAt,
  game,
  farmId,
  itemId,
  counter,
}: GetMinedAtArgs): {
  time: number;
  boostsUsed: BoostName[];
} {
  const { boostedTime, boostsUsed } = getBoostedTime({
    game,
    farmId,
    itemId,
    counter,
  });

  return { time: createdAt - boostedTime, boostsUsed };
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
}): { amount: Decimal; boostsUsed: BoostName[]; aoe: AOE } {
  const {
    inventory,
    bumpkin: { skills },
    buds = {},
    aoe,
  } = game;
  const updatedAoe = cloneDeep(aoe);

  let amount = 1;
  const boostsUsed: BoostName[] = [];
  if (inventory["Gold Rush"]) {
    amount += 0.5;
    boostsUsed.push("Gold Rush");
  }

  if (skills["Golden Touch"]) {
    amount += 0.5;
    boostsUsed.push("Golden Touch");
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
  }

  if (isCollectibleBuilt({ name: "Nugget", game })) {
    amount += 0.25;
    boostsUsed.push("Nugget");
  }

  if (isCollectibleBuilt({ name: "Gilded Swordfish", game })) {
    amount += 0.1;
    boostsUsed.push("Gilded Swordfish");
  }

  if (isCollectibleBuilt({ name: "Gold Beetle", game })) {
    amount += 0.1;
    boostsUsed.push("Gold Beetle");
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
        GOLD_RECOVERY_TIME * 1000 - (rock?.stone?.boostedTime ?? 0),
        createdAt,
      );

      if (canUseAoe) {
        setAOELastUsed(updatedAoe, "Emerald Turtle", { dx, dy }, createdAt);
        amount += 0.5;
      }
      boostsUsed.push("Emerald Turtle");
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

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, "Gold");
  amount += yieldBoost;
  if (budUsed) boostsUsed.push(budUsed);

  if (game.island.type === "volcano") {
    amount += 0.1;
  }

  const multiplier = rock.multiplier ?? 1;
  amount *= multiplier;
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

    if (!canMine(goldRock, GOLD_RECOVERY_TIME, createdAt)) {
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

    const { time, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      createdAt,
      game: stateCopy,
      ...prngObject,
    });

    const { boostedTime, boostsUsed: boostedTimeBoostsUsed } = getBoostedTime({
      game: stateCopy,
      ...prngObject,
    });

    goldRock.stone = {
      minedAt: time,
      boostedTime,
    };

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
