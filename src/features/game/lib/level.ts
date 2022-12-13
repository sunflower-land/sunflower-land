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
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30;

export const LEVEL_EXPERIENCE: Record<BumpkinLevel, number> = {
  1: 0,
  2: 5,
  3: 70,
  4: 230,
  5: 625,
  6: 1500,
  7: 3400,
  8: 7000,
  9: 11000,
  10: 15500,
  11: 20000,
  12: 25000,
  13: 30500,
  14: 36500,
  15: 44000,
  16: 52000,
  17: 60500,
  18: 69500,
  19: 79500,
  20: 90000,
  21: 100500,
  22: 111500,
  23: 123000,
  24: 135500,
  25: 148500,
  26: 162000,
  27: 176000,
  28: 190500,
  29: 205500,
  30: 220500,
};

const MAX_BUMPKIN_LEVEL = 30;

export const isMaxLevel = (experience: number): boolean => {
  return experience >= LEVEL_EXPERIENCE[MAX_BUMPKIN_LEVEL];
};

export const getBumpkinLevel = (experience: number): BumpkinLevel => {
  const levels = getKeys(LEVEL_EXPERIENCE).reverse();
  const bumpkinLevel = levels.find(
    (level) => experience >= LEVEL_EXPERIENCE[level]
  );

  const level = bumpkinLevel ?? MAX_BUMPKIN_LEVEL;
  return Number(level) as BumpkinLevel;
};

export const getExperienceToNextLevel = (experience: number) => {
  const level = getBumpkinLevel(experience);

  const nextLevelExperience = LEVEL_EXPERIENCE[(level + 1) as BumpkinLevel];
  const currentLevelExperience = LEVEL_EXPERIENCE[level as BumpkinLevel] || 0;

  const currentExperienceProgress = experience - currentLevelExperience;
  const experienceToNextLevel = nextLevelExperience - currentLevelExperience;

  if (level === MAX_BUMPKIN_LEVEL) {
    return {
      currentExperienceProgress,
      experienceToNextLevel: 0,
    };
  }

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
  21: 16,
  22: 16,
  23: 17,
  24: 18,
  25: 18,
  26: 19,
  27: 20,
  28: 21,
  29: 21,
  30: 22,
};

export const findLevelRequiredForNextSkillPoint = (
  experience: number
): BumpkinLevel | undefined => {
  const level = getBumpkinLevel(experience);

  if (Number(level) >= MAX_BUMPKIN_LEVEL) return undefined;

  const currentSkillPoints = SKILL_POINTS[level];
  const skillPointToLevels = flipObject(SKILL_POINTS);

  return Number(skillPointToLevels[currentSkillPoints + 1]) as BumpkinLevel;
};
