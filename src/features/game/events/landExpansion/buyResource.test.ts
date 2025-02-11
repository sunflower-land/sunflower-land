import { TEST_FARM } from "features/game/lib/constants";
import { buyResource } from "./buyResource";
import Decimal from "decimal.js-light";

describe("buyResource", () => {
  it("requires resource is for sale", () => {
    expect(() =>
      buyResource({
        state: TEST_FARM,
        action: { type: "resource.bought", name: "Sunstone Rock" },
      }),
    ).toThrow("Resource not for sale");
  });

  it("requires a player has sunstones", () => {
    expect(() =>
      buyResource({
        state: TEST_FARM,
        action: { type: "resource.bought", name: "Crop Plot" },
      }),
    ).toThrow("Not enough sunstones");
  });

  it("buys a plot", () => {
    const state = buyResource({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunstone: new Decimal(100),
        },
      },
      action: { type: "resource.bought", name: "Crop Plot" },
    });

    expect(state.inventory["Crop Plot"]).toEqual(new Decimal(1));
    expect(state.inventory.Sunstone).toEqual(new Decimal(97));
  });

  it("increases bought activity", () => {
    const state = buyResource({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunstone: new Decimal(100),
        },
      },
      action: { type: "resource.bought", name: "Crop Plot" },
    });

    expect(state.farmActivity["Crop Plot Bought"]).toEqual(1);
  });

  it("increases price each time a tree is bought", () => {
    let state = buyResource({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunstone: new Decimal(100),
        },
      },
      action: { type: "resource.bought", name: "Tree" },
    });

    expect(state.inventory["Tree"]).toEqual(new Decimal(1));
    expect(state.inventory.Sunstone).toEqual(new Decimal(96)); // Cost 4

    state = buyResource({
      state,
      action: { type: "resource.bought", name: "Tree" },
    });

    expect(state.inventory["Tree"]).toEqual(new Decimal(2));
    expect(state.inventory.Sunstone).toEqual(new Decimal(89)); // Cost 7

    state = buyResource({
      state,
      action: { type: "resource.bought", name: "Tree" },
    });

    expect(state.inventory["Tree"]).toEqual(new Decimal(3));
    expect(state.inventory.Sunstone).toEqual(new Decimal(79)); // Cost 10
  });
  it("buys a flower bed & beehive", () => {
    const state = buyResource({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunstone: new Decimal(100),
          "Flower Bed": new Decimal(0),
          Beehive: new Decimal(0),
        },
      },
      action: { type: "resource.bought", name: "Flower Bed" },
    });

    expect(state.inventory["Flower Bed"]).toEqual(new Decimal(1));
    expect(state.inventory["Beehive"]).toEqual(new Decimal(1));
    expect(state.inventory.Sunstone).toEqual(new Decimal(70)); // Cost 30
  });
});
