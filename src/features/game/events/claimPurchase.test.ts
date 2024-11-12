import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { claimPurchase } from "./claimPurchase";

describe("purchase.claimed", () => {
  it("requires purchase exists", () => {
    expect(() =>
      claimPurchase({
        state: TEST_FARM,
        action: {
          type: "purchase.claimed",
          tradeId: "123",
        },
      }),
    ).toThrow("Purchase does not exist");
  });

  it("throws an error if the purchase has not been fulfilled", () => {
    expect(() =>
      claimPurchase({
        state: {
          ...TEST_FARM,
          trades: {
            listings: {
              "123": {
                collection: "collectibles",
                items: {
                  "Rich Chicken": 1,
                },
                sfl: 13,
                createdAt: 0,
              },
            },
          },
        },
        action: {
          type: "purchase.claimed",
          tradeId: "123",
        },
      }),
    ).toThrow("Purchase has not been fulfilled");
  });

  it("does not give the sfl if the trade is on chain", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              items: {
                "Rich Chicken": 1,
              },
              sfl: 13,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
              createdAt: 0,
              signature: "123",
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeId: "123",
      },
    });

    expect(state.balance).toStrictEqual(TEST_FARM.balance);
  });

  it("gives the seller the sfl if an instant trade", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              items: {
                "Rich Chicken": 1,
              },
              sfl: 13,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
              createdAt: 0,
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeId: "123",
      },
    });

    expect(state.balance).toStrictEqual(new Decimal(13));
  });

  it("removes the trade from the farm", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              items: {
                "Rich Chicken": 1,
              },
              sfl: 13,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
              createdAt: 0,
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeId: "123",
      },
    });

    expect(state.trades.listings?.["123"]).toBeUndefined();
  });
});
