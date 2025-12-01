import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { PotionName, GameState } from "features/game/types/game";
import { produce } from "immer";

export type Potions = [PotionName, PotionName, PotionName, PotionName];

export type StartPotionAction = {
  type: "potion.started";
  multiplier: number;
};

type Options = {
  state: Readonly<GameState>;
  action: StartPotionAction;
};

export const GAME_FEE = 320;

export function startPotion({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin, coins } = stateCopy;
    const fee = GAME_FEE * action.multiplier;

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

    return stateCopy;
  });
}
