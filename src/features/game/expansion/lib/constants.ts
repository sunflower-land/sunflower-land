import Decimal from "decimal.js-light";
import { Ingredient } from "features/game/types/craftables";
import { Coordinates } from "../components/MapPlacement";

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
};

export type LandRequirements = {
  resources: Ingredient[];
  sfl: Decimal;
  seconds: number;
  bumpkinLevel: number;
};
