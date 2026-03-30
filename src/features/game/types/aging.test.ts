import {
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
  getAgingSlotCount,
} from "./agingFormulas";

describe("getAgingMaxXP", () => {
  it("returns 5x for fish below 100 XP", () => {
    expect(getAgingMaxXP(60)).toBe(300);
    expect(getAgingMaxXP(70)).toBe(350);
    expect(getAgingMaxXP(80)).toBe(400);
    expect(getAgingMaxXP(90)).toBe(450);
  });

  it("returns 6x for fish with 100-160 XP", () => {
    expect(getAgingMaxXP(100)).toBe(600);
    expect(getAgingMaxXP(110)).toBe(660);
    expect(getAgingMaxXP(120)).toBe(720);
    expect(getAgingMaxXP(130)).toBe(780);
    expect(getAgingMaxXP(140)).toBe(840);
    expect(getAgingMaxXP(150)).toBe(900);
    expect(getAgingMaxXP(160)).toBe(960);
  });

  it("returns 10x for fish above 160 XP", () => {
    expect(getAgingMaxXP(170)).toBe(1700);
    expect(getAgingMaxXP(200)).toBe(2000);
    expect(getAgingMaxXP(700)).toBe(7000);
    expect(getAgingMaxXP(1000)).toBe(10000);
  });

  it("handles edge cases at tier boundaries", () => {
    expect(getAgingMaxXP(99)).toBe(495);
    expect(getAgingMaxXP(100)).toBe(600);
    expect(getAgingMaxXP(160)).toBe(960);
    expect(getAgingMaxXP(161)).toBe(1610);
  });
});

describe("getAgingSaltCost", () => {
  it("returns ceil(maxXP / 25)", () => {
    expect(getAgingSaltCost(60)).toBe(12);
    expect(getAgingSaltCost(100)).toBe(24);
    expect(getAgingSaltCost(170)).toBe(68);
    expect(getAgingSaltCost(1000)).toBe(400);
  });

  it("rounds up fractional salt", () => {
    expect(getAgingSaltCost(110)).toBe(27); // ceil(660/25) = ceil(26.4) = 27
    expect(getAgingSaltCost(130)).toBe(32); // ceil(780/25) = ceil(31.2) = 32
  });
});

describe("getAgingTimeMs", () => {
  it("uses j=200 for fish below 100 XP", () => {
    const ms = getAgingTimeMs(60);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(1.2);
  });

  it("uses j=300 for fish with 100-160 XP", () => {
    const ms = getAgingTimeMs(100);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(1.667, 2);
  });

  it("uses j=500 for fish with 161-999 XP", () => {
    const ms = getAgingTimeMs(170);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(3.06, 1);
  });

  it("uses j=1000 for fish with >=1000 XP", () => {
    const ms = getAgingTimeMs(1000);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(9.0);
  });
});

describe("getAgingSlotCount", () => {
  it("returns correct slots per level", () => {
    expect(getAgingSlotCount(1)).toBe(1);
    expect(getAgingSlotCount(2)).toBe(2);
    expect(getAgingSlotCount(3)).toBe(3);
    expect(getAgingSlotCount(4)).toBe(4);
    expect(getAgingSlotCount(5)).toBe(5);
    expect(getAgingSlotCount(6)).toBe(6);
  });

  it("returns 0 for level 0", () => {
    expect(getAgingSlotCount(0)).toBe(0);
  });
});
