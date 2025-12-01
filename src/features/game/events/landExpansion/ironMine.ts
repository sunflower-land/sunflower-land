import Decimal from "decimal.js-light";
import { canMine } from "features/game/lib/resourceNodes";
import { IRON_RECOVERY_TIME } from "../../lib/constants";
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
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import cloneDeep from "lodash.clonedeep";
import {
  canUseYieldBoostAOE,
  isCollectibleOnFarm,
  setAOELastUsed,
} from "features/game/lib/aoe";

export type LandExpansionIronMineAction = {
  type: "ironRock.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionIronMineAction;
  createdAt?: number;
};

export enum MINE_ERRORS {
  NO_PICKAXES = "No pickaxes left",
  NO_IRON = "No iron",
  STILL_RECOVERING = "Iron is still recovering",
  EXPANSION_HAS_NO_IRON = "Expansion has no iron",
  NO_EXPANSION = "Expansion does not exist",
  NO_BUMPKIN = "You do not have a Bumpkin",
}

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
};

const getBoostedTime = ({
  game,
}: {
  game: GameState;
}): {
  boostedTime: number;
  boostsUsed: BoostName[];
} => {
  let totalSeconds = IRON_RECOVERY_TIME;
  const boostsUsed: BoostName[] = [];

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

  if (isTemporaryCollectibleActive({ name: "Mole Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push("Mole Shrine");
  }

  if (game.bumpkin.skills["Iron Hustle"]) {
    totalSeconds = totalSeconds * 0.7;
    boostsUsed.push("Iron Hustle");
  }

  const buff = IRON_RECOVERY_TIME - totalSeconds;

  return { boostedTime: buff * 1000, boostsUsed };
};

/**
 * Set a mined in the past to make it replenish faster
 */
export function getMinedAt({ createdAt, game }: GetMinedAtArgs): {
  time: number;
  boostsUsed: BoostName[];
} {
  const { boostedTime, boostsUsed } = getBoostedTime({ game });

  return { time: createdAt - boostedTime, boostsUsed };
}

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getIronDropAmount({
  game,
  rock,
  createdAt,
  criticalDropGenerator = () => false,
}: {
  game: GameState;
  rock: Rock;
  createdAt: number;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
}): { amount: Decimal; aoe: AOE; boostsUsed: BoostName[] } {
  const { aoe } = game;
  const updatedAoe = cloneDeep(aoe);

  let amount = 1;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Rocky the Mole", game })) {
    amount += 0.25;
    boostsUsed.push("Rocky the Mole");
  }

  if (isCollectibleBuilt({ name: "Radiant Ray", game })) {
    amount += 0.1;
    boostsUsed.push("Radiant Ray");
  }

  if (isCollectibleBuilt({ name: "Iron Idol", game })) {
    amount += 1;
    boostsUsed.push("Iron Idol");
  }

  if (isCollectibleBuilt({ name: "Iron Beetle", game })) {
    amount += 0.1;
    boostsUsed.push("Iron Beetle");
  }

  if (game.bumpkin.skills["Iron Bumpkin"]) {
    amount += 0.1;
    boostsUsed.push("Iron Bumpkin");
  }

  if (game.bumpkin.skills["Rocky Favor"]) {
    amount -= 0.5;
    boostsUsed.push("Rocky Favor");
  }

  if (game.bumpkin.skills["Ferrous Favor"]) {
    amount += 1;
    boostsUsed.push("Ferrous Favor");
  }

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

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, "Iron");
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

export function mineIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { iron, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error(MINE_ERRORS.NO_BUMPKIN);
    }

    const ironRock = iron[action.index];

    if (!ironRock) {
      throw new Error(MINE_ERRORS.NO_IRON);
    }

    if (ironRock.x === undefined && ironRock.y === undefined) {
      throw new Error("Iron rock is not placed");
    }

    if (!canMine(ironRock, ironRock.name ?? "Iron Rock", createdAt)) {
      throw new Error(MINE_ERRORS.STILL_RECOVERING);
    }

    const toolAmount = stateCopy.inventory["Stone Pickaxe"] || new Decimal(0);
    const requiredToolAmount = ironRock.multiplier ?? 1;

    if (toolAmount.lessThan(requiredToolAmount)) {
      throw new Error(MINE_ERRORS.NO_PICKAXES);
    }

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
          criticalDropGenerator: (name) =>
            !!(ironRock.stone.criticalHit?.[name] ?? 0),
        });

    stateCopy.aoe = aoe;

    const amountInInventory = stateCopy.inventory.Iron || new Decimal(0);

    const { time, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      createdAt,
      game: stateCopy,
    });
    const { boostedTime, boostsUsed: boostedTimeBoostsUsed } = getBoostedTime({
      game: stateCopy,
    });

    ironRock.stone = {
      minedAt: time,
      boostedTime: boostedTime,
    };

    stateCopy.farmActivity = trackFarmActivity(
      "Iron Mined",
      stateCopy.farmActivity,
      new Decimal(ironRock.multiplier ?? 1),
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

    return stateCopy;
  });
}
