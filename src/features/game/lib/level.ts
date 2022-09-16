import { getKeys } from "../types/craftables";

export type BumpkinLevel = 1 | 2 | 3;

export const LEVEL_BRACKETS: Record<BumpkinLevel, number> = {
  1: 100,
  2: 200,
  3: 300,
};

export const getBumpkinLevel = (experience: number) => {
  const levels = getKeys(LEVEL_BRACKETS);
  const bumpkinLevel = levels.find(
    (level) => experience <= LEVEL_BRACKETS[level]
  );

  return bumpkinLevel ?? 3;
};
