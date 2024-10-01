import Decimal from "decimal.js-light";
import { receiveTrade } from "./receiveTrade";
import { TEST_FARM } from "features/game/lib/constants";

describe("receiveTrade", () => {
  it("ensures trade exists", () => {
    expect(() =>
      receiveTrade({
        action: {
          tradeId: "123",
          type: "trade.received",
        },
        state: TEST_FARM,
      }),
    ).toThrow("Trade #123 does not exist");
  });

  it("removes trade listing", () => {
    const state = receiveTrade({
      action: {
        tradeId: "123",
        type: "trade.received",
      },
      state: {
        ...TEST_FARM,
        trades: {
          tradePoints: 0,
          listings: {
            "123": {
              createdAt: 1000000,
              sfl: 1,
              items: {
                Sunflower: 10,
              },
              boughtAt: 12000000,
              buyerId: 12,
            },
          },
        },
      },
    });

    expect(state.trades.listings).toEqual({});
  });

  it("deducts 10% SFL on new system", () => {
    const state = receiveTrade({
      action: {
        tradeId: "123",
        type: "trade.received",
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
    });

    expect(state.balance).toEqual(new Decimal(5 * 0.9));
  });
});
