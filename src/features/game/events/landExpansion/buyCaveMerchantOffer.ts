import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { isCaveBuildingReady } from "features/game/lib/cave";
import { CAVE_MAX_TIER } from "features/game/types/caveTiers";
import {
  getCaveMerchantOffers,
  getCaveMerchantOffersLeft,
  getCaveMerchantVisit,
  isCaveMerchantOpen,
} from "features/game/types/caveMerchant";

export type BuyCaveMerchantOfferAction = {
  type: "cave.merchantOfferBought";
  /** The visit the player is buying from (`getCaveMerchantVisit`). */
  visit: number;
  /** The offer's slot, 1..8. */
  slot: number;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyCaveMerchantOfferAction;
  createdAt?: number;
};

export enum BUY_CAVE_MERCHANT_OFFER_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  UNKNOWN_OFFER = "The Goblin Cave Merchant has no such offer",
  OFFER_LOCKED = "The offer needs a later Cave tier",
  NOT_OPEN = "The Goblin Cave Merchant is not in town",
  LIMIT_REACHED = "The offer's limit has been reached",
  PERIOD_ENDED = "The offer's visit has already ended",
  INSUFFICIENT_ITEMS = "Not enough items for the offer",
}

/**
 * Trade with the Goblin Cave Merchant. The offer is regenerated here from the
 * visit and slot, never read from the client. Each offer has a per-player
 * limit per visit; only the current visit's purchases are kept, and purchases
 * dated in an earlier visit are rejected.
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
    if (!cave || !isCaveBuildingReady(game, createdAt)) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.NO_CAVE);
    }

    const { slot } = action;
    if (!Number.isInteger(slot) || slot < 1 || slot > CAVE_MAX_TIER) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.UNKNOWN_OFFER);
    }
    if (cave.tier < slot) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.OFFER_LOCKED);
    }

    const visit = getCaveMerchantVisit(createdAt);
    if (!isCaveMerchantOpen(visit, createdAt) || action.visit !== visit.index) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN);
    }

    // Visit indexes only grow. Autosave accepts slightly old events; one from
    // an earlier visit must not replace (and so reset) the current counts.
    const visits = Object.keys(cave.merchant?.purchases ?? {}).map(Number);
    if (visits.some((index) => index > visit.index)) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.PERIOD_ENDED);
    }

    const offer = getCaveMerchantOffers(visit.index)[slot - 1];
    const left = getCaveMerchantOffersLeft({
      merchant: cave.merchant,
      visit: visit.index,
      slot,
      limit: offer.limit,
    });
    if (left <= 0) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.LIMIT_REACHED);
    }

    const owned = game.inventory[offer.cost.item] ?? new Decimal(0);
    if (owned.lt(offer.cost.amount)) {
      throw new Error(BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_ITEMS);
    }

    game.inventory[offer.cost.item] = owned.minus(offer.cost.amount);
    game.inventory[offer.reward.item] = (
      game.inventory[offer.reward.item] ?? new Decimal(0)
    ).add(offer.reward.amount);

    // Earlier visits no longer limit anything, so only the current one is kept.
    const key = String(visit.index);
    const bought = cave.merchant?.purchases[key] ?? {};
    cave.merchant = {
      purchases: { [key]: { ...bought, [slot]: (bought[slot] ?? 0) + 1 } },
    };
  });
}
