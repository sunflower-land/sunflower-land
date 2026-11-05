import type {
  Cave,
  CaveMerchant,
  CaveMerchantOffer,
  CaveMerchantVisitState,
} from "./game";

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

/** Stock supplied by the server, unlocked and still claimable by this farm.
 * A passed nextOpensAt never implies that a new visit has arrived.
 */
export function getAvailableCaveMerchantOffers(
  cave: Cave | undefined,
  now: number,
): CaveMerchantOffer[] {
  const visit = cave?.merchantVisit;
  if (!cave || !visit || !isCaveMerchantOpen(visit, now)) return [];

  return visit.offers.filter(
    (offer) =>
      offer.slot <= cave.tier &&
      getCaveMerchantOffersLeft({
        merchant: cave.merchant,
        visit: visit.index,
        slot: offer.slot,
        limit: offer.limit,
      }) > 0,
  );
}

export type CaveMerchantSeenOffers = {
  visit: string;
  offers: string[];
};

/** Explicit fields keep order and remaining purchases out of offer identity. */
export function getCaveMerchantOfferKey(offer: CaveMerchantOffer): string {
  return JSON.stringify([
    offer.slot,
    offer.cost.item,
    offer.cost.amount,
    offer.reward.item,
    offer.reward.amount,
    offer.limit,
    offer.curiosity,
  ]);
}

export function getCaveMerchantVisitKey(visit: CaveMerchantVisitState): string {
  return JSON.stringify([visit.index, visit.opensAt]);
}

export function hasUnseenCaveMerchantOffers(
  cave: Cave | undefined,
  now: number,
  seen?: CaveMerchantSeenOffers,
): boolean {
  const offers = getAvailableCaveMerchantOffers(cave, now);
  const visit = cave?.merchantVisit;
  if (!visit || offers.length === 0) return false;
  return (
    seen?.visit !== getCaveMerchantVisitKey(visit) ||
    offers.some(
      (offer) => !seen.offers.includes(getCaveMerchantOfferKey(offer)),
    )
  );
}

/** Merge only the offers actually displayed, retaining earlier views this visit. */
export function viewCaveMerchantOffers(
  cave: Cave | undefined,
  now: number,
  seen?: CaveMerchantSeenOffers,
): CaveMerchantSeenOffers | undefined {
  const offers = getAvailableCaveMerchantOffers(cave, now);
  const visit = cave?.merchantVisit;
  if (!visit || offers.length === 0) return seen;
  const key = getCaveMerchantVisitKey(visit);
  return {
    visit: key,
    offers: [
      ...new Set([
        ...(seen?.visit === key ? seen.offers : []),
        ...offers.map(getCaveMerchantOfferKey),
      ]),
    ],
  };
}
