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

  it("throws an error if the player doesn't have enough SFL", () => {
    const poorState = { ...mockState, balance: new Decimal(0) };
    expect(() =>
      buySeasonalItem({
        state: poorState,
        action: {
          type: "seasonalItem.bought",
          name: "Treasure Key",
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Insufficient SFL");
  });

  it("throws an error if the player doesn't have enough items", () => {
    const lowInventoryState = {
      ...mockState,
      inventory: { Wood: new Decimal(0) },
    };
    expect(() =>
      buySeasonalItem({
        state: lowInventoryState,
        action: {
          type: "seasonalItem.bought",
          name: "Basic Bear",
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Insufficient Wood");
  });

  it("should return 992.5 when inventory has Witches' Eve Banner", () => {
    // Date during Witches' Eve Season
    const mockedDate = new Date(2023, 8, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    const state = {
      ...mockState,
      inventory: {
        "Witches' Eve Banner": new Decimal(1),
        Wood: new Decimal(100),
      },
    };
    const result = buySeasonalItem({
      state: state,
      action: {
        type: "seasonalItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: mockDate,
    });
    expect(result.balance).toEqual(new Decimal(992.5));
  });

  it("subtracts SFL when buying an item", () => {
    const result = buySeasonalItem({
      state: mockState,
      action: {
        type: "seasonalItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.balance).toEqual(new Decimal(990));
  });

  it("subtracts items when buying an item", () => {
    const result = buySeasonalItem({
      state: mockState,
      action: {
        type: "seasonalItem.bought",
        name: "Basic Bear",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.inventory.Wood).toEqual(new Decimal(99));
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

  it("throws an error if key already bought today", () => {
    expect(() =>
      buySeasonalItem({
        state: {
          ...mockState,
          inventory: {
            "Treasure Key": new Decimal(0),
            Wood: new Decimal(100),
          },
          pumpkinPlaza: {
            keysBought: {
              factionShop: {},
              treasureShop: {},
              megastore: {
                "Treasure Key": { boughtAt: new Date("2024-08-09").getTime() },
              },
            },
          },
        },
        action: {
          type: "seasonalItem.bought",
          name: "Treasure Key",
          tier: "basic",
        },
        createdAt: new Date("2024-08-09").getTime(),
      }),
    ).toThrow("Already bought today");
  });

  it("updates createdAt when key is bought", () => {
    const state = buySeasonalItem({
      state: {
        ...mockState,
        inventory: {
          "Treasure Key": new Decimal(0),
          Wood: new Decimal(100),
        },
      },
      action: {
        type: "seasonalItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: new Date("2024-09-01").getTime(),
    });
    expect(state.inventory["Treasure Key"]).toStrictEqual(new Decimal(1));
    expect(state.inventory.Wood).toStrictEqual(new Decimal(0));
    expect(
      state.pumpkinPlaza.keysBought?.megastore["Treasure Key"]?.boughtAt,
    ).toEqual(new Date("2024-09-01").getTime());
  });
});
