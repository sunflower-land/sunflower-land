import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

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
  | 125
  | 126
  | 127
  | 128
  | 129
  | 130
  | 131
  | 132
  | 133
  | 134
  | 135
  | 136
  | 137
  | 138
  | 139
  | 140
  | 141
  | 142
  | 143
  | 144
  | 145
  | 146
  | 147
  | 148
  | 149
  | 150
  | 151
  | 152
  | 153
  | 154
  | 155
  | 156
  | 157
  | 158
  | 159
  | 160
  | 161
  | 162
  | 163
  | 164
  | 165
  | 166
  | 167
  | 168
  | 169
  | 170
  | 171
  | 172
  | 173
  | 174
  | 175
  | 176
  | 177
  | 178
  | 179
  | 180
  | 181
  | 182
  | 183
  | 184
  | 185
  | 186
  | 187
  | 188
  | 189
  | 190
  | 191
  | 192
  | 193
  | 194
  | 195
  | 196
  | 197
  | 198
  | 199
  | 200;

export const LEVEL_EXPERIENCE: Record<BumpkinLevel, number> = {
  1: 0,
  2: 2,
  3: 22,
  4: 205,
  5: 555,
  6: 1_155,
  7: 2_155,
  8: 3_405,
  9: 5_405,
  10: 7_905,
  11: 10_905,
  12: 14_405,
  13: 18_405,
  14: 22_905,
  15: 27_905,
  16: 33_655,
  17: 40_155,
  18: 47_405,
  19: 55_405,
  20: 64_155,
  21: 73_905,
  22: 84_655,
  23: 96_405,
  24: 109_155,
  25: 122_905,
  26: 137_405,
  27: 152_905,
  28: 169_405,
  29: 186_905,
  30: 205_405,
  31: 225_405,
  32: 246_905,
  33: 269_905,
  34: 294_405,
  35: 320_405,
  36: 348_405,
  37: 378_405,
  38: 410_405,
  39: 444_405,
  40: 480_405,
  41: 518_905,
  42: 559_905,
  43: 603_405,
  44: 649_405,
  45: 697_905,
  46: 749_405,
  47: 803_905,
  48: 861_405,
  49: 921_905,
  50: 985_405,
  51: 1_053_905,
  52: 1_127_405,
  53: 1_205_905,
  54: 1_289_405,
  55: 1_377_905,
  56: 1_476_405,
  57: 1_584_905,
  58: 1_703_405,
  59: 1_831_905,
  60: 1_970_405,
  61: 2_128_905,
  62: 2_287_405,
  63: 2_485_905,
  64: 2_704_405,
  65: 2_942_905,
  66: 3_221_405,
  67: 3_539_905,
  68: 3_898_405,
  69: 4_296_905,
  70: 4_735_405,
  71: 5_233_905,
  72: 5_743_905,
  73: 6_263_905,
  74: 6_793_905,
  75: 7_333_905,
  76: 7_883_905,
  77: 8_443_905,
  78: 9_013_905,
  79: 9_593_905,
  80: 10_183_905,
  81: 10_783_905,
  82: 11_393_905,
  83: 12_013_905,
  84: 12_643_905,
  85: 13_283_905,
  86: 13_933_905,
  87: 14_593_905,
  88: 15_263_905,
  89: 15_943_905,
  90: 16_633_905,
  91: 17_333_905,
  92: 18_043_905,
  93: 18_763_905,
  94: 19_493_905,
  95: 20_233_905,
  96: 20_983_905,
  97: 21_743_905,
  98: 22_513_905,
  99: 23_293_905,
  100: 24_083_905,
  101: 24_893_905,
  102: 25_723_905,
  103: 26_573_905,
  104: 27_443_905,
  105: 28_333_905,
  106: 29_243_905,
  107: 30_173_905,
  108: 31_123_905,
  109: 32_093_905,
  110: 33_083_905,
  111: 34_093_905,
  112: 35_123_905,
  113: 36_173_905,
  114: 37_243_905,
  115: 38_333_905,
  116: 39_443_905,
  117: 40_573_905,
  118: 41_723_905,
  119: 42_893_905,
  120: 44_083_905,
  121: 45_293_905,
  122: 46_523_905,
  123: 47_773_905,
  124: 49_043_905,
  125: 50_333_905,
  126: 51_653_905,
  127: 53_003_905,
  128: 54_383_905,
  129: 55_793_905,
  130: 57_233_905,
  131: 58_708_905,
  132: 60_218_905,
  133: 61_763_905,
  134: 63_343_905,
  135: 64_958_905,
  136: 66_613_905,
  137: 68_308_905,
  138: 70_043_905,
  139: 71_818_905,
  140: 73_633_905,
  141: 75_493_905,
  142: 77_398_905,
  143: 79_348_905,
  144: 81_343_905,
  145: 83_383_905,
  146: 85_473_905,
  147: 87_613_905,
  148: 89_803_905,
  149: 92_043_905,
  150: 94_333_905,
  151: 95_662_605,
  152: 97_031_166,
  153: 98_440_783,
  154: 99_892_688,
  155: 101_388_150,
  156: 102_928_475,
  157: 104_515_009,
  158: 106_149_139,
  159: 107_832_292,
  160: 109_565_939,
  161: 111_351_595,
  162: 113_190_820,
  163: 115_085_221,
  164: 117_036_454,
  165: 119_046_223,
  166: 121_116_285,
  167: 123_248_448,
  168: 125_444_575,
  169: 127_706_585,
  170: 130_036_455,
  171: 132_436_221,
  172: 134_907_979,
  173: 137_453_889,
  174: 140_076_176,
  175: 142_777_131,
  176: 145_559_114,
  177: 148_424_556,
  178: 151_375_961,
  179: 154_415_908,
  180: 157_547_053,
  181: 160_772_132,
  182: 164_093_963,
  183: 167_515_448,
  184: 171_039_577,
  185: 174_669_429,
  186: 178_408_176,
  187: 182_259_085,
  188: 186_225_521,
  189: 190_310_950,
  190: 194_518_941,
  191: 198_853_171,
  192: 203_317_427,
  193: 207_915_610,
  194: 212_651_738,
  195: 217_529_949,
  196: 222_554_506,
  197: 227_729_799,
  198: 233_060_350,
  199: 238_550_817,
  200: 244_206_000,
};

export const MAX_BUMPKIN_LEVEL: BumpkinLevel = 200;

/** Pre-ascension level cap once `SWAMP_ASCENSION` is on (levels above become ascension bands). */
export const PRE_ASCENSION_MAX_LEVEL: BumpkinLevel = 150;

/**
 * Pre-ascension Bumpkin level cap. Behind `SWAMP_ASCENSION` the cap drops from 200
 * to 150 (levels above 150 become ascension-band territory — see `getAscensionLevel`);
 * pass this as the `maxLevel` arg to `getBumpkinLevel`/`isMaxLevel`/`getExperienceToNextLevel`
 * at ascension-aware call sites. Flag-off keeps the legacy 200 cap.
 */
export const getMaxBumpkinLevel = (game: GameState): BumpkinLevel =>
  hasFeatureAccess(game, "SWAMP_ASCENSION")
    ? PRE_ASCENSION_MAX_LEVEL
    : MAX_BUMPKIN_LEVEL;

export const isMaxLevel = (
  experience: number,
  maxLevel: BumpkinLevel = MAX_BUMPKIN_LEVEL,
): boolean => {
  return experience >= LEVEL_EXPERIENCE[maxLevel];
};

const getBumpkinLevel = (
  experience: number,
  maxLevel: BumpkinLevel = MAX_BUMPKIN_LEVEL,
): BumpkinLevel => {
  if (isMaxLevel(experience, maxLevel)) {
    return maxLevel;
  }

  let bumpkinLevel: BumpkinLevel = 1;
  for (const key in LEVEL_EXPERIENCE) {
    const level = Number(key) as BumpkinLevel;
    if (level > maxLevel) {
      break;
    }
    if (experience >= LEVEL_EXPERIENCE[level]) {
      bumpkinLevel = level;
    } else {
      break;
    }
  }
  return bumpkinLevel;
};

export const getExperienceToNextLevel = (
  experience: number,
  maxLevel: BumpkinLevel = MAX_BUMPKIN_LEVEL,
) => {
  const level = getBumpkinLevel(experience, maxLevel);

  const nextLevelExperience = LEVEL_EXPERIENCE[(level + 1) as BumpkinLevel];
  const currentLevelExperience = LEVEL_EXPERIENCE[level] || 0;

  const currentExperienceProgress = experience - currentLevelExperience;
  const experienceToNextLevel = nextLevelExperience - currentLevelExperience;

  if (level === maxLevel) {
    return {
      currentExperienceProgress,
      experienceToNextLevel:
        LEVEL_EXPERIENCE[maxLevel] -
        LEVEL_EXPERIENCE[(maxLevel - 1) as BumpkinLevel],
    };
  }

  return {
    currentExperienceProgress,
    experienceToNextLevel,
  };
};

/**
 * Ascension (swamp onward) XP progression. Once a player ascends past the
 * level-150 pre-ascension cap, each ascension `a` (`game.island.ascensionLevel`,
 * 1-indexed) adds a band of `LEVELS_PER_ASCENSION` levels on top of the
 * cumulative `bumpkin.experience`:
 *
 *   bandXp(a)    = round_5M(50,000,000 × 1.45^(a-1))  — total XP to complete ascension a
 *   levelXp(a,n) = bandXp(a) × (1 + 0.03n) / 88.25    — XP for within-level n (n = 1..50)
 *   B(a)         = LEVEL_EXPERIENCE[150] + Σ_{b<a} bandXp(b)  — XP to start band a
 *
 * Bands stack: completing band a (experience ≥ B(a+1)) makes the player ready to
 * ascend again. Everything here is pure so the client and server agree 1:1 — keep
 * it byte-identical with the backend mirror (`domain/game/lib/level.ts`).
 */
export const LEVELS_PER_ASCENSION = 50;
const ASCENSION_BAND_XP_BASE = 50_000_000;
const ASCENSION_BAND_XP_GROWTH = 1.45;
const ASCENSION_BAND_XP_ROUNDING = 5_000_000;
const ASCENSION_LEVEL_WEIGHT_PER_LEVEL = 0.03;
/** Σ_{n=1..50} (1 + 0.03n) = 50 + 0.03 × (50 × 51 / 2) = 88.25. */
export const ASCENSION_TOTAL_WEIGHT =
  LEVELS_PER_ASCENSION +
  ASCENSION_LEVEL_WEIGHT_PER_LEVEL *
    ((LEVELS_PER_ASCENSION * (LEVELS_PER_ASCENSION + 1)) / 2);

/** Total XP required to complete ascension `a`, rounded to the nearest 5M. */
export const bandXp = (ascension: number): number =>
  new Decimal(ASCENSION_BAND_XP_BASE)
    .mul(new Decimal(ASCENSION_BAND_XP_GROWTH).pow(ascension - 1))
    .div(ASCENSION_BAND_XP_ROUNDING)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .mul(ASCENSION_BAND_XP_ROUNDING)
    .toNumber();

/**
 * XP required for within-ascension level `n` (1..50) of ascension `a`. Unrounded
 * so that the 50 levels sum exactly to `bandXp(a)`.
 */
export const levelXp = (ascension: number, n: number): number =>
  (bandXp(ascension) * (1 + ASCENSION_LEVEL_WEIGHT_PER_LEVEL * n)) /
  ASCENSION_TOTAL_WEIGHT;

/** Cumulative XP needed to reach the start (within-level 1) of ascension `a`. */
export const ascensionBaseline = (ascension: number): number => {
  let xp = LEVEL_EXPERIENCE[150];
  for (let b = 1; b < ascension; b++) {
    xp += bandXp(b);
  }
  return xp;
};

export type AscensionLevel = {
  /** Ascension number; 0 = pre-swamp (legacy table level). */
  ascension: number;
  /** Within-ascension level — 0..50 on swamp; 1..maxLevel (legacy) at ascension 0. */
  level: number;
  isReadyToAscend: boolean;
  currentExperienceProgress: number;
  experienceToNextLevel: number;
};

/** A level gate expressed as an (ascension, level) pair. */
export type LevelRequirement = {
  ascension: number;
  level: number;
};

/**
 * Monotonic scalar for an (ascension, level) pair — only for ordering needs
 * (sorting requirements, detecting level-ups). Gates should use
 * `meetsLevelRequirement`; displays should use `.ascension`/`.level`.
 */
export const levelRequirementToTotal = ({
  ascension,
  level,
}: LevelRequirement): number =>
  ascension < 1
    ? level
    : PRE_ASCENSION_MAX_LEVEL + (ascension - 1) * LEVELS_PER_ASCENSION + level;

/**
 * Whether the player's current standing meets an (ascension, level) requirement —
 * a higher ascension always qualifies; within the same ascension the level must be
 * at least the required level.
 */
export const meetsLevelRequirement = (
  current: Pick<AscensionLevel, "ascension" | "level">,
  required: LevelRequirement,
): boolean =>
  current.ascension > required.ascension ||
  (current.ascension === required.ascension && current.level >= required.level);

/**
 * The player's level standing. `ascensionLevel` (`game.island.ascensionLevel`, 0 =
 * pre-swamp) selects the band: at ascension 0 this is the legacy table-based Bumpkin
 * level (1..`maxLevel`); from ascension 1 it is the within-ascension level (0..50),
 * clamped to `LEVELS_PER_ASCENSION` even when banked experience exceeds the band (so a
 * player shows "level 50, ready to ascend" until they actually ascend again). Below a
 * band's level-1 XP the player is shown as level 0 with the XP remaining until level 1.
 */
export const getAscensionLevel = ({
  experience,
  ascensionLevel,
  maxLevel = MAX_BUMPKIN_LEVEL,
}: {
  experience: number;
  ascensionLevel: number;
  maxLevel?: BumpkinLevel;
}): AscensionLevel => {
  // Ascension 0 — pre-swamp legacy progression off the LEVEL_EXPERIENCE table.
  if (ascensionLevel < 1) {
    const level = getBumpkinLevel(experience, maxLevel);
    const { currentExperienceProgress, experienceToNextLevel } =
      getExperienceToNextLevel(experience, maxLevel);
    return {
      ascension: 0,
      level,
      isReadyToAscend: experience >= LEVEL_EXPERIENCE[PRE_ASCENSION_MAX_LEVEL],
      currentExperienceProgress,
      experienceToNextLevel,
    };
  }

  const baseline = ascensionBaseline(ascensionLevel);

  if (experience < baseline) {
    return {
      ascension: ascensionLevel,
      level: 0,
      isReadyToAscend: false,
      currentExperienceProgress: 0,
      experienceToNextLevel: baseline - experience,
    };
  }

  const isReadyToAscend = experience >= baseline + bandXp(ascensionLevel);

  // Walk the cumulative thresholds: level n starts at baseline + Σ_{m<n} levelXp.
  let level = 1;
  let levelStart = baseline;
  for (let n = 1; n < LEVELS_PER_ASCENSION; n++) {
    const nextStart = levelStart + levelXp(ascensionLevel, n);
    if (experience >= nextStart) {
      level = n + 1;
      levelStart = nextStart;
    } else {
      break;
    }
  }

  const span = levelXp(ascensionLevel, level);
  return {
    ascension: ascensionLevel,
    level,
    isReadyToAscend,
    currentExperienceProgress: isReadyToAscend ? span : experience - levelStart,
    experienceToNextLevel: span,
  };
};

/**
 * Total Bumpkin levels earned across the player's whole journey — i.e. the number
 * of skill points granted (1 per level, including ascension band levels).
 * Pre-ascension this is the capped Bumpkin level; after ascending it is the
 * pre-ascension cap (150) + every completed prior band (50 each) + the current
 * within-ascension level. e.g. A1 L1 → 151, A1 L50 → 200, A2 L25 → 225.
 */
export const getTotalBumpkinLevel = ({
  experience,
  ascensionLevel,
  maxLevel,
}: {
  experience: number;
  ascensionLevel: number;
  maxLevel: BumpkinLevel;
}): number => {
  if (ascensionLevel >= 1) {
    return (
      PRE_ASCENSION_MAX_LEVEL +
      (ascensionLevel - 1) * LEVELS_PER_ASCENSION +
      getAscensionLevel({ experience, ascensionLevel }).level
    );
  }
  return getBumpkinLevel(experience, maxLevel);
};
