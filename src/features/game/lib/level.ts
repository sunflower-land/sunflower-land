import { getKeys } from "../types/craftables";

export type BumpkinLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const LEVEL_BRACKETS: Record<BumpkinLevel, number> = {
  1: 10,
  2: 70,
  3: 382,
  4: 1642,
  5: 2254,
  6: 4582,
  7: 7800,
  8: 12500,
  9: 16500,
  10: 21500,
  11: 24500,
  12: 27500,
};

const MAX_BUMPKIN_LEVEL =
  getKeys(LEVEL_BRACKETS)[getKeys(LEVEL_BRACKETS).length - 1];

export const getBumpkinLevel = (experience: number): BumpkinLevel => {
  const levels = getKeys(LEVEL_BRACKETS);
  const bumpkinLevel = levels.find(
    (level) => experience <= LEVEL_BRACKETS[level]
  );

  return bumpkinLevel ?? MAX_BUMPKIN_LEVEL;
};

// key: level, value: total skill points
export const SKILL_POINTS: Record<BumpkinLevel, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 12,
  12: 13,
};
