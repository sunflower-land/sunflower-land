import Decimal from "decimal.js-light";
import type {
  CaveMerchant,
  CaveMerchantOfferId,
  InventoryItemName,
} from "./game";
import type { CaveTierLevel } from "./caveTiers";

// Both repos keep this file byte-identical.

export type { CaveMerchantOfferId } from "./game";

export type CaveMerchantOffer = {
  cost: {
    coins?: number;
    items: Partial<Record<InventoryItemName, Decimal>>;
  };
  reward: Partial<Record<InventoryItemName, Decimal>>;
  /** How many times each player can take the offer per limit period. */
  limit: number;
  /** The Cave tier that adds the offer to the shop. */
  requiresTier: CaveTierLevel;
};

// The Merchant is open from Cave tier I with one offer, and each tier adds one
// more (#7721), so tier N stocks the first N offers below.
// TODO(Cave balance 475): placeholder offers, prices and limits. The spec only
// says Beetles are spent at the Merchant; everything else is invented.
export const CAVE_MERCHANT_OFFERS: Record<
  CaveMerchantOfferId,
  CaveMerchantOffer
> = {
  "sand-drills": {
    cost: { items: { "Green Beetle": new Decimal(6) } },
    reward: { "Sand Drill": new Decimal(2) },
    limit: 5,
    requiresTier: 1,
  },
  truffles: {
    cost: { items: { "Blue Beetle": new Decimal(4) } },
    reward: { Truffle: new Decimal(2) },
    limit: 5,
    requiresTier: 2,
  },
  leather: {
    cost: { coins: 500, items: { "Pink Beetle": new Decimal(3) } },
    reward: { Leather: new Decimal(3) },
    limit: 3,
    requiresTier: 3,
  },
  iron: {
    cost: { items: { "Green Beetle": new Decimal(5) } },
    reward: { Iron: new Decimal(2) },
    limit: 5,
    requiresTier: 4,
  },
  gold: {
    cost: { coins: 1_000, items: { "Pink Beetle": new Decimal(3) } },
    reward: { Gold: new Decimal(1) },
    limit: 3,
    requiresTier: 5,
  },
  oil: {
    cost: { items: { "Amber Beetle": new Decimal(2) } },
    reward: { Oil: new Decimal(10) },
    limit: 3,
    requiresTier: 6,
  },
  crimstone: {
    cost: { items: { "Amber Beetle": new Decimal(2) } },
    reward: { Crimstone: new Decimal(1) },
    limit: 2,
    requiresTier: 7,
  },
  obsidian: {
    cost: { coins: 5_000, items: { "Amber Beetle": new Decimal(5) } },
    reward: { Obsidian: new Decimal(1) },
    limit: 1,
    requiresTier: 8,
  },
};

export function isCaveMerchantOfferId(id: string): id is CaveMerchantOfferId {
  return Object.prototype.hasOwnProperty.call(CAVE_MERCHANT_OFFERS, id);
}

/** The offers the Merchant stocks at a Cave tier, in shop order. */
export function getCaveMerchantOffers(tier: number): CaveMerchantOfferId[] {
  return (Object.keys(CAVE_MERCHANT_OFFERS) as CaveMerchantOfferId[]).filter(
    (id) => tier >= CAVE_MERCHANT_OFFERS[id].requiresTier,
  );
}

/** How many more times the player can take an offer in a limit period. */
export function getCaveMerchantOffersLeft({
  merchant,
  offerId,
  periodKey,
}: {
  merchant?: CaveMerchant;
  offerId: CaveMerchantOfferId;
  periodKey: string;
}): number {
  const bought = merchant?.purchases[periodKey]?.[offerId] ?? 0;
  return Math.max(0, CAVE_MERCHANT_OFFERS[offerId].limit - bought);
}
