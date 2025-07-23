import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import {
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { GOLD_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  AOE,
  BoostName,
  CriticalHitName,
  GameState,
  Rock,
} from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { produce } from "immer";
import cloneDeep from "lodash.clonedeep";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { canUseYieldBoostAOE, setAOELastUsed } from "features/game/lib/aoe";

export type LandExpansionMineGoldAction = {
  type: "goldRock.mined";
  index: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionMineGoldAction;
  createdAt?: number;
};

export enum EVENT_ERRORS {
  NO_PICKAXES = "No iron pickaxes left",
  NO_GOLD = "No gold",
  STILL_RECOVERING = "Gold is still recovering",
  EXPANSION_HAS_NO_GOLD = "Expansion has no gold",
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
  let totalSeconds = GOLD_RECOVERY_TIME;
  const boostsUsed: BoostName[] = [];

  const superTotemActive = isCollectibleActive({
    name: "Super Totem",
    game,
  });
  const timeWarpTotemActive = isCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  if (superTotemActive || timeWarpTotemActive) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push("Super Totem");
    boostsUsed.push("Time Warp Totem");
  }

  if (isCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
    boostsUsed.push("Ore Hourglass");
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
export function getGoldDropAmount({
  game,
  rock,
  createdAt,
  criticalDropGenerator = () => false,
}: {
  game: GameState;
  rock: Rock;
  createdAt: number;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
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

  if (criticalDropGenerator("Native")) {
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

  // If within Emerald Turtle AOE: +0.5
  if (game.collectibles["Emerald Turtle"]?.[0]) {
    if (!rock)
      return {
        amount: new Decimal(amount).toDecimalPlaces(4),
        aoe: updatedAoe,
        boostsUsed,
      };

    const emeraldTurtleCoordinates =
      game.collectibles["Emerald Turtle"]?.[0].coordinates;
    const emeraldTurtleDimensions = COLLECTIBLES_DIMENSIONS["Emerald Turtle"];

    const emeraldTurtlePosition: Position = {
      x: emeraldTurtleCoordinates.x,
      y: emeraldTurtleCoordinates.y,
      height: emeraldTurtleDimensions.height,
      width: emeraldTurtleDimensions.width,
    };

    const rockPosition: Position = {
      x: rock?.x,
      y: rock?.y,
      ...RESOURCE_DIMENSIONS["Gold Rock"],
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

  return {
    amount: new Decimal(amount).toDecimalPlaces(4),
    aoe: updatedAoe,
    boostsUsed,
  };
}

export function mineGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin } = stateCopy;

    const { index } = action;
    if (!bumpkin) {
      throw new Error(EVENT_ERRORS.NO_BUMPKIN);
    }

    const goldRock = stateCopy.gold[index];

    if (!goldRock) {
      throw new Error("No gold rock found.");
    }

    if (!canMine(goldRock, GOLD_RECOVERY_TIME, createdAt)) {
      throw new Error(EVENT_ERRORS.STILL_RECOVERING);
    }

    const toolAmount = stateCopy.inventory["Iron Pickaxe"] || new Decimal(0);

    if (toolAmount.lessThan(1)) {
      throw new Error(EVENT_ERRORS.NO_PICKAXES);
    }
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
          criticalDropGenerator: (name) =>
            !!(goldRock.stone.criticalHit?.[name] ?? 0),
        });

    stateCopy.aoe = aoe;

    const amountInInventory = stateCopy.inventory.Gold || new Decimal(0);
    const { time: minedAt, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      createdAt,
      game: stateCopy,
    });
    const { boostedTime, boostsUsed: boostedTimeBoostsUsed } = getBoostedTime({
      game: stateCopy,
    });
    goldRock.stone = {
      minedAt,
      boostedTime,
    };
    bumpkin.activity = trackActivity("Gold Mined", bumpkin.activity);

    stateCopy.inventory["Iron Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory.Gold = amountInInventory.add(goldMined);
    delete goldRock.stone.amount;

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [
        ...goldBoostsUsed,
        ...minedAtBoostsUsed,
        ...boostedTimeBoostsUsed,
      ],
      createdAt,
    });

    return stateCopy;
  });
}
