import Decimal from "decimal.js-light";
import { Ingredient } from "features/game/types/craftables";
import { Coordinates } from "../components/MapPlacement";

/**
 * Bottom left hand corner of the land
 */
export const LAND_ORIGINS: Record<number, Coordinates> = {
  1: {
    x: -3,
    y: 3,
  },
  2: {
    x: 3,
    y: 3,
  },
  3: {
    x: 3,
    y: 9,
  },
  4: {
    x: -3,
    y: 9,
  },
  5: {
    x: -9,
    y: 9,
  },
  6: {
    x: -9,
    y: 3,
  },
  7: {
    x: -9,
    y: -3,
  },
  8: {
    x: -3,
    y: -3,
  },
  9: {
    x: 9,
    y: -3,
  },
  10: {
    x: 15,
    y: -3,
  },
};

export type LandRequirements = {
  resources: Ingredient[];
  sfl: Decimal;
  seconds: number;
  bumpkinLevel: number;
};
