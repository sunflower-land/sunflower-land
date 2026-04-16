import {
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
  getAgingSlotCount,
} from "./agingFormulas";

describe("getAgingMaxXP", () => {
  it("returns 6× max XP for fish with at most 200 base XP", () => {
    expect(getAgingMaxXP(60)).toBe(360);
    expect(getAgingMaxXP(100)).toBe(600);
    expect(getAgingMaxXP(129)).toBe(774);
    expect(getAgingMaxXP(170)).toBe(1020);
    expect(getAgingMaxXP(200)).toBe(1200);
  });

  it("returns 8× max XP for fish with 201–370 base XP", () => {
    expect(getAgingMaxXP(201)).toBe(1608);
    expect(getAgingMaxXP(270)).toBe(2160);
    expect(getAgingMaxXP(300)).toBe(2400);
    expect(getAgingMaxXP(370)).toBe(2960);
  });

  it("returns 10× max XP for fish with more than 370 base XP", () => {
    expect(getAgingMaxXP(371)).toBe(3710);
    expect(getAgingMaxXP(700)).toBe(7000);
    expect(getAgingMaxXP(1000)).toBe(10000);
  });

  it("handles edge cases at tier boundaries", () => {
    expect(getAgingMaxXP(200)).toBe(1200);
    expect(getAgingMaxXP(201)).toBe(1608);
    expect(getAgingMaxXP(370)).toBe(2960);
    expect(getAgingMaxXP(371)).toBe(3710);
  });
});

describe("getAgingSaltCost", () => {
  it("returns round(maxXP / 100)", () => {
    expect(getAgingSaltCost(60)).toBe(4);
    expect(getAgingSaltCost(100)).toBe(6);
    expect(getAgingSaltCost(170)).toBe(10);
    expect(getAgingSaltCost(1000)).toBe(100);
  });

  it("rounds fractional salt from maxXP", () => {
    expect(getAgingSaltCost(110)).toBe(7); // round(660/100)
    expect(getAgingSaltCost(130)).toBe(8); // round(780/100)
  });
});

describe("getAgingTimeMs", () => {
  it("uses j=300 for fish with at most 200 base XP", () => {
    const ms60 = getAgingTimeMs(60);
    expect(ms60 / (60 * 60 * 1000)).toBeCloseTo(1.0);

    const ms100 = getAgingTimeMs(100);
    expect(ms100 / (60 * 60 * 1000)).toBeCloseTo(1.667, 2);

    const ms200 = getAgingTimeMs(200);
    expect(ms200 / (60 * 60 * 1000)).toBeCloseTo(3.333, 2);
  });

  it("uses j=500 for fish with 201–370 base XP", () => {
    const ms201 = getAgingTimeMs(201);
    expect(ms201 / (60 * 60 * 1000)).toBeCloseTo(2.814, 2);

    const ms270 = getAgingTimeMs(270);
    expect(ms270 / (60 * 60 * 1000)).toBeCloseTo(3.78, 2);

    const ms370 = getAgingTimeMs(370);
    expect(ms370 / (60 * 60 * 1000)).toBeCloseTo(5.18, 2);
  });

  it("uses j=1000 for fish with more than 370 base XP", () => {
    const ms = getAgingTimeMs(1000);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(9.0);

    const ms371 = getAgingTimeMs(371);
    expect(ms371 / (60 * 60 * 1000)).toBeCloseTo(3.339, 2);
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

  it("returns 1 for level 0", () => {
    expect(getAgingSlotCount(0)).toBe(1);
  });
});
