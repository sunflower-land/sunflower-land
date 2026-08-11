import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type {
  BoostName,
  PotionName,
  GameState,
} from "features/game/types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";

export type Potions = [PotionName, PotionName, PotionName, PotionName];

export type StartPotionAction = {
  type: "potion.started";
  multiplier: number;
};

type Options = {
  state: Readonly<GameState>;
  action: StartPotionAction;
  createdAt?: number;
};

export const GAME_FEE = 320;

export function getPotionHouseFee({
  game,
  multiplier,
}: {
  game: GameState;
  multiplier: number;
}): { fee: number; boostsUsed: { name: BoostName; value: string }[] } {
  let fee = GAME_FEE * multiplier;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isWearableActive({ game, name: "Alchemist Apron" })) {
    fee *= 0.5;
    boostsUsed.push({ name: "Alchemist Apron", value: "x0.5" });
  }

  return { fee, boostsUsed };
}

export function startPotion({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin, coins } = stateCopy;
    const { fee, boostsUsed } = getPotionHouseFee({
      game: stateCopy,
      multiplier: action.multiplier,
    });

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    if (stateCopy.potionHouse?.game.status === "in_progress") {
      throw new Error("There is already a game in progress");
    }

    if (stateCopy.coins < fee) {
      throw new Error("Insufficient coins to start a game");
    }

    stateCopy.coins = coins - fee;
    stateCopy.farmActivity = trackFarmActivity(
      "Coins Spent",
      stateCopy.farmActivity,
      new Decimal(fee),
    );

    stateCopy.potionHouse = {
      game: {
        status: "in_progress",
        attempts: [],
        multiplier: action.multiplier,
      },
      history: stateCopy.potionHouse?.history ?? {},
    };

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
