import Decimal from "decimal.js-light";
import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
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
import { produce } from "immer";
import {
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import cloneDeep from "lodash.clonedeep";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  canUseYieldBoostAOE,
  isCollectibleOnFarm,
  setAOELastUsed,
} from "features/game/lib/aoe";
import { canMine } from "features/game/lib/resourceNodes";

export type LandExpansionStoneMineAction = {
  type: "stoneRock.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionStoneMineAction;
  createdAt?: number;
};

type GetMinedAtArgs = {
  skills: Skills;
  createdAt: number;
  game: GameState;
};

function getBoostedTime({ skills, game }: GetMinedAtArgs): {
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
    createdAt,
  });

  return { time: createdAt - boostedTime, boostsUsed };
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
type GetStoneDropAmountArgs = {
  game: GameState;
  rock: Rock;
  createdAt: number;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
};
/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getStoneDropAmount({
  game,
  rock,
  createdAt,
  criticalDropGenerator = () => false,
}: GetStoneDropAmountArgs): {
  amount: Decimal;
  boostsUsed: BoostName[];
  aoe: AOE;
} {
  const {
    inventory,
    bumpkin: { skills },
    buds = {},
    aoe,
  } = game;
  const updatedAoe = cloneDeep(aoe);
  const multiplier = rock.multiplier ?? 1;

  let amount = 1;
  const boostsUsed: BoostName[] = [];
  if (
    isCollectibleBuilt({ name: "Rock Golem", game }) &&
    criticalDropGenerator("Rock Golem")
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
  if (criticalDropGenerator("Native")) {
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

export function mineStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { stones, bumpkin } = stateCopy;
    const rock = stones?.[action.index];

    if (!rock) {
      throw new Error("Stone does not exist");
    }

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (rock.x === undefined && rock.y === undefined) {
      throw new Error("Rock is not placed");
    }

    if (!canMine(rock, rock.name ?? "Stone Rock", createdAt)) {
      throw new Error("Rock is still recovering");
    }

    const toolAmount = stateCopy.inventory["Pickaxe"] || new Decimal(0);
    const { amount: requiredToolAmount, boostsUsed: pickaxeBoostsUsed } =
      getRequiredPickaxeAmount(stateCopy, action.index);

    if (toolAmount.lessThan(requiredToolAmount)) {
      throw new Error("Not enough pickaxes");
    }

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
          criticalDropGenerator: (name) =>
            !!(rock.stone.criticalHit?.[name] ?? 0),
        });
    stateCopy.aoe = aoe;

    const amountInInventory = stateCopy.inventory.Stone || new Decimal(0);
    const { time: minedAt, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      skills: bumpkin.skills,
      createdAt,
      game: stateCopy,
    });
    const { boostedTime, boostsUsed: boostedTimeBoostsUsed } = getBoostedTime({
      skills: bumpkin.skills,
      game: stateCopy,
      createdAt,
    });
    rock.stone = {
      minedAt,
      boostedTime,
    };

    stateCopy.inventory.Pickaxe = toolAmount.sub(requiredToolAmount);
    stateCopy.inventory.Stone = amountInInventory.add(stoneMined);
    delete rock.stone.amount;

    stateCopy.farmActivity = trackFarmActivity(
      "Stone Mined",
      stateCopy.farmActivity,
      new Decimal(rock?.multiplier ?? 1),
    );

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

    return stateCopy;
  });
}
