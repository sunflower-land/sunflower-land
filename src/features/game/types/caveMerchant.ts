import Decimal from "decimal.js-light";
import type {
  CaveMerchant,
  CaveMerchantOfferId,
  InventoryItemName,
} from "./game";
import { CAVE_TIERS, type CaveExpansionTier, type CaveTier } from "./caveTiers";

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
  requiresTier: CaveExpansionTier;
};

function getCaveUnlockTier(
  unlock: NonNullable<CaveTier["unlocks"]>,
): CaveExpansionTier {
  const tiers = Object.keys(CAVE_TIERS).map(Number) as CaveExpansionTier[];
  const tier = tiers.find((tier) => CAVE_TIERS[tier].unlocks === unlock);
  if (!tier) {
    throw new Error(`No Cave tier unlocks ${unlock}`);
  }
  return tier;
}

/** The Cave tier that opens the Goblin Cave Merchant's shop. */
export const CAVE_MERCHANT_TIER = getCaveUnlockTier("merchant");

/** The Cave tier that adds more offers to the same shop. */
export const CAVE_MERCHANT_OFFERS_TIER = getCaveUnlockTier("merchantOffers");

// TODO(Cave balance 475): placeholder offers, prices and limits. The spec only
// says Beetles are spent at the Merchant; everything else is invented.
export const CAVE_MERCHANT_OFFERS: Record<
  CaveMerchantOfferId,
  CaveMerchantOffer
> = {
  "sand-drills": {
    cost: { items: { "Brown Beetle": new Decimal(6) } },
    reward: { "Sand Drill": new Decimal(2) },
    limit: 5,
    requiresTier: CAVE_MERCHANT_TIER,
  },
  truffles: {
    cost: { items: { "Blue Beetle": new Decimal(4) } },
    reward: { Truffle: new Decimal(2) },
    limit: 5,
    requiresTier: CAVE_MERCHANT_TIER,
  },
  rawhide: {
    cost: { coins: 500, items: { "Pink Beetle": new Decimal(3) } },
    reward: { Rawhide: new Decimal(3) },
    limit: 3,
    requiresTier: CAVE_MERCHANT_TIER,
  },
  crimstone: {
    cost: { items: { "Amber Beetle": new Decimal(2) } },
    reward: { Crimstone: new Decimal(1) },
    limit: 2,
    requiresTier: CAVE_MERCHANT_OFFERS_TIER,
  },
  obsidian: {
    cost: { coins: 5_000, items: { "Amber Beetle": new Decimal(5) } },
    reward: { Obsidian: new Decimal(1) },
    limit: 1,
    requiresTier: CAVE_MERCHANT_OFFERS_TIER,
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
