import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { buyFloatingShopItem } from "./buyFloatingShopItem";

describe("buyFloatingShopItem", () => {
  const mockState: GameState = {
    ...TEST_FARM,
    inventory: {
      "Love Charm": new Decimal(200),
    },
    wardrobe: {},
  };

  const mockDate = new Date("2024-08-01T00:00:00Z").getTime();

  it("throws an error if the item is not found in the Love Reward Shop", () => {
    expect(() =>
      buyFloatingShopItem({
        state: mockState,
        action: {
          type: "floatingShopItem.bought",
          name: "Non-existent Item" as any,
        },
        createdAt: mockDate,
      }),
    ).toThrow("Item not found in the Love Reward Shop");
  });

  it("throws an error if the player doesn't have enough Love Charm", () => {
    const poorState: GameState = {
      ...mockState,
      inventory: {
        "Love Charm": new Decimal(5),
      },
      floatingIsland: {
        schedule: [],
        shop: {
          "Bronze Love Box": {
            type: "collectible",
            name: "Bronze Love Box",
            cost: {
              items: {
                "Love Charm": 100,
              },
            },
          },
        },
      },
    };
    expect(() =>
      buyFloatingShopItem({
        state: poorState,
        action: {
          type: "floatingShopItem.bought",
          name: "Bronze Love Box",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Insufficient Love Charm");
  });

  it("subtracts Love Charm when buying an item", () => {
    const result = buyFloatingShopItem({
      state: {
        ...mockState,
        floatingIsland: {
          schedule: [],
          shop: {
            "Bronze Love Box": {
              type: "collectible",
              name: "Bronze Love Box",
              cost: {
                items: {
                  "Love Charm": 100,
                },
              },
            },
          },
        },
      },
      action: {
        type: "floatingShopItem.bought",
        name: "Bronze Love Box",
      },
      createdAt: mockDate,
    });

    expect(result.inventory["Love Charm"]).toEqual(new Decimal(100));
  });

  describe("pet egg", () => {
    it("does not throw an error for pet egg", () => {
      expect(() =>
        buyFloatingShopItem({
          state: {
            ...mockState,
            inventory: {
              "Love Charm": new Decimal(10000),
            },
          },
          action: {
            type: "floatingShopItem.bought",
            name: "Pet Egg",
          },
          createdAt: mockDate,
        }),
      ).not.toThrow();
    });

    it("throws an error if the player has already bought the pet egg", () => {
      expect(() =>
        buyFloatingShopItem({
          state: {
            ...mockState,
            floatingIsland: {
              ...mockState.floatingIsland,
              boughtAt: {
                "Pet Egg": 1,
              },
            },
            inventory: {
              "Love Charm": new Decimal(1500),
            },
          },
          action: {
            type: "floatingShopItem.bought",
            name: "Pet Egg",
          },
        }),
      ).toThrow("Pet Egg can only be bought once");
    });

    it("buys the pet egg", () => {
      const result = buyFloatingShopItem({
        state: {
          ...mockState,
          inventory: {
            "Love Charm": new Decimal(10000),
          },
        },
        action: {
          type: "floatingShopItem.bought",
          name: "Pet Egg",
        },
        createdAt: mockDate,
      });
      expect(result.inventory["Love Charm"]).toEqual(new Decimal(0));
      expect(result.floatingIsland.boughtAt).toEqual({
        "Pet Egg": mockDate,
      });
    });
  });
});
