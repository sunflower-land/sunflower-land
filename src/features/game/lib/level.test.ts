import { findLevelRequiredForNextSkillPoint } from "./level";

describe("findLevelRequiredForNextSkillPoint", () => {
  it("returns level 3 if the player has 1 skill points", () => {
    const bumpkinExp = 70;
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(3);
  });
  it("returns level 6 if the player has 3 skill points", () => {
    const bumpkinExp = 1242;
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(6);
  });
  it("returns level 15 if the player has 10 skill points", () => {
    const bumpkinExp = 36500;
    expect(findLevelRequiredForNextSkillPoint(bumpkinExp)).toEqual(15);
  });
});
