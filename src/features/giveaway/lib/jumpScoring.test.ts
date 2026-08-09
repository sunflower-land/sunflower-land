import { jumpQuality, JUMP_HEIGHT, PERFECT_ARC, GOOD_ARC } from "./jumpScoring";

describe("jumpQuality", () => {
  it("grades by distance from the top of the ring", () => {
    expect(jumpQuality(0)).toBe("perfect");
    expect(jumpQuality(PERFECT_ARC)).toBe("perfect");
    expect(jumpQuality((PERFECT_ARC + GOOD_ARC) / 2)).toBe("good");
    expect(jumpQuality(GOOD_ARC + 0.01)).toBe("miss");
  });

  it("is symmetric (sign of the offset doesn't matter)", () => {
    expect(jumpQuality(-0.1)).toBe(jumpQuality(0.1));
    expect(jumpQuality(-1)).toBe("miss");
  });

  it("rewards better timing with more height, but a miss still climbs", () => {
    expect(JUMP_HEIGHT.perfect).toBeGreaterThan(JUMP_HEIGHT.good);
    expect(JUMP_HEIGHT.good).toBeGreaterThan(JUMP_HEIGHT.miss);
    expect(JUMP_HEIGHT.miss).toBeGreaterThan(0);
  });
});
