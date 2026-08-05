import { getStampedAgerLevel } from "./agingShed";

describe("getStampedAgerLevel", () => {
  it("returns 0 for a job with no stamp", () => {
    expect(getStampedAgerLevel(undefined)).toBe(0);
    expect(getStampedAgerLevel({})).toBe(0);
  });

  it("treats a legacy `true` stamp as rank 1", () => {
    // Jobs started before Ager was upgradeable stored a boolean. They were
    // charged the rank-1 2x inputs, so they must collect at rank 1.
    expect(getStampedAgerLevel({ Ager: true })).toBe(1);
  });

  it("treats a legacy `false` stamp as not applied", () => {
    expect(getStampedAgerLevel({ Ager: false })).toBe(0);
  });

  it("returns the stamped rank for new jobs", () => {
    expect(getStampedAgerLevel({ Ager: 1 })).toBe(1);
    expect(getStampedAgerLevel({ Ager: 2 })).toBe(2);
    expect(getStampedAgerLevel({ Ager: 3 })).toBe(3);
  });
});
