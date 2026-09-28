import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { CaveMerchantOfferId, GameState } from "features/game/types/game";
import { getWeekKey } from "features/game/lib/factions";
import { hasFeatureAccess } from "lib/flags";
import { getKeys } from "lib/object";
import {
  CAVE_MERCHANT_OFFERS,
  CAVE_MERCHANT_TIER,
  getCaveMerchantOffersLeft,
  isCaveMerchantOfferId,
} from "features/game/types/caveMerchant";

export type BuyCaveMerchantOfferAction = {
  type: "cave.merchantOfferBought";
  offerId: CaveMerchantOfferId;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyCaveMerchantOfferAction;
  createdAt?: number;
};

export enum BUY_CAVE_MERCHANT_OFFER_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  MERCHANT_CLOSED = "The Goblin Cave Merchant has not opened yet",
  UNKNOWN_OFFER = "The Goblin Cave Merchant has no such offer",
  OFFER_LOCKED = "The offer needs a later Cave tier",
  LIMIT_REACHED = "The offer's limit has been reached",
  PERIOD_ENDED = "The offer's limit period has already ended",
  INSUFFICIENT_COINS = "Not enough coins for the offer",
  INSUFFICIENT_ITEMS = "Not enough items for the offer",
}

/**
 * Trade with the Goblin Cave Merchant. Each offer has a per-player limit that
 * resets weekly for now; only the latest week's purchases are kept, and
 * purchases dated in an earlier week are rejected.
 */
export function buyCaveMerchantOffer({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.NO_CAVE);
    }

    if (cave.tier < CAVE_MERCHANT_TIER) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.MERCHANT_CLOSED);
    }

    const { offerId } = action;
    if (!isCaveMerchantOfferId(offerId)) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.UNKNOWN_OFFER);
    }

    const { cost, reward, requiresTier } = CAVE_MERCHANT_OFFERS[offerId];
    if (cave.tier < requiresTier) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.OFFER_LOCKED);
    }

    const periodKey = getWeekKey({ date: new Date(createdAt) });
    // Week keys are ISO dates, so they sort chronologically. Autosave accepts
    // slightly old events; one from an earlier week must not replace (and so
    // reset) the current week's counts.
    const periods = Object.keys(cave.merchant?.purchases ?? {});
    if (periods.some((period) => period > periodKey)) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.PERIOD_ENDED);
    }
    const left = getCaveMerchantOffersLeft({
      merchant: cave.merchant,
      offerId,
      periodKey,
    });
    if (left <= 0) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.LIMIT_REACHED);
    }

    const coins = cost.coins ?? 0;
    if (game.coins < coins) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_COINS);
    }
    for (const item of getKeys(cost.items)) {
      const owned = game.inventory[item] ?? new Decimal(0);
      if (owned.lt(cost.items[item] ?? 0)) {
        throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_ITEMS);
      }
    }

    game.coins -= coins;
    for (const item of getKeys(cost.items)) {
      const owned = game.inventory[item] ?? new Decimal(0);
      game.inventory[item] = owned.minus(cost.items[item] ?? 0);
    }
    for (const item of getKeys(reward)) {
      const owned = game.inventory[item] ?? new Decimal(0);
      game.inventory[item] = owned.add(reward[item] ?? 0);
    }

    // Earlier periods no longer limit anything, so only the current one is kept.
    const bought = cave.merchant?.purchases[periodKey] ?? {};
    cave.merchant = {
      purchases: {
        [periodKey]: { ...bought, [offerId]: (bought[offerId] ?? 0) + 1 },
      },
    };
  });
}
