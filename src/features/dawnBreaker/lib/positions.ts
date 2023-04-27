import { Coordinates } from "features/game/expansion/components/MapPlacement";

export type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type LanternPositions = Partial<Record<Week, Coordinates[]>>;

export const lanternPositions: LanternPositions = {
  1: [
    {
      x: -11,
      y: 7,
    },
    {
      x: -9,
      y: 5,
    },
    {
      x: -13,
      y: 5,
    },
    {
      x: -12,
      y: 3,
    },
    {
      x: -10,
      y: 3,
    },
  ],
  2: [
    {
      x: 0,
      y: 2,
    },
    {
      x: 2,
      y: 2,
    },
    {
      x: 3,
      y: 0,
    },
    {
      x: 1,
      y: -1,
    },
    {
      x: -1,
      y: 0,
    },
  ],
  3: [
    {
      x: 10,
      y: 5,
    },
    {
      x: 8,
      y: 3,
    },
    {
      x: 9,
      y: 0,
    },
    {
      x: 11,
      y: 0,
    },
    {
      x: 12,
      y: 3,
    },
  ],
  4: [
    {
      x: -11,
      y: -2,
    },
    {
      x: -13,
      y: -4,
    },
    {
      x: -12,
      y: -6,
    },
    {
      x: -10,
      y: -6,
    },
    {
      x: -9,
      y: -4,
    },
  ],
  5: [
    {
      x: 9,
      y: -3,
    },
    {
      x: 7,
      y: -5,
    },
    {
      x: 8,
      y: -7,
    },
    {
      x: 10,
      y: -8,
    },
    {
      x: 11,
      y: -6,
    },
  ],
  6: [
    {
      x: 0,
      y: 0,
    },
    {
      x: -2,
      y: -2,
    },
    {
      x: -1,
      y: -4,
    },
    {
      x: 1,
      y: -4,
    },
    {
      x: 2,
      y: -2,
    },
  ],
  7: [
    {
      x: 4,
      y: -7,
    },
    {
      x: 2,
      y: -9,
    },
    {
      x: 3,
      y: -11,
    },
    {
      x: 5,
      y: -11,
    },
    {
      x: 6,
      y: -9,
    },
  ],
  8: [
    {
      x: -9,
      y: -12,
    },
    {
      x: -9,
      y: -14,
    },
    {
      x: -7,
      y: -15,
    },
    {
      x: -6,
      y: -13,
    },
    {
      x: -7,
      y: -11,
    },
  ],
};

export const bumpkinPositions: Record<Week, Coordinates> = {
  1: {
    x: -11,
    y: 5,
  },
  2: {
    x: 1,
    y: 1,
  },
  3: {
    x: 10,
    y: 3,
  },
  4: {
    x: -11,
    y: -4,
  },
  5: {
    x: 9,
    y: -5,
  },
  6: {
    x: 0,
    y: -2,
  },
  7: {
    x: 4,
    y: -9,
  },
  8: {
    x: -8,
    y: -13,
  },
  9: {
    x: -4,
    y: -14,
  },
};
