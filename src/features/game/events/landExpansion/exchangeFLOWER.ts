import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { trackFarmActivity } from "features/game/types/farmActivity";

export const EXCHANGE_FLOWER_PRICE = 50;
export const DAILY_LIMIT = 10000;

export type ExchangeFlowerAction = {
  type: "exchange.flower";
  amount: number; // Amount of Love Charm to exchange for FLOWER
};

type Options = {
  state: Readonly<GameState>;
  action: ExchangeFlowerAction;
  createdAt?: number;
};

export function exchangeFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "LOVE_CHARM_FLOWER_EXCHANGE")) {
      throw new Error("Flower Exchange is not available yet");
    }

    if (!isFaceVerified({ game })) {
      throw new Error("Face verification required");
    }

    const today = new Date(createdAt).toISOString().split("T")[0];
    const {
      flower: { history = {} },
      inventory,
      balance,
    } = game;

    const loveCharmsSpent = history[today]?.loveCharmsSpent ?? 0;
    const loveCharmsRequired = action.amount;
    const loveCharmsBalance = inventory["Love Charm"] ?? new Decimal(0);
    const flowerEarned = action.amount / EXCHANGE_FLOWER_PRICE;

    if (loveCharmsRequired <= 0) {
      throw new Error("Invalid amount");
    }

    if (loveCharmsBalance.lt(loveCharmsRequired)) {
      throw new Error("Insufficient Love Charms");
    }

    if (loveCharmsSpent + loveCharmsRequired > DAILY_LIMIT) {
      throw new Error("Daily limit reached");
    }

    inventory["Love Charm"] = loveCharmsBalance.minus(loveCharmsRequired);

    game.balance = balance.plus(flowerEarned);
    game.flower.history = {
      ...history,
      [today]: {
        loveCharmsSpent: loveCharmsSpent + loveCharmsRequired,
      },
    };

    game.farmActivity = trackFarmActivity(
      "FLOWER Exchanged",
      game.farmActivity,
      flowerEarned,
    );

    return game;
  });
}
