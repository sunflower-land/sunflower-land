import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import { IRON_RECOVERY_TIME } from "../../lib/constants";
import { trackActivity } from "../../types/bumpkinActivity";
import { CriticalHitName, GameState, Rock } from "../../types/game";
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

/**
 * Set a mined in the past to make it replenish faster
 */
export function getMinedAt({ createdAt, game }: GetMinedAtArgs): number {
  let totalSeconds = IRON_RECOVERY_TIME;

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (isCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (game.bumpkin.skills["Iron Hustle"]) {
    totalSeconds = totalSeconds * 0.7;
  }

  const buff = IRON_RECOVERY_TIME - totalSeconds;

  return createdAt - buff * 1000;
}

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getIronDropAmount({
  game,
  rock,
  criticalDropGenerator = () => false,
}: {
  game: GameState;
  rock: Rock;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
}) {
  let amount = 1;

  if (isCollectibleBuilt({ name: "Rocky the Mole", game })) {
    amount += 0.25;
  }

  if (isCollectibleBuilt({ name: "Radiant Ray", game })) {
    amount += 0.1;
  }

  if (isCollectibleBuilt({ name: "Iron Idol", game })) {
    amount += 1;
  }

  if (isCollectibleBuilt({ name: "Iron Beetle", game })) {
    amount += 0.1;
  }

  if (game.bumpkin.skills["Iron Bumpkin"]) {
    amount += 0.1;
  }

  if (game.bumpkin.skills["Rocky Favor"]) {
    amount -= 0.5;
  }

  if (game.bumpkin.skills["Ferrous Favor"]) {
    amount += 1;
  }

  if (criticalDropGenerator("Native")) {
    amount += 1;
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
      ...RESOURCE_DIMENSIONS["Iron Rock"],
    };

    if (
      isCollectibleBuilt({ name: "Emerald Turtle", game }) &&
      isWithinAOE(
        "Emerald Turtle",
        emeraldTurtlePosition,
        rockPosition,
        game.bumpkin.skills,
      )
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

  amount += getBudYieldBoosts(game.buds ?? {}, "Iron");

  if (game.island.type === "volcano") {
    amount += 0.1;
  }

  return new Decimal(amount).toDecimalPlaces(4);
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

    if (!canMine(ironRock, IRON_RECOVERY_TIME, createdAt)) {
      throw new Error(MINE_ERRORS.STILL_RECOVERING);
    }

    const toolAmount = stateCopy.inventory["Stone Pickaxe"] || new Decimal(0);

    if (toolAmount.lessThan(1)) {
      throw new Error(MINE_ERRORS.NO_PICKAXES);
    }

    const ironMined =
      ironRock.stone.amount ??
      getIronDropAmount({
        game: stateCopy,
        rock: ironRock,
        criticalDropGenerator: (name) =>
          !!(ironRock.stone.criticalHit?.[name] ?? 0),
      });

    const amountInInventory = stateCopy.inventory.Iron || new Decimal(0);

    ironRock.stone = {
      minedAt: getMinedAt({ createdAt, game: stateCopy }),
    };
    bumpkin.activity = trackActivity("Iron Mined", bumpkin.activity);

    stateCopy.inventory["Stone Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory.Iron = amountInInventory.add(ironMined);

    return stateCopy;
  });
}
