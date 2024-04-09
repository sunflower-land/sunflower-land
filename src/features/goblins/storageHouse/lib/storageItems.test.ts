import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { getBankItemsLegacy, getDeliverableItemsLegacy } from "./storageItems";
import { TEST_FARM } from "features/game/lib/constants";

describe("getDeliverableItems", () => {
  it("includes crops", () => {
    const filtered = getDeliverableItemsLegacy({
      Sunflower: new Decimal(1),
      Radish: new Decimal(10.2),
      "Chicken Coop": new Decimal(1),
    });

    expect(filtered).toEqual({
      Sunflower: new Decimal(1),
      Radish: new Decimal(10.2),
    });
  });

  it("includes fruits", () => {
    const filtered = getDeliverableItemsLegacy({
      Apple: new Decimal(5),
      Orange: new Decimal(2),
      Blueberry: new Decimal(3),
      Kuebiko: new Decimal(1),
    });

    expect(filtered).toEqual({
      Apple: new Decimal(5),
      Orange: new Decimal(2),
      Blueberry: new Decimal(3),
    });
  });

  it("includes natural resources", () => {
    const filtered = getDeliverableItemsLegacy({
      Wood: new Decimal(100),
      Gold: new Decimal(15),
    });

    expect(filtered).toEqual({
      Wood: new Decimal(100),
      Gold: new Decimal(15),
    });
  });

  it("filters out chickens", () => {
    const filtered = getDeliverableItemsLegacy({
      Chicken: new Decimal(20),
      Beetroot: new Decimal(100),
    });

    expect(filtered).toEqual({
      Beetroot: new Decimal(100),
    });
  });

  it("excludes rare items", () => {
    const filtered = getDeliverableItemsLegacy({
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

const farm = TEST_FARM;

describe("getBankItems", () => {
  it("filters out crops", () => {
    const filtered = getBankItemsLegacy({
      ...farm,
      inventory: {
        Sunflower: new Decimal(1),
        Radish: new Decimal(10.2),
        "Chicken Coop": new Decimal(1),
      },
    });

    expect(filtered).toEqual({
      "Chicken Coop": new Decimal(1),
    });
  });

  it("filters out fruits", () => {
    const filtered = getBankItemsLegacy({
      ...farm,
      inventory: {
        Apple: new Decimal(1),
        Orange: new Decimal(2),
        Blueberry: new Decimal(3),
        Kuebiko: new Decimal(1),
      },
    });

    expect(filtered).toEqual({
      Kuebiko: new Decimal(1),
    });
  });

  it("filters out natural resources", () => {
    const filtered = getBankItemsLegacy({
      ...farm,
      inventory: {
        Wood: new Decimal(100),
        Gold: new Decimal(15),
      },
    });

    expect(filtered).toEqual({});
  });

  it("include rare items", () => {
    const filtered = getBankItemsLegacy({
      ...farm,
      inventory: {
        Wood: new Decimal(100),
        Gold: new Decimal(15),
        "Farm Cat": new Decimal(1),
        Coder: new Decimal(1),
        "Sunflower Cake": new Decimal(1),
        "Potato Seed": new Decimal(55),
        Potato: new Decimal(500),
      },
    });

    expect(filtered).toEqual({
      "Farm Cat": new Decimal(1),
      Coder: new Decimal(1),
      "Sunflower Cake": new Decimal(1),
      "Potato Seed": new Decimal(55),
    });
  });
});
