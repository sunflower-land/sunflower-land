import {
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
  getAgingSlotCount,
} from "./agingFormulas";

describe("getAgingMaxXP", () => {
  it("returns 3× base XP for fish with at most 200 base XP", () => {
    expect(getAgingMaxXP(60)).toBe(180);
    expect(getAgingMaxXP(100)).toBe(300);
    expect(getAgingMaxXP(129)).toBe(387);
    expect(getAgingMaxXP(170)).toBe(510);
    expect(getAgingMaxXP(200)).toBe(600);
  });

  it("returns 4× base XP for fish with 201–330 base XP", () => {
    expect(getAgingMaxXP(201)).toBe(804);
    expect(getAgingMaxXP(270)).toBe(1080);
    expect(getAgingMaxXP(300)).toBe(1200);
    expect(getAgingMaxXP(330)).toBe(1320);
  });

  it("returns 5× base XP for fish with more than 330 base XP", () => {
    expect(getAgingMaxXP(331)).toBe(1655);
    expect(getAgingMaxXP(371)).toBe(1855);
    expect(getAgingMaxXP(700)).toBe(3500);
    expect(getAgingMaxXP(1000)).toBe(5000);
  });

  it("handles edge cases at tier boundaries", () => {
    expect(getAgingMaxXP(200)).toBe(600);
    expect(getAgingMaxXP(201)).toBe(804);
    expect(getAgingMaxXP(330)).toBe(1320);
    expect(getAgingMaxXP(331)).toBe(1655);
  });
});

describe("getAgingSaltCost", () => {
  it("returns round(maxXP / 50)", () => {
    expect(getAgingSaltCost(60)).toBe(4);
    expect(getAgingSaltCost(100)).toBe(6);
    expect(getAgingSaltCost(170)).toBe(10);
    expect(getAgingSaltCost(1000)).toBe(100);
  });

  it("rounds fractional salt from maxXP", () => {
    expect(getAgingSaltCost(110)).toBe(7); // round(330/50)
    expect(getAgingSaltCost(130)).toBe(8); // round(390/50)
  });
});

describe("getAgingTimeMs", () => {
  it("uses j=300 for fish with at most 200 base XP", () => {
    const ms60 = getAgingTimeMs(60);
    expect(ms60 / (60 * 60 * 1000)).toBeCloseTo(0.4);

    const ms100 = getAgingTimeMs(100);
    expect(ms100 / (60 * 60 * 1000)).toBeCloseTo(0.667, 2);

    const ms200 = getAgingTimeMs(200);
    expect(ms200 / (60 * 60 * 1000)).toBeCloseTo(1.333, 2);
  });

  it("uses j=500 for fish with 201–330 base XP", () => {
    const ms201 = getAgingTimeMs(201);
    expect(ms201 / (60 * 60 * 1000)).toBeCloseTo(1.206, 2);

    const ms270 = getAgingTimeMs(270);
    expect(ms270 / (60 * 60 * 1000)).toBeCloseTo(1.62, 2);

    const ms330 = getAgingTimeMs(330);
    expect(ms330 / (60 * 60 * 1000)).toBeCloseTo(1.98, 2);
  });

  it("uses j=1000 for fish with more than 330 base XP", () => {
    const ms = getAgingTimeMs(1000);
    const hours = ms / (60 * 60 * 1000);
    expect(hours).toBeCloseTo(4.0);

    const ms371 = getAgingTimeMs(371);
    expect(ms371 / (60 * 60 * 1000)).toBeCloseTo(1.484, 2);
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
