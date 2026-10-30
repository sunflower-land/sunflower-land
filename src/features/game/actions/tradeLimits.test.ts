import {
  CAVE_DWELLERS_TRADE_RESOURCES,
  isCaveDwellersTradeResource,
  isTradeResource,
  TRADE_LIMITS,
  TRADE_MINIMUMS,
} from "./tradeLimits";

describe("Cave Dwellers resources", () => {
  const items = [
    "Green Beetle",
    "Blue Beetle",
    "Pink Beetle",
    "Amber Beetle",
    "Pig Bristles",
    "Truffle",
  ] as const;

  it("lists the four Beetles, Pig Bristles and Truffle as trade resources", () => {
    expect(CAVE_DWELLERS_TRADE_RESOURCES).toEqual(items);

    items.forEach((item) => {
      expect(isTradeResource(item)).toBe(true);
      expect(isCaveDwellersTradeResource(item)).toBe(true);
      expect(TRADE_LIMITS[item]).toBeGreaterThan(0);
      expect(TRADE_MINIMUMS[item]).toBeGreaterThan(0);
      expect(TRADE_MINIMUMS[item]).toBeLessThanOrEqual(TRADE_LIMITS[item]);
    });
  });

  it("keeps Mud non-tradable", () => {
    expect("Mud" in TRADE_LIMITS).toBe(false);
    expect(isTradeResource("Mud")).toBe(false);
  });

  it("does not treat the older resources as Cave Dwellers resources", () => {
    expect(isCaveDwellersTradeResource("Wood")).toBe(false);
    expect(isCaveDwellersTradeResource("Leather")).toBe(false);
  });
});
