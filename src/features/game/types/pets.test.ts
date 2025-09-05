import { getPetLevel } from "./pets";

describe("getPetLevel", () => {
  it("should return the correct experience to next level for level 2", () => {
    expect(getPetLevel(100)).toMatchObject({
      level: 2,
      experienceBetweenLevels: 200,
    });
  });

  it("should return the correct experience to next level for level 3", () => {
    expect(getPetLevel(300)).toMatchObject({
      level: 3,
      experienceBetweenLevels: 300,
    });
  });

  it("should return the correct experience to next level for level 4", () => {
    expect(getPetLevel(600)).toMatchObject({
      level: 4,
      experienceBetweenLevels: 400,
    });
  });

  it("should return the correct experience to next level for level 5", () => {
    expect(getPetLevel(1000)).toMatchObject({
      level: 5,
      experienceBetweenLevels: 500,
    });
  });

  it("should return the correct experience to next level for level 6", () => {
    expect(getPetLevel(1500)).toMatchObject({
      level: 6,
      experienceBetweenLevels: 600,
    });
  });

  it("should return the correct experience to next level for level 7", () => {
    expect(getPetLevel(2100)).toMatchObject({
      level: 7,
      experienceBetweenLevels: 700,
    });
  });

  it("should return the correct experience to next level for level 8", () => {
    expect(getPetLevel(2800)).toMatchObject({
      level: 8,
      experienceBetweenLevels: 800,
    });
  });

  it("should return the correct experience to next level for level 9", () => {
    expect(getPetLevel(3600)).toMatchObject({
      level: 9,
      experienceBetweenLevels: 900,
    });
  });

  it("should return the correct experience to next level for level 10", () => {
    expect(getPetLevel(4500)).toMatchObject({
      level: 10,
      experienceBetweenLevels: 1000,
    });
  });

  it("should return the correct experience to next level for level 11", () => {
    expect(getPetLevel(5500)).toMatchObject({
      level: 11,
      experienceBetweenLevels: 1100,
    });
  });

  it("should return the correct experience to next level for level 12", () => {
    expect(getPetLevel(6600)).toMatchObject({
      level: 12,
      experienceBetweenLevels: 1200,
    });
  });

  it("should return the correct experience to next level for level 13", () => {
    expect(getPetLevel(7800)).toMatchObject({
      level: 13,
      experienceBetweenLevels: 1300,
    });
  });

  it("should return the correct experience to next level for level 14", () => {
    expect(getPetLevel(9100)).toMatchObject({
      level: 14,
      experienceBetweenLevels: 1400,
    });
  });

  it("should return the correct experience to next level for level 15", () => {
    expect(getPetLevel(10500)).toMatchObject({
      level: 15,
      experienceBetweenLevels: 1500,
    });
  });

  it("should return the correct experience to next level for level 16", () => {
    expect(getPetLevel(12000)).toMatchObject({
      level: 16,
      experienceBetweenLevels: 1600,
    });
  });

  it("should return the correct experience to next level for level 17", () => {
    expect(getPetLevel(13600)).toMatchObject({
      level: 17,
      experienceBetweenLevels: 1700,
    });
  });

  it("should return the correct experience to next level for level 18", () => {
    expect(getPetLevel(15300)).toMatchObject({
      level: 18,
      experienceBetweenLevels: 1800,
    });
  });

  it("should return the correct experience to next level for level 19", () => {
    expect(getPetLevel(17100)).toMatchObject({
      level: 19,
      experienceBetweenLevels: 1900,
    });
  });

  it("should return the correct experience to next level for level 20", () => {
    expect(getPetLevel(19000)).toMatchObject({
      level: 20,
      experienceBetweenLevels: 2000,
    });
  });

  it("should return the correct experience to next level for level 21", () => {
    expect(getPetLevel(21000)).toMatchObject({
      level: 21,
      experienceBetweenLevels: 2100,
    });
  });
});
