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
          megastore: {
            boughtAt: {
              "Treasure Key": new Date("2024-08-09").getTime(),
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
    ).toThrow("Item cannot be bought while in cooldown");
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
    expect(state.megastore?.boughtAt["Treasure Key"]).toEqual(
      new Date("2024-09-01").getTime(),
    );
  });

  it("throws an error if Acorn House item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buySeasonalItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            "Acorn House": new Decimal(0),
          },
          farmActivity: { "Acorn House Bought": 1 },
        },
        action: {
          type: "seasonalItem.bought",
          name: "Acorn House",
          tier: "basic",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  it("does not throw an error if Treasure Key item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    const state = buySeasonalItem({
      state: {
        ...mockState,
        balance: new Decimal(5),
        inventory: {
          "Treasure Key": new Decimal(1),
          Timeshard: new Decimal(300),
        },
        farmActivity: {
          "Treasure Key Bought": 1,
        },
      },
      action: {
        type: "seasonalItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });
    expect(state.inventory["Treasure Key"]).toStrictEqual(new Decimal(2));
    expect(state.farmActivity["Treasure Key Bought"])?.toEqual(2);
    expect(state.inventory["Timeshard"]).toStrictEqual(new Decimal(100));
  });

  it("throws an error if Igloo item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buySeasonalItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            Timeshard: new Decimal(600),
          },
          farmActivity: {
            "Acorn House Bought": 1,
            "Kite Bought": 1,
            "Spring Duckling Bought": 1,
            "Acorn Hat Bought": 1,
            "Igloo Bought": 1,
          },
        },
        action: {
          type: "seasonalItem.bought",
          name: "Igloo",
          tier: "rare",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  it("does not throw an error if Rare Key item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    const state = buySeasonalItem({
      state: {
        ...mockState,
        balance: new Decimal(5),
        inventory: {
          Timeshard: new Decimal(600),
          "Rare Key": new Decimal(1),
        },
        farmActivity: {
          "Acorn House Bought": 1,
          "Kite Bought": 1,
          "Spring Duckling Bought": 1,
          "Acorn Hat Bought": 1,
          "Rare Key Bought": 1,
        },
      },
      action: {
        type: "seasonalItem.bought",
        name: "Rare Key",
        tier: "rare",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });
    expect(state.inventory["Rare Key"]).toStrictEqual(new Decimal(2));
    expect(state.farmActivity["Rare Key Bought"])?.toEqual(2);
  });

  it("throws an error if Mammoth item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buySeasonalItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            Timeshard: new Decimal(2000),
          },
          farmActivity: {
            "Acorn House Bought": 1,
            "Kite Bought": 1,
            "Spring Duckling Bought": 1,
            "Acorn Hat Bought": 1,
            "Igloo Bought": 1,
            "Ladybug Suit Bought": 1,
            "Ugly Duckling Bought": 1,
            "Lake Rug Bought": 1,
            "Mammoth Bought": 1,
          },
        },
        action: {
          type: "seasonalItem.bought",
          name: "Mammoth",
          tier: "epic",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  it("does not throw an error if Luxury Key item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    const state = buySeasonalItem({
      state: {
        ...mockState,
        balance: new Decimal(5),
        inventory: {
          Timeshard: new Decimal(1000),
          "Luxury Key": new Decimal(1),
        },
        farmActivity: {
          "Acorn House Bought": 1,
          "Kite Bought": 1,
          "Spring Duckling Bought": 1,
          "Acorn Hat Bought": 1,
          "Igloo Bought": 1,
          "Ladybug Suit Bought": 1,
          "Ugly Duckling Bought": 1,
          "Lake Rug Bought": 1,
          "Mammoth Bought": 1,
          "Luxury Key Bought": 1,
        },
      },
      action: {
        type: "seasonalItem.bought",
        name: "Luxury Key",
        tier: "epic",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });
    expect(state.inventory["Luxury Key"]).toStrictEqual(new Decimal(2));
    expect(state.farmActivity["Luxury Key Bought"])?.toEqual(2);
  });

  it("throws an error if Sickle item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buySeasonalItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            Timeshard: new Decimal(4500),
          },
          farmActivity: {
            "Acorn House Bought": 1,
            "Kite Bought": 1,
            "Spring Duckling Bought": 1,
            "Acorn Hat Bought": 1,
            "Igloo Bought": 1,
            "Ladybug Suit Bought": 1,
            "Ugly Duckling Bought": 1,
            "Lake Rug Bought": 1,
            "Mammoth Bought": 1,
            "Hammock Bought": 1,
            "Crab Hat Bought": 1,
            "Cup of Chocolate Bought": 1,
            "Sickle Bought": 1,
          },
        },
        action: {
          type: "seasonalItem.bought",
          name: "Sickle",
          tier: "mega",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });
});
