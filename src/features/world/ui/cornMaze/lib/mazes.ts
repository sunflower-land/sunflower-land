import Decimal from "decimal.js-light";
import { SeasonWeek } from "features/game/types/game";

type MazeData = {
  sflFee: Decimal;
};

export const CORN_MAZES: Record<SeasonWeek, MazeData> = {
  1: {
    sflFee: new Decimal(0),
  },
  2: {
    sflFee: new Decimal(0),
  },
  3: {
    sflFee: new Decimal(5),
  },
  4: {
    sflFee: new Decimal(5),
  },
  5: {
    sflFee: new Decimal(5),
  },
  6: {
    sflFee: new Decimal(5),
  },
  7: {
    sflFee: new Decimal(5),
  },
  8: {
    sflFee: new Decimal(5),
  },
  9: {
    sflFee: new Decimal(5),
  },
  10: {
    sflFee: new Decimal(5),
  },
  11: {
    sflFee: new Decimal(5),
  },
  12: {
    sflFee: new Decimal(5),
  },
};
