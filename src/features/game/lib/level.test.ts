import {
  findLevelRequiredForNextSkillPoint,
  getBumpkinLevel,
  isMaxLevel,
} from "./level";

describe("findLevelRequiredForNextSkillPoint", () => {
  it("returns level 3 if the player has 1 skill points", () => {
    const bumpkinExp = 5; // level 2
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(3);
  });
  it("returns level 4 if the player has 2 skill points", () => {
    const bumpkinExp = 70; // level 3
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(4);
  });
  it("returns level 6 if the player has 3 skill points", () => {
    const bumpkinExp = 1242; // level 5
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(6);
  });
  it("returns level 15 if the player has 10 skill points", () => {
    const bumpkinExp = 36500; // level 14
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(15);
  });
  it("returns level 19 if the player has 10 skill points", () => {
    const bumpkinExp = 60500; // level 17
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(19);
  });
});

describe("getBumpkinLevel", () => {
  it("returns level 6 if the player is 1 exp away from level 7", () => {
    const bumpkinExp = 3399;
    expect(Number(getBumpkinLevel(bumpkinExp))).toEqual(6);
  });
  it("returns level 7 if the player is 0 exp away from level 7", () => {
    const bumpkinExp = 4582;
    expect(Number(getBumpkinLevel(bumpkinExp))).toEqual(7);
  });
  it("returns level 7 if the player is 1 exp above level 7", () => {
    const bumpkinExp = 4583;
    expect(Number(getBumpkinLevel(bumpkinExp))).toEqual(7);
  });
});

describe("isMaxLevel", () => {
  it("returns false if 1 exp away from max level", () => {
    const bumpkinExp = 89999;
    expect(isMaxLevel(bumpkinExp)).toBeFalsy();
  });
  it("returns false if 0 exp away from max level", () => {
    const bumpkinExp = 9015500;
    expect(isMaxLevel(bumpkinExp)).toBeTruthy();
  });
  it("returns false if 1 exp above max level", () => {
    const bumpkinExp = 9015501;
    expect(isMaxLevel(bumpkinExp)).toBeTruthy();
  });
});
