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
