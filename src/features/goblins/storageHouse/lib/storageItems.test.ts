import Decimal from "decimal.js-light";
import { getDeliverableItems } from "./storageItems";

describe("getDeliverableItems", () => {
  it("includes crops", () => {
    const filtered = getDeliverableItems({
      Sunflower: new Decimal(1),
      Radish: new Decimal(10.2),
      "Chicken Coop": new Decimal(1),
    });

    expect(filtered).toEqual({
      Sunflower: new Decimal(1),
      Radish: new Decimal(10.2),
    });
  });

  it("includes natural resources", () => {
    const filtered = getDeliverableItems({
      Wood: new Decimal(100),
      Gold: new Decimal(15),
    });

    expect(filtered).toEqual({
      Wood: new Decimal(100),
      Gold: new Decimal(15),
    });
  });

  it("filters out chickens", () => {
    const filtered = getDeliverableItems({
      Chicken: new Decimal(20),
      Beetroot: new Decimal(100),
    });

    expect(filtered).toEqual({
      Beetroot: new Decimal(100),
    });
  });

  it("excludes rare items", () => {
    const filtered = getDeliverableItems({
      Wood: new Decimal(100),
      Gold: new Decimal(15),
      "Farm Cat": new Decimal(1),
      Coder: new Decimal(1),
      "Sunflower Cake": new Decimal(1),
      "Potato Seed": new Decimal(55),
      Potato: new Decimal(500),
    });

    expect(filtered).toEqual({
      Wood: new Decimal(100),
      Gold: new Decimal(15),
      Potato: new Decimal(500),
    });
  });
});
