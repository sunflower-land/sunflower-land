import type { BumpkinLevel } from "features/game/lib/level";
import type { IslandType } from "features/game/types/game";

export type Land = 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Basic is a starter island capped at 9 expansions. */
export const BASIC_MAX_EXPANSION = 9;

/**
 * Per-island expansion caps. At the cap a player must upgrade to the next island
 * to gain more land. Players may remain on legacy expansions beyond the cap (and
 * keep those node tables) but cannot expand further. Islands not listed expand
 * up to their max layout.
 */
export const ISLAND_MAX_EXPANSION: Record<IslandType, number> = {
  basic: 9,
  spring: 16,
  desert: 25,
  volcano: 30,
};

export interface Requirements {
  bumpkinLevel: number;
}

const LAND_3_REQUIREMENTS: Requirements = { bumpkinLevel: 1 };
const LAND_4_REQUIREMENTS: Requirements = { bumpkinLevel: 1 };
const LAND_5_REQUIREMENTS: Requirements = { bumpkinLevel: 3 };
const LAND_6_REQUIREMENTS: Requirements = { bumpkinLevel: 4 };
const LAND_7_REQUIREMENTS: Requirements = { bumpkinLevel: 6 };
const LAND_8_REQUIREMENTS: Requirements = { bumpkinLevel: 8 };
const LAND_9_REQUIREMENTS: Requirements = { bumpkinLevel: 11 };

export const EXPANSION_REQUIREMENTS: Record<Land, Requirements> = {
  3: LAND_3_REQUIREMENTS,
  4: LAND_4_REQUIREMENTS,
  5: LAND_5_REQUIREMENTS,
  6: LAND_6_REQUIREMENTS,
  7: LAND_7_REQUIREMENTS,
  8: LAND_8_REQUIREMENTS,
  9: LAND_9_REQUIREMENTS,
};

export function getLandLimit(bumpkinLevel: BumpkinLevel): number {
  for (let limit = 3; limit <= 22; ++limit) {
    if (EXPANSION_REQUIREMENTS[(limit + 1) as Land].bumpkinLevel > bumpkinLevel)
      return limit;
  }
  return 23;
}
