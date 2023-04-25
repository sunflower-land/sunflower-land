import { Coordinates } from "features/game/expansion/components/MapPlacement";

type LanternPositions = Record<number, Coordinates[]>;

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
      x: 11,
      y: 4,
    },
    {
      x: 9,
      y: 2,
    },
    {
      x: 13,
      y: 2,
    },
    {
      x: 12,
      y: 0,
    },
    {
      x: 10,
      y: 0,
    },
  ],
};

export const bumpkinPositions: Record<string, Coordinates> = {
  1: {
    x: -11,
    y: 5,
  },
  2: {
    x: 1,
    y: 1,
  },
  3: {
    x: 11,
    y: 2,
  },
  // "2023-05-08T00:00:00.000Z": {},
  // "2023-05-15T00:00:00.000Z": {},
  // "2023-05-22T00:00:00.000Z": {},
  // "2023-05-29T00:00:00.000Z": {},
  // "2023-06-05T00:00:00.000Z": {},
  // "2023-06-12T00:00:00.000Z": {},
  // "2023-06-19T00:00:00.000Z": {},
};
