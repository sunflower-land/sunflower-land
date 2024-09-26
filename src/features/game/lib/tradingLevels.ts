export type TradingLevel =
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
  | 15;

export const TRADING_LEVEL_EXPERIENCE: Record<TradingLevel, number> = {
  1: 100,
  2: 500,
  3: 1000,
  4: 1600,
  5: 2300,
  6: 3100,
  7: 4000,
  8: 5000,
  9: 6100,
  10: 7300,
  11: 8600,
  12: 10000,
  13: 11500,
  14: 13100,
  15: 15000,
};

export const MAX_TRADING_LEVEL: TradingLevel = 15;

export const isMaxTradingLevel = (experience: number): boolean => {
  return experience >= TRADING_LEVEL_EXPERIENCE[MAX_TRADING_LEVEL];
};

export const getTradingLevel = (experience: number): TradingLevel => {
  let tradingLevel: TradingLevel = 1;
  for (const key in TRADING_LEVEL_EXPERIENCE) {
    const level = Number(key) as TradingLevel;
    if (experience >= TRADING_LEVEL_EXPERIENCE[level]) {
      tradingLevel = level;
    } else {
      break;
    }
  }
  return tradingLevel;
};

export const getExperienceToNextTradingLevel = (experience: number) => {
  const level = getTradingLevel(experience);

  const nextLevelExperience =
    TRADING_LEVEL_EXPERIENCE[(level + 1) as TradingLevel];
  const currentLevelExperience = TRADING_LEVEL_EXPERIENCE[level] || 0;

  const currentExperienceProgress = experience - currentLevelExperience;
  const experienceToNextLevel = nextLevelExperience - currentLevelExperience;

  if (level === MAX_TRADING_LEVEL) {
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
