export {
  PRIME_AGED_XP_MULTIPLIER,
  PRIME_AGED_BASE_CHANCE,
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
  getAgingSlotCount,
} from "./agingFormulas";

import { FISH } from "./consumables";
import type { FishName } from "./fishing";

export function getFishBaseXP(fishName: FishName): number {
  return FISH[fishName].experience;
}

export function isFishName(name: string): name is FishName {
  return name in FISH;
}
