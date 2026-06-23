import {
  isMaxLevel,
  LEVEL_EXPERIENCE,
  MAX_BUMPKIN_LEVEL,
  bandXp,
  levelXp,
  ascensionBaseline,
  getAscensionLevel,
  LEVELS_PER_ASCENSION,
  ASCENSION_TOTAL_WEIGHT,
} from "./level";

describe("getBumpkinLevel", () => {
  it("returns level 6 if the player is 1 exp away from level 7", () => {
    const bumpkinExp = 2154;
    expect(
      getAscensionLevel({ experience: bumpkinExp, ascensionLevel: 0 }).level,
    ).toEqual(6);
  });
  it("returns level 7 if the player is 0 exp away from level 7", () => {
    const bumpkinExp = 2155;
    expect(
      getAscensionLevel({ experience: bumpkinExp, ascensionLevel: 0 }).level,
    ).toEqual(7);
  });
  it("returns level 7 if the player is 1 exp above level 7", () => {
    const bumpkinExp = 2156;
    expect(
      getAscensionLevel({ experience: bumpkinExp, ascensionLevel: 0 }).level,
    ).toEqual(7);
  });
});

describe("isMaxLevel", () => {
  it("returns false if 1 exp away from max level", () => {
    const bumpkinExp = LEVEL_EXPERIENCE[MAX_BUMPKIN_LEVEL] - 1;
    expect(isMaxLevel(bumpkinExp)).toBeFalsy();
  });
  it("returns false if 0 exp away from max level", () => {
    const bumpkinExp = LEVEL_EXPERIENCE[MAX_BUMPKIN_LEVEL];
    expect(isMaxLevel(bumpkinExp)).toBeTruthy();
  });
  it("returns false if 1 exp above max level", () => {
    const bumpkinExp = LEVEL_EXPERIENCE[MAX_BUMPKIN_LEVEL] + 1;
    expect(isMaxLevel(bumpkinExp)).toBeTruthy();
  });
});

describe("getBumpkinLevel - maxLevel cap", () => {
  it("caps at the provided maxLevel (150)", () => {
    expect(
      getAscensionLevel({
        experience: LEVEL_EXPERIENCE[150],
        ascensionLevel: 0,
        maxLevel: 150,
      }).level,
    ).toEqual(150);
    expect(
      getAscensionLevel({
        experience: 1e15,
        ascensionLevel: 0,
        maxLevel: 150,
      }).level,
    ).toEqual(150);
  });
  it("keeps the legacy 200 cap by default", () => {
    expect(
      getAscensionLevel({ experience: 1e15, ascensionLevel: 0 }).level,
    ).toEqual(200);
  });
  it("treats level 150 as max when capped at 150", () => {
    expect(isMaxLevel(LEVEL_EXPERIENCE[150], 150)).toBeTruthy();
    expect(isMaxLevel(LEVEL_EXPERIENCE[150] - 1, 150)).toBeFalsy();
  });
});

describe("ascension bandXp", () => {
  it("is 50M at ascension 1 and grows ×1.45 rounded to nearest 5M", () => {
    expect(bandXp(1)).toEqual(50_000_000);
    expect(bandXp(2)).toEqual(75_000_000);
    expect(bandXp(3)).toEqual(105_000_000);
    expect(bandXp(4)).toEqual(150_000_000);
    expect(bandXp(5)).toEqual(220_000_000);
    expect(bandXp(6)).toEqual(320_000_000);
  });
});

describe("ascension levelXp", () => {
  it("uses a total weight of 85.75 (49 level-up transitions)", () => {
    expect(ASCENSION_TOTAL_WEIGHT).toBeCloseTo(85.75, 10);
  });
  it("sums to bandXp across the 49 level-up transitions", () => {
    for (const a of [1, 2, 5]) {
      let sum = 0;
      for (let n = 1; n < LEVELS_PER_ASCENSION; n++) sum += levelXp(a, n);
      expect(sum).toBeCloseTo(bandXp(a), 3);
    }
  });
});

describe("ascensionBaseline", () => {
  it("starts at the level-150 experience", () => {
    expect(ascensionBaseline(1)).toEqual(LEVEL_EXPERIENCE[150]);
  });
  it("stacks each prior band so B(a) + bandXp(a) === B(a+1)", () => {
    for (let a = 1; a <= 5; a++) {
      expect(ascensionBaseline(a) + bandXp(a)).toEqual(
        ascensionBaseline(a + 1),
      );
    }
  });
});

describe("getAscensionLevel", () => {
  it("is level 0 below the band baseline, reporting XP until level 1", () => {
    const result = getAscensionLevel({
      experience: ascensionBaseline(1) - 100,
      ascensionLevel: 1,
    });
    expect(result.level).toEqual(0);
    expect(result.isReadyToAscend).toBeFalsy();
    expect(result.experienceToNextLevel).toEqual(100);
  });
  it("is level 1 at the band baseline", () => {
    const result = getAscensionLevel({
      experience: ascensionBaseline(1),
      ascensionLevel: 1,
    });
    expect(result.level).toEqual(1);
    expect(result.currentExperienceProgress).toEqual(0);
  });
  it("advances to level 2 once the level-1 XP is earned", () => {
    const result = getAscensionLevel({
      experience: ascensionBaseline(1) + levelXp(1, 1),
      ascensionLevel: 1,
    });
    expect(result.level).toEqual(2);
  });
  it("is level 49 (not yet 50) just below the band total", () => {
    const result = getAscensionLevel({
      experience: ascensionBaseline(2) - 1,
      ascensionLevel: 1,
    });
    expect(result.level).toEqual(49);
    expect(result.isReadyToAscend).toBeFalsy();
  });
  it("is level 50 and ready to ascend at the band total, with no remaining goal", () => {
    const result = getAscensionLevel({
      experience: ascensionBaseline(2),
      ascensionLevel: 1,
    });
    expect(result.level).toEqual(50);
    expect(result.isReadyToAscend).toBeTruthy();
    expect(result.currentExperienceProgress).toEqual(
      result.experienceToNextLevel,
    );
  });
  it("clamps to level 50 / ready when banked experience exceeds the band", () => {
    const result = getAscensionLevel({
      experience: ascensionBaseline(5),
      ascensionLevel: 1,
    });
    expect(result.level).toEqual(50);
    expect(result.isReadyToAscend).toBeTruthy();
  });
});
