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
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 112
  | 113
  | 114
  | 115
  | 116
  | 117
  | 118
  | 119
  | 120
  | 121
  | 122
  | 123
  | 124
  | 125;

export const LEVEL_EXPERIENCE: Record<BumpkinLevel, number> = {
  1: 0,
  2: 2,
  3: 22,
  4: 205,
  5: 555,
  6: 1155,
  7: 2155,
  8: 3405,
  9: 5405,
  10: 7905,
  11: 10905,
  12: 14405,
  13: 18405,
  14: 22905,
  15: 27905,
  16: 33655,
  17: 40155,
  18: 47405,
  19: 55405,
  20: 64155,
  21: 73905,
  22: 84655,
  23: 96405,
  24: 109155,
  25: 122905,
  26: 137405,
  27: 152905,
  28: 169405,
  29: 186905,
  30: 205405,
  31: 225405,
  32: 246905,
  33: 269905,
  34: 294405,
  35: 320405,
  36: 348405,
  37: 378405,
  38: 410405,
  39: 444405,
  40: 480405,
  41: 518905,
  42: 559905,
  43: 603405,
  44: 649405,
  45: 697905,
  46: 749405,
  47: 803905,
  48: 861405,
  49: 921905,
  50: 985405,
  51: 1053905,
  52: 1127405,
  53: 1205905,
  54: 1289405,
  55: 1377905,
  56: 1476405,
  57: 1584905,
  58: 1703405,
  59: 1831905,
  60: 1970405,
  61: 2128905,
  62: 2287405,
  63: 2485905,
  64: 2704405,
  65: 2942905,
  66: 3221405,
  67: 3539905,
  68: 3898405,
  69: 4296905,
  70: 4735405,
  71: 5233905,
  72: 5743905,
  73: 6263905,
  74: 6793905,
  75: 7333905,
  76: 7883905,
  77: 8443905,
  78: 9013905,
  79: 9593905,
  80: 10183905,
  81: 10783905,
  82: 11393905,
  83: 12013905,
  84: 12643905,
  85: 13283905,
  86: 13933905,
  87: 14593905,
  88: 15263905,
  89: 15943905,
  90: 16633905,
  91: 17333905,
  92: 18043905,
  93: 18763905,
  94: 19493905,
  95: 20233905,
  96: 20983905,
  97: 21743905,
  98: 22513905,
  99: 23293905,
  100: 24083905,
  101: 24893905,
  102: 25723905,
  103: 26573905,
  104: 27443905,
  105: 28333905,
  106: 29243905,
  107: 30173905,
  108: 31123905,
  109: 32093905,
  110: 33083905,
  111: 34093905,
  112: 35123905,
  113: 36173905,
  114: 37243905,
  115: 38333905,
  116: 39443905,
  117: 40573905,
  118: 41723905,
  119: 42893905,
  120: 44083905,
  121: 45293905,
  122: 46523905,
  123: 47773905,
  124: 49043905,
  125: 50333905,
};

const MAX_BUMPKIN_LEVEL: BumpkinLevel = 125;

export const isMaxLevel = (experience: number): boolean => {
  return experience >= LEVEL_EXPERIENCE[MAX_BUMPKIN_LEVEL];
};

export const getBumpkinLevel = (experience: number): BumpkinLevel => {
  let bumpkinLevel: BumpkinLevel = 1;
  for (const key in LEVEL_EXPERIENCE) {
    const level = Number(key) as BumpkinLevel;
    if (isMaxLevel(experience)) {
      bumpkinLevel = MAX_BUMPKIN_LEVEL;
    } else if (experience >= LEVEL_EXPERIENCE[level]) {
      bumpkinLevel = level;
    } else {
      break;
    }
  }
  return bumpkinLevel;
};

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
  31: 22,
  32: 23,
  33: 23,
  34: 24,
  35: 24,
  36: 25,
  37: 25,
  38: 26,
  39: 26,
  40: 27,
  41: 27,
  42: 28,
  43: 28,
  44: 29,
  45: 29,
  46: 30,
  47: 30,
  48: 31,
  49: 31,
  50: 32,
  51: 32,
  52: 33,
  53: 33,
  54: 34,
  55: 34,
  56: 35,
  57: 35,
  58: 36,
  59: 36,
  60: 37,
  61: 37,
  62: 38,
  63: 38,
  64: 39,
  65: 39,
  66: 40,
  67: 40,
  68: 41,
  69: 41,
  70: 42,
  71: 42,
  72: 43,
  73: 43,
  74: 44,
  75: 44,
  76: 45,
  77: 45,
  78: 46,
  79: 46,
  80: 47,
  81: 47,
  82: 48,
  83: 48,
  84: 49,
  85: 49,
  86: 50,
  87: 50,
  88: 51,
  89: 51,
  90: 52,
  91: 52,
  92: 53,
  93: 53,
  94: 54,
  95: 54,
  96: 55,
  97: 55,
  98: 56,
  99: 56,
  100: 57,
  101: 57,
  102: 58,
  103: 58,
  104: 59,
  105: 59,
  106: 60,
  107: 60,
  108: 61,
  109: 61,
  110: 62,
  111: 62,
  112: 63,
  113: 63,
  114: 64,
  115: 64,
  116: 65,
  117: 65,
  118: 66,
  119: 66,
  120: 67,
  121: 67,
  122: 68,
  123: 68,
  124: 69,
  125: 69,
};

//currently is matched with the mainnet skill system (old bumpkin skills)
export const findLevelRequiredForNextSkillPoint = (
  experience: number,
): BumpkinLevel | undefined => {
  const currentLevel = getBumpkinLevel(experience);

  if (currentLevel >= MAX_BUMPKIN_LEVEL) {
    return;
  }

  let nextLevelWithSkillPoint: BumpkinLevel | undefined;
  for (const key in SKILL_POINTS) {
    const level = Number(key) as BumpkinLevel;
    // Save the first level with more skill points than current
    if (SKILL_POINTS[level] > SKILL_POINTS[currentLevel]) {
      nextLevelWithSkillPoint = level;
      break;
    }
  }

  return nextLevelWithSkillPoint;
};

//Could be used later for skill revamp
export const findLvlRequiredForNextSkillPoint = (
  experience: number,
): BumpkinLevel | undefined => {
  const bumpkinLevel = getBumpkinLevel(experience);
  const availableSkillPoints = bumpkinLevel;

  if (availableSkillPoints < 1) {
    return undefined;
  }

  return (bumpkinLevel + 1) as BumpkinLevel;
};

export const getExperienceToNextLevel = (experience: number) => {
  const level = getBumpkinLevel(experience);

  const nextLevelExperience = LEVEL_EXPERIENCE[(level + 1) as BumpkinLevel];
  const currentLevelExperience = LEVEL_EXPERIENCE[level] || 0;

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
