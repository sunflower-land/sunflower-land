import Decimal from "decimal.js-light";
import { STONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState, Rock, Skills } from "../../types/game";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { produce } from "immer";

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

export function mineStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { stones, bumpkin, collectibles } = stateCopy;
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

    const stoneMined = rock.stone.amount;
    const amountInInventory = stateCopy.inventory.Stone || new Decimal(0);

    rock.stone = {
      minedAt: getMinedAt({
        skills: bumpkin.skills,
        createdAt: Date.now(),
        game: stateCopy,
      }),
      amount: 2,
    };

    stateCopy.inventory.Pickaxe = toolAmount.sub(requiredToolAmount);
    stateCopy.inventory.Stone = amountInInventory.add(stoneMined);

    bumpkin.activity = trackActivity("Stone Mined", bumpkin.activity);

    return stateCopy;
  });
}
