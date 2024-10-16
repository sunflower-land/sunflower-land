import Decimal from "decimal.js-light";
import { buySeasonalItem } from "./buySeasonalItem";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

describe("buySeasonalItem", () => {
  const mockState: GameState = {
    ...TEST_FARM,
    balance: new Decimal(1000),
    inventory: {
      Wood: new Decimal(100),
    },
    wardrobe: {},
  };

  const mockDate = new Date("2024-08-01T00:00:00Z").getTime();

  // Remove beforeEach and afterEach hooks

  it("throws an error if the item is not found in the seasonal store", () => {
    expect(() =>
      buySeasonalItem({
        state: mockState,
        action: {
          type: "seasonalItem.bought",
          name: "Non-existent Item" as any,
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Item not found in the seasonal store");
  });

  // Update all other test cases to include the date parameter
  // For example:

  it("throws an error if the item has already been crafted (collectible)", () => {
    const stateCopy = {
      ...mockState,
      inventory: {
        ...mockState.inventory,
        "Basic Bear": new Decimal(1),
      },
    };

    expect(() =>
      buySeasonalItem({
        state: stateCopy,
        action: {
          type: "seasonalItem.bought",
          name: "Basic Bear",
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("This item has already been crafted");
  });

  it("successfully buys a collectible item", () => {
    const result = buySeasonalItem({
      state: mockState,
      action: {
        type: "seasonalItem.bought",
        name: "Basic Bear",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.inventory["Basic Bear"]).toEqual(new Decimal(1));
  });

  it("successfully buys a wearable item", () => {
    const result = buySeasonalItem({
      state: mockState,
      action: {
        type: "seasonalItem.bought",
        name: "Red Farmer Shirt",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.wardrobe["Red Farmer Shirt"]).toEqual(1);
  });
});
