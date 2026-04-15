import {
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
  getAgingSlotCount,
} from "./agingFormulas";

describe("getAgingMaxXP", () => {
  it("returns 6x for fish at most 100 XP", () => {
    expect(getAgingMaxXP(60)).toBe(360);
    expect(getAgingMaxXP(70)).toBe(420);
    expect(getAgingMaxXP(80)).toBe(480);
    expect(getAgingMaxXP(90)).toBe(540);
    expect(getAgingMaxXP(100)).toBe(600);
  });

  it("returns 8x for fish with 101-270 XP", () => {
    expect(getAgingMaxXP(110)).toBe(880);
    expect(getAgingMaxXP(120)).toBe(960);
    expect(getAgingMaxXP(129)).toBe(1032);
    expect(getAgingMaxXP(130)).toBe(1040);
    expect(getAgingMaxXP(131)).toBe(1048);
    expect(getAgingMaxXP(140)).toBe(1120);
    expect(getAgingMaxXP(160)).toBe(1280);
    expect(getAgingMaxXP(170)).toBe(1360);
    expect(getAgingMaxXP(200)).toBe(1600);
    expect(getAgingMaxXP(270)).toBe(2160);
  });

  it("returns 10x for fish with 271+ XP", () => {
    expect(getAgingMaxXP(271)).toBe(2710);
    expect(getAgingMaxXP(700)).toBe(7000);
    expect(getAgingMaxXP(1000)).toBe(10000);
  });

  it("handles edge cases at tier boundaries", () => {
    expect(getAgingMaxXP(99)).toBe(594);
    expect(getAgingMaxXP(100)).toBe(600);
    expect(getAgingMaxXP(101)).toBe(808);
    expect(getAgingMaxXP(129)).toBe(1032);
    expect(getAgingMaxXP(130)).toBe(1040);
    expect(getAgingMaxXP(270)).toBe(2160);
    expect(getAgingMaxXP(271)).toBe(2710);
  });
});

describe("getAgingSaltCost", () => {
  it("returns round(maxXP / 100)", () => {
    expect(getAgingSaltCost(60)).toBe(4);
    expect(getAgingSaltCost(100)).toBe(6);
    expect(getAgingSaltCost(170)).toBe(14);
    expect(getAgingSaltCost(1000)).toBe(100);
  });

  it("rounds fractional salt from maxXP", () => {
    expect(getAgingSaltCost(110)).toBe(9); // round(880/100)
    expect(getAgingSaltCost(130)).toBe(10); // round(1040/100)
  });
});

describe("getAgingTimeMs", () => {
  it("uses j=300 for fish at most 100 XP", () => {
    const ms60 = getAgingTimeMs(60);
    expect(ms60 / (60 * 60 * 1000)).toBeCloseTo(1.0);

    const ms100 = getAgingTimeMs(100);
    expect(ms100 / (60 * 60 * 1000)).toBeCloseTo(1.667, 2);
  });

  it("uses j=500 for fish with 101-270 XP", () => {
    const ms130 = getAgingTimeMs(130);
    expect(ms130 / (60 * 60 * 1000)).toBeCloseTo(1.82, 2);

    const ms = getAgingTimeMs(170);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(2.38, 2);
  });

  it("uses j=1000 for fish with >270 XP", () => {
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
