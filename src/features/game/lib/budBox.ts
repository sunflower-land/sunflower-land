import type { TypeTrait } from "features/game/types/buds";

export const BUD_ORDER: TypeTrait[] = [
  "Plaza",
  "Woodlands",
  "Cave",
  "Sea",
  "Castle",
  "Port",
  "Retreat",
  "Saphiro",
  "Snow",
  "Beach",
];

/**
 * Based on day of year + year to get a consistent order of buds
 */
export function getDailyBudBoxType(ms: number): TypeTrait {
  const daysSinceEpoch = Math.floor(ms / (1000 * 60 * 60 * 24)) + 2; // +2 to match with current order
  const index = daysSinceEpoch % BUD_ORDER.length;
  return BUD_ORDER[index];
}
