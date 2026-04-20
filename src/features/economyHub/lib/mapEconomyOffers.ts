import type {
  EconomyExchange,
  EconomyExchangeOffer,
} from "features/game/types/marketplace";

function firstSortedEntry<T>(
  record: Record<string, T>,
): [string, T] | undefined {
  const keys = Object.keys(record).sort();
  if (keys.length === 0) return undefined;
  const k = keys[0];
  return [k, record[k]];
}

/**
 * Maps API exchange offers to compact rows for the rewards widget (first requirement + first reward).
 */
export function mapEconomyOfferToExchangeRow(
  offer: EconomyExchangeOffer,
  economyLabel: string,
): EconomyExchange {
  const req = firstSortedEntry(offer.requirements);
  const rew = firstSortedEntry(offer.rewards.items);
  return {
    id: offer.id,
    economySlug: offer.slug,
    economyLabel,
    itemName: req?.[0] ?? "",
    itemAmount: req ? Math.floor(Number(req[1]) || 0) : 0,
    rewardName: rew?.[0] ?? "",
    rewardAmount: rew ? Math.floor(Number(rew[1]) || 0) : 0,
    claimed: offer.completedAt !== undefined,
  };
}
