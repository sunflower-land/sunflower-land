import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { claimPurchase } from "./claimPurchase";
import { KNOWN_IDS } from "../types";

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
                itemId: KNOWN_IDS["Rich Chicken"],
                quantity: 1,
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
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
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
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
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

    expect(state.balance).toStrictEqual(new Decimal(11.7));
  });

  it("removes the trades from the farm", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
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
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Fat Chicken"],
              quantity: 1,
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

    expect(state.balance).toStrictEqual(new Decimal(23.4));
  });

  it("applies the sfl from 2 instant trades but not on chain trades", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Fat Chicken"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "125": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
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

    expect(state.balance).toStrictEqual(new Decimal(23.4));
  });

  it("increases the tax free sfl", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Fat Chicken"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "125": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
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

    expect(state.bank.taxFreeSFL).toStrictEqual(23.4);
  });
  it("awards trade points when claiming an onchain trade", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          tradePoints: 0,
          listings: {
            "125": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
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
        tradeIds: ["125"],
      },
    });
    expect(state.trades.tradePoints).toEqual(70);
    expect(state.inventory["Trade Point"]).toEqual(new Decimal(70));
  });

  it("awards lesser trade points when claiming an instant trade", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Rich Chicken"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Fat Chicken"],
              quantity: 1,
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
    expect(state.trades.tradePoints).toEqual(28);
    expect(state.inventory["Trade Point"]).toEqual(new Decimal(28));
  });

  it("does not award trade points for resources", () => {
    const state = claimPurchase({
      state: {
        ...TEST_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Barley"],
              quantity: 1,
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
            "124": {
              collection: "collectibles",
              itemId: KNOWN_IDS["Feather"],
              quantity: 1,
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
    expect(state.trades.tradePoints ?? 0).toEqual(0);
    expect(state.inventory["Trade Point"] ?? new Decimal(0)).toEqual(
      new Decimal(0),
    );
  });
});
