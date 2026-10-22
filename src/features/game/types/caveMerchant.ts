import type { CaveMerchant, CaveMerchantVisitState } from "./game";

/*
 * The Goblin Cave Merchant's stock is rolled and priced on the API only. Each
 * farm load brings the visit open (or last opened) and its stock in game
 * state as `cave.merchantVisit`, like Love Island's shop, so the client never
 * holds the price list or anything that could predict a future visit.
 */

export function isCaveMerchantOpen(
  visit: Pick<CaveMerchantVisitState, "opensAt" | "closesAt">,
  now: number,
): boolean {
  return now >= visit.opensAt && now < visit.closesAt;
}

/** How many more times the player can take an offer this visit. */
export function getCaveMerchantOffersLeft({
  merchant,
  visit,
  slot,
  limit,
}: {
  merchant?: CaveMerchant;
  visit: number;
  slot: number;
  limit: number;
}): number {
  const bought = merchant?.purchases[String(visit)]?.[slot] ?? 0;
  return Math.max(0, limit - bought);
}
