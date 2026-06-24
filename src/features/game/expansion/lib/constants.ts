import type Decimal from "decimal.js-light";
import type { Ingredient } from "features/game/types/craftables";
import type { LevelRequirement } from "features/game/lib/level";
import type { Coordinates } from "../components/MapPlacement";

export const LAND_SIZE = 6;

/**
 * The expansion origin is the center point of a land expansion.
 */
export const EXPANSION_ORIGINS: Record<number, Coordinates> = {
  0: { x: 0 * LAND_SIZE, y: 0 * LAND_SIZE },
  1: { x: 1 * LAND_SIZE, y: 0 * LAND_SIZE },
  2: { x: 1 * LAND_SIZE, y: 1 * LAND_SIZE },
  3: { x: 0 * LAND_SIZE, y: 1 * LAND_SIZE },
  4: { x: -1 * LAND_SIZE, y: 1 * LAND_SIZE },
  5: { x: -1 * LAND_SIZE, y: 0 * LAND_SIZE },
  6: { x: -1 * LAND_SIZE, y: -1 * LAND_SIZE },
  7: { x: 0 * LAND_SIZE, y: -1 * LAND_SIZE },
  8: { x: 1 * LAND_SIZE, y: -1 * LAND_SIZE },
  9: { x: 2 * LAND_SIZE, y: -1 * LAND_SIZE },
  10: { x: 2 * LAND_SIZE, y: 0 * LAND_SIZE },
  11: { x: 2 * LAND_SIZE, y: 1 * LAND_SIZE },
  12: { x: 2 * LAND_SIZE, y: 2 * LAND_SIZE },
  13: { x: 1 * LAND_SIZE, y: 2 * LAND_SIZE },
  14: { x: 0 * LAND_SIZE, y: 2 * LAND_SIZE },
  15: { x: -1 * LAND_SIZE, y: 2 * LAND_SIZE },
  16: { x: -2 * LAND_SIZE, y: 2 * LAND_SIZE },
  17: { x: -2 * LAND_SIZE, y: 1 * LAND_SIZE },
  18: { x: -2 * LAND_SIZE, y: 0 * LAND_SIZE },
  19: { x: -2 * LAND_SIZE, y: -1 * LAND_SIZE },
  20: { x: -2 * LAND_SIZE, y: -2 * LAND_SIZE },
  21: { x: -1 * LAND_SIZE, y: -2 * LAND_SIZE },
  22: { x: 0 * LAND_SIZE, y: -2 * LAND_SIZE },
  23: { x: 1 * LAND_SIZE, y: -2 * LAND_SIZE },
  24: { x: 2 * LAND_SIZE, y: -2 * LAND_SIZE },
  25: { x: 3 * LAND_SIZE, y: -2 * LAND_SIZE },
  26: { x: 3 * LAND_SIZE, y: -1 * LAND_SIZE },
  27: { x: 3 * LAND_SIZE, y: 0 * LAND_SIZE },
  28: { x: 3 * LAND_SIZE, y: 1 * LAND_SIZE },
  29: { x: 3 * LAND_SIZE, y: 2 * LAND_SIZE },
  30: { x: 3 * LAND_SIZE, y: 3 * LAND_SIZE },
  // 7-wide x 6-tall layout (up to 42 expansions): continue the rectangular
  // spiral from (3,3) — left across the top, then down the left side.
  31: { x: 2 * LAND_SIZE, y: 3 * LAND_SIZE },
  32: { x: 1 * LAND_SIZE, y: 3 * LAND_SIZE },
  33: { x: 0 * LAND_SIZE, y: 3 * LAND_SIZE },
  34: { x: -1 * LAND_SIZE, y: 3 * LAND_SIZE },
  35: { x: -2 * LAND_SIZE, y: 3 * LAND_SIZE },
  36: { x: -3 * LAND_SIZE, y: 3 * LAND_SIZE },
  37: { x: -3 * LAND_SIZE, y: 2 * LAND_SIZE },
  38: { x: -3 * LAND_SIZE, y: 1 * LAND_SIZE },
  39: { x: -3 * LAND_SIZE, y: 0 * LAND_SIZE },
  40: { x: -3 * LAND_SIZE, y: -1 * LAND_SIZE },
  41: { x: -3 * LAND_SIZE, y: -2 * LAND_SIZE },
  42: { x: -3 * LAND_SIZE, y: -3 * LAND_SIZE },
};

/**
 * Origins (in LAND_SIZE units) of the first `expansionCount` expansions along
 * the rectangular spiral — indices `0..expansionCount-1`, matching how
 * `expansionCount` (the player's "Basic Land" total) is used everywhere else
 * (e.g. extractExpansionBoundingBoxes). Index 0 = centre.
 *
 * Reproduces EXPANSION_ORIGINS for the hand-listed range and continues for any
 * N, so the land's edges keep stepping out past it (e.g. the upcoming 7-wide,
 * 42-expansion lands). Mirrors `spiralOrigins` in the land-image generator.
 */
const spiralOrigins = (expansionCount: number): Coordinates[] => {
  // A real farm always has at least one expansion; guard against 0 so the
  // bounds below never collapse to Infinity.
  const count = Math.max(1, expansionCount);
  const out: Coordinates[] = [{ x: 0, y: 0 }];
  for (let r = 1; out.length < count; r++) {
    for (let y = -(r - 1); y <= r; y++) out.push({ x: r, y }); // up the right side
    for (let x = r - 1; x >= -r; x--) out.push({ x, y: r }); // left across the top
    for (let y = r - 1; y >= -r; y--) out.push({ x: -r, y }); // down the left side
    for (let x = -r + 1; x <= r; x++) out.push({ x, y: -r }); // right across the bottom
  }
  return out.slice(0, count);
};

/**
 * The x tile coordinate of the land's left edge for a given expansion count.
 *
 * The land grows as a rectangular spiral, so the left edge only moves out when
 * an expansion is added on the left. Each expansion is a LAND_SIZE square
 * centred on its origin, so the left edge is the left side of the left-most
 * active expansion. The client renders the land image centred on (0,0), so
 * this is also where the land visually ends on the left.
 *
 * The mushroom island is anchored a fixed gap off this edge, so the exact
 * value matters — changing this formula would shift where island items appear.
 */
export const getLandLeftEdge = (expansionCount: number): number => {
  const minOriginX =
    Math.min(0, ...spiralOrigins(expansionCount).map((o) => o.x)) * LAND_SIZE;

  return minOriginX - LAND_SIZE / 2;
};

/**
 * The y tile coordinate of the land's top (northern) edge for a given expansion
 * count.
 *
 * The mirror of getLandLeftEdge: the land grows as a rectangular spiral, so the
 * top edge only moves out when an expansion is added along the top. Each
 * expansion is a LAND_SIZE square centred on its origin, so the top edge is the
 * top side of the highest active expansion. The land image is rendered centred
 * on (0,0), so this is also where the land visually ends at the top.
 */
export const getLandTopEdge = (expansionCount: number): number => {
  const maxOriginY =
    Math.max(0, ...spiralOrigins(expansionCount).map((o) => o.y)) * LAND_SIZE;

  return maxOriginY + LAND_SIZE / 2;
};

/**
 * The wharf/dock sits at the 2nd tile from the left on the south edge of the
 * anchor (SW-corner) land — i.e. `plot.x * LAND_SIZE - 2`, `plot.y * LAND_SIZE
 * - 3`. The SW plot is (0,0) below 7 expansions, (-1,-1) from 7, (-2,-2) from
 * 21, so the dock steps out at 7 and 21. The crab traps, salt nodes and the two
 * boats (Pumpkin Pete's boat and the restock boat) are all positioned as
 * `getWharfCoordinates + <constant offset>`, so the whole cluster moves with
 * the dock.
 */
export const getWharfCoordinates = (expansionCount: number): Coordinates => {
  if (expansionCount < 7) return { x: -2, y: -3 };
  if (expansionCount < 21) return { x: -8, y: -9 };
  return { x: -14, y: -15 };
};

export type LandRequirements = {
  resources: Ingredient[];
  sfl: Decimal;
  seconds: number;
  bumpkinLevel: LevelRequirement;
};
