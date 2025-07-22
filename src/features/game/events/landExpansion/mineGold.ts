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
import { CriticalHitName, GameState, Rock } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { produce } from "immer";

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

/**
 * Set a mined in the past to make it replenish faster
 */
export function getMinedAt({ createdAt, game }: GetMinedAtArgs): number {
  let totalSeconds = GOLD_RECOVERY_TIME;

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (isCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (game.bumpkin.skills["Midas Sprint"]) {
    totalSeconds = totalSeconds * 0.9;
  }

  if (game.bumpkin.skills["Midas Rush"]) {
    totalSeconds = totalSeconds * 0.8;
  }

  const buff = GOLD_RECOVERY_TIME - totalSeconds;

  return createdAt - buff * 1000;
}

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getGoldDropAmount({
  game,
  rock,
  criticalDropGenerator = () => false,
}: {
  game: GameState;
  rock: Rock;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
}) {
  const {
    inventory,
    bumpkin: { skills },
    buds = {},
  } = game;
  let amount = 1;

  if (inventory["Gold Rush"]) {
    amount += 0.5;
  }

  // 1 in 5 chance of 2.5x
  if (skills["Gold Rush"] && criticalDropGenerator("Gold Rush")) {
    amount += 1.5;
  }

  if (skills["Golden Touch"]) {
    amount += 0.5;
  }

  if (criticalDropGenerator("Native")) {
    amount += 1;
  }

  if (isCollectibleBuilt({ name: "Nugget", game })) {
    amount += 0.25;
  }

  if (isCollectibleBuilt({ name: "Gilded Swordfish", game })) {
    amount += 0.1;
  }

  if (isCollectibleBuilt({ name: "Gold Beetle", game })) {
    amount += 0.1;
  }

  // If within Emerald Turtle AOE: +0.5
  if (game.collectibles["Emerald Turtle"]?.[0]) {
    if (!rock) return new Decimal(amount).toDecimalPlaces(4);

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
      amount += 0.5;
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
  }

  amount += getBudYieldBoosts(buds, "Gold");

  if (game.island.type === "volcano") {
    amount += 0.1;
  }

  return new Decimal(amount).toDecimalPlaces(4);
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
    const goldMined =
      goldRock.stone.amount ??
      getGoldDropAmount({
        game: stateCopy,
        rock: goldRock,
        criticalDropGenerator: (name) =>
          !!(goldRock.stone.criticalHit?.[name] ?? 0),
      });

    const amountInInventory = stateCopy.inventory.Gold || new Decimal(0);

    goldRock.stone = {
      minedAt: getMinedAt({ createdAt, game: stateCopy }),
    };
    bumpkin.activity = trackActivity("Gold Mined", bumpkin.activity);

    stateCopy.inventory["Iron Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory.Gold = amountInInventory.add(goldMined);

    return stateCopy;
  });
}
