import Decimal from "decimal.js-light";
import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  BoostName,
  CriticalHitName,
  AOE,
  GameState,
  Rock,
  Skills,
} from "../../types/game";
import {
  isCollectibleActive,
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
import { canUseYieldBoostAOE, setAOELastUsed } from "features/game/lib/aoe";

export type LandExpansionStoneMineAction = {
  type: "stoneRock.mined";
  index: number;
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

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = STONE_RECOVERY_TIME;
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}

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

  const superTotem = isCollectibleActive({
    name: "Super Totem",
    game,
  });
  const timeWarpTotem = isCollectibleActive({
    name: "Time Warp Totem",
    game,
  });

  if (superTotem || timeWarpTotem) {
    totalSeconds = totalSeconds * 0.5;
    if (superTotem) boostsUsed.push("Super Totem");
    else if (timeWarpTotem) boostsUsed.push("Time Warp Totem");
  }

  if (isCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push("Ore Hourglass");
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

export function getRequiredPickaxeAmount(gameState: GameState) {
  const boostsUsed: BoostName[] = [];
  if (isCollectibleBuilt({ name: "Quarry", game: gameState })) {
    boostsUsed.push("Quarry");
    return { amount: new Decimal(0), boostsUsed };
  }

  return { amount: new Decimal(1), boostsUsed };
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
  if (game.collectibles["Emerald Turtle"]?.[0]) {
    if (!rock || rock.x === undefined || rock.y === undefined)
      return {
        amount: new Decimal(amount).toDecimalPlaces(4),
        aoe: updatedAoe,
        boostsUsed,
      };

    const emeraldTurtleCoordinates =
      game.collectibles["Emerald Turtle"]?.[0].coordinates;
    const emeraldTurtleDimensions = COLLECTIBLES_DIMENSIONS["Emerald Turtle"];

    if (!emeraldTurtleCoordinates) {
      return {
        amount: new Decimal(amount).toDecimalPlaces(4),
        aoe: updatedAoe,
        boostsUsed,
      };
    }

    const emeraldTurtlePosition: Position = {
      x: emeraldTurtleCoordinates.x,
      y: emeraldTurtleCoordinates.y,
      height: emeraldTurtleDimensions.height,
      width: emeraldTurtleDimensions.width,
    };

    const rockPosition: Position = {
      x: rock?.x,
      y: rock?.y,
      ...RESOURCE_DIMENSIONS["Stone Rock"],
    };

    if (
      isCollectibleBuilt({ name: "Emerald Turtle", game }) &&
      isWithinAOE("Emerald Turtle", emeraldTurtlePosition, rockPosition, skills)
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

  // If within Tin Turtle AOE: +0.1
  if (game.collectibles["Tin Turtle"]?.[0]) {
    if (!rock || rock.x === undefined || rock.y === undefined)
      return {
        amount: new Decimal(amount).toDecimalPlaces(4),
        aoe: updatedAoe,
        boostsUsed,
      };

    const tinTurtleCoordinates =
      game.collectibles["Tin Turtle"]?.[0].coordinates;
    const tinTurtleDimensions = COLLECTIBLES_DIMENSIONS["Tin Turtle"];

    if (!tinTurtleCoordinates) {
      return {
        amount: new Decimal(amount).toDecimalPlaces(4),
        aoe: updatedAoe,
        boostsUsed,
      };
    }

    const tinTurtlePosition: Position = {
      x: tinTurtleCoordinates.x,
      y: tinTurtleCoordinates.y,
      height: tinTurtleDimensions.height,
      width: tinTurtleDimensions.width,
    };

    const rockPosition: Position = {
      x: rock?.x,
      y: rock?.y,
      ...RESOURCE_DIMENSIONS["Stone Rock"],
    };

    if (
      isCollectibleBuilt({ name: "Tin Turtle", game }) &&
      isWithinAOE("Tin Turtle", tinTurtlePosition, rockPosition, skills)
    ) {
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

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, "Stone");
  amount += yieldBoost;
  if (budUsed) boostsUsed.push(budUsed);

  if (game.island.type === "volcano") {
    amount += 0.1;
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

    if (!canMine(rock, createdAt)) {
      throw new Error("Rock is still recovering");
    }

    const toolAmount = stateCopy.inventory["Pickaxe"] || new Decimal(0);
    const { amount: requiredToolAmount, boostsUsed: pickaxeBoostsUsed } =
      getRequiredPickaxeAmount(stateCopy);

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

    bumpkin.activity = trackActivity("Stone Mined", bumpkin.activity);

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
