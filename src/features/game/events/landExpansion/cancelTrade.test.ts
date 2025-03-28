import Decimal from "decimal.js-light";
import { cancelTrade } from "./cancelTrade";
import { TEST_FARM } from "features/game/lib/constants";

describe("cancelTrade", () => {
  it("enures trade exists", () => {
    expect(() =>
      cancelTrade({
        action: {
          tradeId: "123",
          type: "trade.cancelled",
        },
        state: TEST_FARM,
      }),
    ).toThrow("Trade #123 does not exist");
  });

  it("throws if not collectible", () => {
    expect(() =>
      cancelTrade({
        action: {
          tradeId: "123",
          type: "trade.cancelled",
        },
        state: {
          ...TEST_FARM,
          trades: {
            listings: {
              "123": {
                collection: "wearables",
                createdAt: 1000000,
                sfl: 5,
                items: {
                  Parsnip: 10,
                },
                tradeType: "onchain",
              },
            },
          },
        },
      }),
    ).toThrow("Trade #123 is not a collectible");
  });

  it("does not throw if trade is resources", () => {
    expect(() =>
      cancelTrade({
        action: {
          tradeId: "123",
          type: "trade.cancelled",
        },
        state: {
          ...TEST_FARM,
          trades: {
            listings: {
              "123": {
                collection: "resources",
                createdAt: 1000000,
                sfl: 5,
                items: {
                  Parsnip: 10,
                },
                tradeType: "onchain",
              },
            },
          },
        },
      }),
    ).not.toThrow();
  });

  it("enures trade is not bought", () => {
    expect(() =>
      cancelTrade({
        action: {
          tradeId: "123",
          type: "trade.cancelled",
        },
        state: {
          ...TEST_FARM,
          trades: {
            listings: {
              "123": {
                collection: "collectibles",
                createdAt: 1000000,
                sfl: 5,
                items: {
                  Sunflower: 10,
                },
                tradeType: "instant",
                boughtAt: 12000000,
                buyerId: 12,
              },
            },
          },
        },
      }),
    ).toThrow("Trade #123 already bought");
  });

  it("adds items", () => {
    const state = cancelTrade({
      action: {
        tradeId: "123",
        type: "trade.cancelled",
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              createdAt: 1000000,
              sfl: 5,
              items: {
                Sunflower: 10,
              },
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(10));
  });
  it("removes trade", () => {
    const state = cancelTrade({
      action: {
        tradeId: "123",
        type: "trade.cancelled",
      },
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              createdAt: 1000000,
              sfl: 5,
              items: {
                Sunflower: 10,
              },
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.trades.listings).toEqual({});
  });
});
