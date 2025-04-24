import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { buyRewardShopItem } from "./buyRewardItem";

describe("buyRewardShopItem", () => {
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
      buyRewardShopItem({
        state: mockState,
        action: {
          type: "rewardItem.bought",
          name: "Non-existent Item" as any,
        },
        createdAt: mockDate,
      }),
    ).toThrow("Item not found in the Love Reward Shop");
  });

  it("throws an error if the player doesn't have enough Love Charm", () => {
    const poorState = {
      ...mockState,
      inventory: {
        "Love Charm": new Decimal(5),
      },
    };
    expect(() =>
      buyRewardShopItem({
        state: poorState,
        action: {
          type: "rewardItem.bought",
          name: "Bronze Love Box",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Insufficient Love Charm");
  });

  it("subtracts Love Charm when buying an item", () => {
    const result = buyRewardShopItem({
      state: mockState,
      action: {
        type: "rewardItem.bought",
        name: "Bronze Love Box",
      },
      createdAt: mockDate,
    });

    expect(result.inventory["Love Charm"]).toEqual(new Decimal(100));
  });

  it("successfully buys a collectible item", () => {
    const result = buyRewardShopItem({
      state: mockState,
      action: {
        type: "rewardItem.bought",
        name: "Basic Bear",
      },
      createdAt: mockDate,
    });

    expect(result.inventory["Basic Bear"]).toEqual(new Decimal(1));
    expect(result.inventory["Love Charm"]).toEqual(new Decimal(150));
  });

  it("successfully buys a wearable item", () => {
    const result = buyRewardShopItem({
      state: mockState,
      action: {
        type: "rewardItem.bought",
        name: "Red Farmer Shirt",
      },
      createdAt: mockDate,
    });

    expect(result.wardrobe["Red Farmer Shirt"]).toEqual(1);
    expect(result.inventory["Love Charm"]).toEqual(new Decimal(180));
  });
});
