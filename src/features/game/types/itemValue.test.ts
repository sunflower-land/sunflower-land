import { BASE_VALUES, getItemValue, hasItemValue } from "./itemValue";
import { CAVE_MERCHANT_LANES } from "./caveMerchant";
import type { InventoryItemName } from "./game";

describe("getItemValue", () => {
  it("prices plants at their sell price", () => {
    expect(getItemValue("Carrot")).toBe(0.8);
    expect(getItemValue("Kale")).toBe(10);
    expect(getItemValue("Rice")).toBe(320);
    expect(getItemValue("Tomato")).toBe(2);
    expect(getItemValue("Grape")).toBe(240);
  });

  it("prices anchors from the table, with Beetles doubling by rarity", () => {
    expect(getItemValue("Crimstone")).toBe(BASE_VALUES.Crimstone);
    expect(getItemValue("Green Beetle")).toBe(60);
    expect(getItemValue("Blue Beetle")).toBe(120);
    expect(getItemValue("Pink Beetle")).toBe(240);
    expect(getItemValue("Amber Beetle")).toBe(480);
    expect(getItemValue("Sunstone")).toBe(
      3 * (getItemValue("Obsidian") as number),
    );
  });

  it("rolls a tool up from its coins and ingredients", () => {
    // Iron Pickaxe: 80 coins + 3 Wood + 5 Iron, no time.
    expect(getItemValue("Iron Pickaxe")).toBe(
      80 + 3 * BASE_VALUES.Wood + 5 * BASE_VALUES.Iron,
    );
  });

  it("prices a Sand Drill by use, not by its recipe", () => {
    expect(getItemValue("Sand Drill")).toBe(BASE_VALUES["Sand Drill"]);
  });

  it("rolls food up through its recipe chain, halved, with a time premium", () => {
    // Cheese: 3 Milk, 20 minutes.
    const cheese = getItemValue("Cheese") as number;
    expect(cheese).toBeCloseTo(
      3 * BASE_VALUES.Milk * (1 + (20 / 1440) * 0.25) * 0.5,
      6,
    );

    // Pizza Margherita: 30 Tomato + 5 Cheese + 20 Wheat, 20 hours.
    const pizza = getItemValue("Pizza Margherita") as number;
    expect(pizza).toBeCloseTo(
      (30 * 2 + 5 * cheese + 20 * 7) * (1 + (20 / 24) * 0.25) * 0.5,
      6,
    );
  });

  it("caps the time premium at double", () => {
    // Nothing cooks for more than four days, so no premium exceeds 2x.
    const value = getItemValue("Pizza Margherita") as number;
    expect(value).toBeLessThan(2 * (30 * 2 + 5 * 300 + 20 * 7));
  });

  it("has no value for items nothing prices", () => {
    expect(getItemValue("Nancy")).toBeUndefined();
    expect(hasItemValue("Nancy")).toBe(false);
    expect(hasItemValue("Carrot")).toBe(true);
  });

  it("prices every Merchant cost lane item", () => {
    Object.values(CAVE_MERCHANT_LANES).forEach(({ items }) =>
      items.forEach((item: InventoryItemName) =>
        expect(getItemValue(item)).toBeGreaterThan(0),
      ),
    );
  });
});
