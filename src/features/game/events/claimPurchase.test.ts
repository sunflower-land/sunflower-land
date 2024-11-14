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
          tradeIds: ["123"],
        },
      }),
    ).toThrow("One or more purchases do not exist");
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
          tradeIds: ["123"],
        },
      }),
    ).toThrow("One or more purchases have not been fulfilled");
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
        tradeIds: ["123"],
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
        tradeIds: ["123"],
      },
    });

    expect(state.balance).toStrictEqual(new Decimal(13));
  });

  it("removes the trades from the farm", () => {
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
        tradeIds: ["123"],
      },
    });

    expect(state.trades.listings?.["123"]).toBeUndefined();
  });

  it("gives the sfl for multiple instant trades", () => {
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
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              items: {
                "Fat Chicken": 1,
              },
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123", "124"],
      },
    });

    expect(state.balance).toStrictEqual(new Decimal(26));
  });

  it("applies the sfl from 2 instant trades but not on chain trades", () => {
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
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              items: {
                "Fat Chicken": 1,
              },
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "125": {
              collection: "collectibles",
              items: {
                "Rich Chicken": 1,
              },
              sfl: 13,
              createdAt: 0,
              signature: "125",
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123", "124", "125"],
      },
    });

    expect(state.balance).toStrictEqual(new Decimal(26));
  });
});
