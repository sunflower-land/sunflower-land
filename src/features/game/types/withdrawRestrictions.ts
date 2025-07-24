import { BoostName, BoostUsedAt } from "../types/game";
import { BudNFTName } from "./marketplace";

const ONE_DAY = 24 * 60 * 60 * 1000;

// Configuration object for boost cooldown restrictions
export const BOOST_COOLDOWN_DAYS: Partial<Record<BoostName, number>> = {
  "Crimstone Hammer": 5,
  "Grinx's Hammer": 7,
  "Green Amulet": 2,
  Kuebiko: 2,
  Scarecrow: 2,
  Nancy: 2,
  "Lunar Calendar": 2,
  "Solflare Aegis": 2,
  "Autumn's Embrace": 2,
  // Add other boost items with their respective cooldown days
  // Default items will use 1 day if not specified here
  // Buds would have a cooldown of 2 days
};

// Default cooldown for items not specified in the configuration
const DEFAULT_COOLDOWN_DAYS = 1;

const isBudBoost = (item: BoostName): item is BudNFTName => {
  return item.startsWith("Bud #");
};

export function hasBoostRestriction({
  boostUsedAt,
  createdAt = Date.now(),
  item,
}: {
  boostUsedAt: BoostUsedAt | undefined;
  createdAt?: number;
  item: BoostName;
}): { isRestricted: boolean; cooldownTimeLeft: number } {
  if (!boostUsedAt) return { isRestricted: false, cooldownTimeLeft: 0 };

  const itemBoostUsedAt = boostUsedAt[item];

  if (!itemBoostUsedAt) return { isRestricted: false, cooldownTimeLeft: 0 };

  // Get cooldown days from configuration or use default
  const cooldownDays =
    BOOST_COOLDOWN_DAYS[item] ??
    (isBudBoost(item) ? DEFAULT_COOLDOWN_DAYS * 2 : DEFAULT_COOLDOWN_DAYS);
  const cooldownMs = ONE_DAY * cooldownDays;

  return {
    isRestricted: itemBoostUsedAt > createdAt - cooldownMs,
    cooldownTimeLeft: cooldownMs - (createdAt - itemBoostUsedAt),
  };
}
