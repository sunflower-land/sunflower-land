import Decimal from "decimal.js-light";
import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CriticalHitName, GameState, Rock, Skills } from "../../types/game";
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
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

/**
 * Set a mined in the past to make it replenish faster
 */
export function getMinedAt({
  skills,
  createdAt,
  game,
}: GetMinedAtArgs): number {
  let totalSeconds = STONE_RECOVERY_TIME;

  if (skills["Coal Face"]) {
    totalSeconds = totalSeconds * 0.8;
  }

  if (skills["Speed Miner"]) {
    totalSeconds = totalSeconds * 0.8;
  }

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    totalSeconds = totalSeconds * 0.5;
  }

  if (isCollectibleActive({ name: "Ore Hourglass", game })) {
    totalSeconds = totalSeconds * 0.5;
  }

  const buff = STONE_RECOVERY_TIME - totalSeconds;

  return createdAt - buff * 1000;
}

export function getRequiredPickaxeAmount(gameState: GameState) {
  if (isCollectibleBuilt({ name: "Quarry", game: gameState })) {
    return new Decimal(0);
  }

  return new Decimal(1);
}
type GetStoneDropAmountArgs = {
  game: GameState;
  rock: Rock;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
};
/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getStoneDropAmount({
  game,
  rock,
  criticalDropGenerator = () => false,
}: GetStoneDropAmountArgs) {
  const {
    inventory,
    bumpkin: { skills },
    buds = {},
  } = game;

  let amount = 1;

  if (
    isCollectibleBuilt({ name: "Rock Golem", game }) &&
    criticalDropGenerator("Rock Golem")
  ) {
    amount += 2; // 200%
  }

  if (inventory.Prospector) {
    amount += 0.2; // 20%
  }

  if (isCollectibleBuilt({ name: "Tunnel Mole", game })) {
    amount += 0.25;
  }

  if (isCollectibleBuilt({ name: "Stone Beetle", game })) {
    amount += 0.1;
  }

  if (skills.Digger) {
    amount += 0.1;
  }

  if (skills["Rock'N'Roll"]) {
    amount += 0.1;
  }

  if (skills["Rocky Favor"]) {
    amount += 1;
  }

  if (skills["Ferrous Favor"]) {
    amount -= 0.5;
  }

  // Add native critical hit before the AoE boosts
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
      ...RESOURCE_DIMENSIONS["Stone Rock"],
    };

    if (
      isCollectibleBuilt({ name: "Emerald Turtle", game }) &&
      isWithinAOE("Emerald Turtle", emeraldTurtlePosition, rockPosition, skills)
    ) {
      amount += 0.5;
    }
  }

  // If within Tin Turtle AOE: +0.1
  if (game.collectibles["Tin Turtle"]?.[0]) {
    if (!rock) return new Decimal(amount).toDecimalPlaces(4);

    const tinTurtleCoordinates =
      game.collectibles["Tin Turtle"]?.[0].coordinates;
    const tinTurtleDimensions = COLLECTIBLES_DIMENSIONS["Tin Turtle"];

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
      amount += 0.1;
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

  amount += getBudYieldBoosts(buds, "Stone");

  if (game.island.type === "volcano") {
    amount += 0.1;
  }

  return new Decimal(amount).toDecimalPlaces(4);
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
    const requiredToolAmount = getRequiredPickaxeAmount(stateCopy);

    if (toolAmount.lessThan(requiredToolAmount)) {
      throw new Error("Not enough pickaxes");
    }
    const stoneMined =
      rock.stone.amount ??
      getStoneDropAmount({
        game: stateCopy,
        rock,
        criticalDropGenerator: (name) =>
          !!(rock.stone.criticalHit?.[name] ?? 0),
      });
    const amountInInventory = stateCopy.inventory.Stone || new Decimal(0);

    rock.stone = {
      minedAt: getMinedAt({
        skills: bumpkin.skills,
        createdAt: Date.now(),
        game: stateCopy,
      }),
    };

    stateCopy.inventory.Pickaxe = toolAmount.sub(requiredToolAmount);
    stateCopy.inventory.Stone = amountInInventory.add(stoneMined);
    delete rock.stone.amount;

    bumpkin.activity = trackActivity("Stone Mined", bumpkin.activity);

    return stateCopy;
  });
}
