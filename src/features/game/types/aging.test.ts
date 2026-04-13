import {
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
  getAgingSlotCount,
} from "./agingFormulas";

describe("getAgingMaxXP", () => {
  it("returns 6x for fish at most 130 XP", () => {
    expect(getAgingMaxXP(60)).toBe(360);
    expect(getAgingMaxXP(70)).toBe(420);
    expect(getAgingMaxXP(80)).toBe(480);
    expect(getAgingMaxXP(90)).toBe(540);
    expect(getAgingMaxXP(100)).toBe(600);
    expect(getAgingMaxXP(110)).toBe(660);
    expect(getAgingMaxXP(120)).toBe(720);
    expect(getAgingMaxXP(129)).toBe(774);
    expect(getAgingMaxXP(130)).toBe(780);
  });

  it("returns 10x for fish with 131+ XP", () => {
    expect(getAgingMaxXP(131)).toBe(1310);
    expect(getAgingMaxXP(140)).toBe(1400);
    expect(getAgingMaxXP(160)).toBe(1600);
    expect(getAgingMaxXP(170)).toBe(1700);
    expect(getAgingMaxXP(200)).toBe(2000);
    expect(getAgingMaxXP(700)).toBe(7000);
    expect(getAgingMaxXP(1000)).toBe(10000);
  });

  it("handles edge cases at tier boundaries", () => {
    expect(getAgingMaxXP(99)).toBe(594);
    expect(getAgingMaxXP(100)).toBe(600);
    expect(getAgingMaxXP(129)).toBe(774);
    expect(getAgingMaxXP(130)).toBe(780);
    expect(getAgingMaxXP(131)).toBe(1310);
  });
});

describe("getAgingSaltCost", () => {
  it("returns ceil(maxXP / 100)", () => {
    expect(getAgingSaltCost(60)).toBe(4);
    expect(getAgingSaltCost(100)).toBe(6);
    expect(getAgingSaltCost(170)).toBe(17);
    expect(getAgingSaltCost(1000)).toBe(100);
  });

  it("rounds up fractional salt", () => {
    expect(getAgingSaltCost(110)).toBe(7); // ceil(660/100) = 7
    expect(getAgingSaltCost(130)).toBe(8); // ceil(780/100) = 8
  });
});

describe("getAgingTimeMs", () => {
  it("uses j=300 for fish at most 130 XP", () => {
    const ms60 = getAgingTimeMs(60);
    expect(ms60 / (60 * 60 * 1000)).toBeCloseTo(1.0);

    const ms100 = getAgingTimeMs(100);
    expect(ms100 / (60 * 60 * 1000)).toBeCloseTo(1.667, 2);

    const ms130 = getAgingTimeMs(130);
    expect(ms130 / (60 * 60 * 1000)).toBeCloseTo(2.167, 2);
  });

  it("uses j=500 for fish with 131-500 XP", () => {
    const ms = getAgingTimeMs(170);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(3.06, 1);
  });

  it("uses j=1000 for fish with >500 XP", () => {
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

  it("returns 1 for level 0", () => {
    expect(getAgingSlotCount(0)).toBe(1);
  });
});
