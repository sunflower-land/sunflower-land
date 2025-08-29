import { getExperienceToNextLevel } from "./pets";

describe("getExperienceToNextLevel", () => {
  it("should return the correct experience to next level for level 2", () => {
    expect(getExperienceToNextLevel(100)).toMatchObject({
      level: 2,
      xpToNext: 200,
    });
  });

  it("should return the correct experience to next level for level 3", () => {
    expect(getExperienceToNextLevel(300)).toMatchObject({
      level: 3,
      xpToNext: 300,
    });
  });

  it("should return the correct experience to next level for level 4", () => {
    expect(getExperienceToNextLevel(600)).toMatchObject({
      level: 4,
      xpToNext: 400,
    });
  });

  it("should return the correct experience to next level for level 5", () => {
    expect(getExperienceToNextLevel(1000)).toMatchObject({
      level: 5,
      xpToNext: 500,
    });
  });

  it("should return the correct experience to next level for level 6", () => {
    expect(getExperienceToNextLevel(1500)).toMatchObject({
      level: 6,
      xpToNext: 600,
    });
  });

  it("should return the correct experience to next level for level 7", () => {
    expect(getExperienceToNextLevel(2100)).toMatchObject({
      level: 7,
      xpToNext: 700,
    });
  });

  it("should return the correct experience to next level for level 8", () => {
    expect(getExperienceToNextLevel(2800)).toMatchObject({
      level: 8,
      xpToNext: 800,
    });
  });

  it("should return the correct experience to next level for level 9", () => {
    expect(getExperienceToNextLevel(3600)).toMatchObject({
      level: 9,
      xpToNext: 900,
    });
  });

  it("should return the correct experience to next level for level 10", () => {
    expect(getExperienceToNextLevel(4500)).toMatchObject({
      level: 10,
      xpToNext: 1000,
    });
  });

  it("should return the correct experience to next level for level 11", () => {
    expect(getExperienceToNextLevel(5500)).toMatchObject({
      level: 11,
      xpToNext: 1100,
    });
  });

  it("should return the correct experience to next level for level 12", () => {
    expect(getExperienceToNextLevel(6600)).toMatchObject({
      level: 12,
      xpToNext: 1200,
    });
  });

  it("should return the correct experience to next level for level 13", () => {
    expect(getExperienceToNextLevel(7800)).toMatchObject({
      level: 13,
      xpToNext: 1300,
    });
  });

  it("should return the correct experience to next level for level 14", () => {
    expect(getExperienceToNextLevel(9100)).toMatchObject({
      level: 14,
      xpToNext: 1400,
    });
  });

  it("should return the correct experience to next level for level 15", () => {
    expect(getExperienceToNextLevel(10500)).toMatchObject({
      level: 15,
      xpToNext: 1500,
    });
  });

  it("should return the correct experience to next level for level 16", () => {
    expect(getExperienceToNextLevel(12000)).toMatchObject({
      level: 16,
      xpToNext: 1600,
    });
  });

  it("should return the correct experience to next level for level 17", () => {
    expect(getExperienceToNextLevel(13600)).toMatchObject({
      level: 17,
      xpToNext: 1700,
    });
  });

  it("should return the correct experience to next level for level 18", () => {
    expect(getExperienceToNextLevel(15300)).toMatchObject({
      level: 18,
      xpToNext: 1800,
    });
  });

  it("should return the correct experience to next level for level 19", () => {
    expect(getExperienceToNextLevel(17100)).toMatchObject({
      level: 19,
      xpToNext: 1900,
    });
  });

  it("should return the correct experience to next level for level 20", () => {
    expect(getExperienceToNextLevel(19000)).toMatchObject({
      level: 20,
      xpToNext: 2000,
    });
  });

  it("should return the correct experience to next level for level 21", () => {
    expect(getExperienceToNextLevel(21000)).toMatchObject({
      level: 21,
      xpToNext: 2100,
    });
  });

  it("should return the correct experience to next level for level 200", () => {
    expect(getExperienceToNextLevel(1990000)).toMatchObject({
      level: 200,
      xpToNext: undefined,
    });
  });
});
