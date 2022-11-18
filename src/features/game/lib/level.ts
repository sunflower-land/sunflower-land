import { flipObject } from "lib/utils/flipObject";
import { getKeys } from "../types/craftables";

export type BumpkinLevel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export const LEVEL_BRACKETS: Record<BumpkinLevel, number> = {
  1: 5,
  2: 70,
  3: 382,
  4: 1242,
  5: 2554,
  6: 4582,
  7: 7800,
  8: 11500,
  9: 15500,
  10: 20000,
  11: 25000,
  12: 30500,
  13: 36500,
  14: 44000,
  15: 52000,
  16: 60500,
  17: 69500,
  18: 79500,
  19: 90000,
  20: 100500,
};

const MAX_BUMPKIN_LEVEL_BRACKET =
  getKeys(LEVEL_BRACKETS)[getKeys(LEVEL_BRACKETS).length - 1];
const MAX_BUMPKIN_LEVEL_BRACKET_MINUS_ONE =
  getKeys(LEVEL_BRACKETS)[getKeys(LEVEL_BRACKETS).length - 2];

export const isMaxLevel = (experience: number): boolean => {
  return experience >= LEVEL_BRACKETS[MAX_BUMPKIN_LEVEL_BRACKET_MINUS_ONE];
};

export const getBumpkinLevel = (experience: number): BumpkinLevel => {
  const levels = getKeys(LEVEL_BRACKETS);
  const bumpkinLevel = levels.find(
    (level) => experience < LEVEL_BRACKETS[level]
  );

  return bumpkinLevel ?? MAX_BUMPKIN_LEVEL_BRACKET;
};

export const getExperienceToNextLevel = (experience: number) => {
  const level = getBumpkinLevel(experience);
  const nextLevelExperience = LEVEL_BRACKETS[level];
  const previousLevelExperience =
    LEVEL_BRACKETS[(level - 1) as BumpkinLevel] || 0;

  const currentExperienceProgress = experience - previousLevelExperience;
  const experienceToNextLevel = nextLevelExperience - previousLevelExperience;

  return {
    currentExperienceProgress,
    experienceToNextLevel,
  };
};

// key: level, value: total skill points
export const SKILL_POINTS: Record<BumpkinLevel, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 7,
  11: 8,
  12: 9,
  13: 10,
  14: 10,
  15: 11,
  16: 12,
  17: 13,
  18: 13,
  19: 14,
  20: 15,
};

export const getMaxLevel = () => {
  const levels = getKeys(SKILL_POINTS);

  return levels[levels.length - 1];
};

export const findLevelRequiredForNextSkillPoint = (
  experience: number
): BumpkinLevel | undefined => {
  const level = getBumpkinLevel(experience);

  if (Number(level) >= getMaxLevel()) return undefined;

  const currentSkillPoints = SKILL_POINTS[level];
  const skillPointToLevels = flipObject(SKILL_POINTS);

  return Number(skillPointToLevels[currentSkillPoints + 1]) as BumpkinLevel;
};
