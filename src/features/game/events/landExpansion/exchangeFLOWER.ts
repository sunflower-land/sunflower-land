import { produce } from "immer";
import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { hasVipAccess } from "features/game/lib/vipAccess";

/**
 * The Love Charm -> FLOWER exchange is being sunset.
 *
 * - Until 28 Nov 2026: 80 Love Charms = 1 FLOWER
 * - 28 Nov – 28 Dec 2026: 150 Love Charms = 1 FLOWER
 * - From 28 Dec 2026: the exchange is closed
 *
 * Mirrors the API (domain/game/events/exchangeFLOWER).
 */
export const EXCHANGE_FLOWER_PRICE = 80;
export const SUNSET_EXCHANGE_FLOWER_PRICE = 150;
export const EXCHANGE_FLOWER_RATE_CHANGE_DATE = new Date(
  "2026-11-28T00:00:00.000Z",
).getTime();
export const EXCHANGE_FLOWER_CLOSE_DATE = new Date(
  "2026-12-28T00:00:00.000Z",
).getTime();
export const DAILY_LIMIT = 10000;

export function isFlowerExchangeClosed(now: number = Date.now()) {
  return now >= EXCHANGE_FLOWER_CLOSE_DATE;
}

/** Love Charms required for 1 FLOWER at `now`. */
export function getExchangeFlowerPrice(now: number = Date.now()) {
  return now >= EXCHANGE_FLOWER_RATE_CHANGE_DATE
    ? SUNSET_EXCHANGE_FLOWER_PRICE
    : EXCHANGE_FLOWER_PRICE;
}

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
    if (isFlowerExchangeClosed(createdAt)) {
      throw new Error("Exchange closed");
    }

    if (!isFaceVerified({ game })) {
      throw new Error("Face verification required");
    }

    // If no VIP, throw an error
    if (!hasVipAccess({ game, now: createdAt, type: "full" })) {
      throw new Error("VIP is required");
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
    const flowerEarned = action.amount / getExchangeFlowerPrice(createdAt);

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
      new Decimal(flowerEarned),
    );

    game.farmActivity = trackFarmActivity(
      "Love Charm Sold",
      game.farmActivity,
      new Decimal(loveCharmsRequired),
    );

    return game;
  });
}
