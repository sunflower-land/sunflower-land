import {
  getBumpkinLevel,
  isMaxLevel,
  LEVEL_EXPERIENCE,
  MAX_BUMPKIN_LEVEL,
} from "./level";

describe("getBumpkinLevel", () => {
  it("returns level 6 if the player is 1 exp away from level 7", () => {
    const bumpkinExp = 2154;
    expect(Number(getBumpkinLevel(bumpkinExp))).toEqual(6);
  });
  it("returns level 7 if the player is 0 exp away from level 7", () => {
    const bumpkinExp = 2155;
    expect(Number(getBumpkinLevel(bumpkinExp))).toEqual(7);
  });
  it("returns level 7 if the player is 1 exp above level 7", () => {
    const bumpkinExp = 2156;
    expect(Number(getBumpkinLevel(bumpkinExp))).toEqual(7);
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
