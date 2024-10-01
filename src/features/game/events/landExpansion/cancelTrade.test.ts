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
            tradePoints: 0,
            listings: {
              "123": {
                createdAt: 1000000,
                sfl: 5,
                items: {
                  Sunflower: 10,
                },
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
          tradePoints: 0,
          listings: {
            "123": {
              createdAt: 1000000,
              sfl: 5,
              items: {
                Sunflower: 10,
              },
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
          tradePoints: 0,
          listings: {
            "123": {
              createdAt: 1000000,
              sfl: 5,
              items: {
                Sunflower: 10,
              },
            },
          },
        },
      },
    });

    expect(state.trades.listings).toEqual({});
  });
});
