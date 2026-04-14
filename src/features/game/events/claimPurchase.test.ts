import { claimPurchase } from "./claimPurchase";
import { INITIAL_FARM } from "../lib/constants";
import Decimal from "decimal.js-light";
import { calculateTradePoints } from "./landExpansion/addTradePoints";

describe("purchase.claimed", () => {
  it("requires purchase exists", () => {
    expect(() =>
      claimPurchase({
        state: INITIAL_FARM,
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
          ...INITIAL_FARM,
          trades: {
            listings: {
              "123": {
                collection: "collectibles",
                items: {
                  "Rich Chicken": 1,
                },
                sfl: 13,
                createdAt: 0,
                tradeType: "instant",
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

  it("gives the seller the sfl if an instant trade", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
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
              tradeType: "instant",
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
        ...INITIAL_FARM,
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
              tradeType: "instant",
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
        ...INITIAL_FARM,
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
              tradeType: "instant",
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
              tradeType: "instant",
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

  it("increases the tax free sfl", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
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
              tradeType: "instant",
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
              tradeType: "instant",
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
              tradeType: "onchain",
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123", "124", "125"],
      },
    });

    expect(state.bank.taxFreeSFL).toBeCloseTo(35.1);
  });

  it("awards lesser trade points when claiming an instant trade", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
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
              tradeType: "instant",
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
              tradeType: "instant",
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123", "124"],
      },
    });

    const result = calculateTradePoints({
      points: 1,
      sfl: 13,
    }).multipliedPoints;

    expect(state.trades.tradePoints).toEqual(result * 2);
    expect(state.inventory["Trade Point"]).toEqual(new Decimal(result * 2));
  });
  it("does not award trade points for resources", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              items: {
                Barley: 1,
              },
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
              tradeType: "instant",
            },
            "124": {
              collection: "collectibles",
              items: {
                Feather: 1,
              },
              sfl: 13,
              createdAt: 0,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
              tradeType: "instant",
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

  it("allows a player to claim a purchase that was bought in the old trade system", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(0),
        trades: {
          listings: {
            "123": {
              collection: "collectibles",
              items: {
                Potato: 200,
              },
              sfl: 1,
              createdAt: 0,
              boughtAt: Date.now() - 60 * 1000,
              buyerId: 43,
              tradeType: "instant",
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123"],
      },
    });

    expect(state.balance).toStrictEqual(new Decimal(0.9));
  });

  it("does not allow claiming purchases if there is a transaction in progress", () => {
    expect(() =>
      claimPurchase({
        action: {
          tradeIds: ["123"],
          type: "purchase.claimed",
        },
        state: {
          ...INITIAL_FARM,
          transaction: {
            event: "transaction.progressSynced",
            createdAt: Date.now(),
            data: {
              params: {
                signature: "123",
                sessionId: "123",
                nextSessionId: "123",
                farmId: 123,
                sender: "123",
                deadline: 123,
                fee: "123",
                progress: {
                  wearableIds: [],
                  wearableAmounts: [],
                  wearableBurnIds: [],
                  wearableBurnAmounts: [],
                  mintIds: [],
                  mintAmounts: [],
                  burnIds: [],
                  burnAmounts: [],
                  tokens: "",
                },
              },
            },
          },
        },
      }),
    ).toThrow("Transaction in progress");
  });

  it("it gives the sfl if the trade is onchain", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
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
              tradeType: "onchain",
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

  it("subtracts from the previous inventory if the trade is onchain", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
        previousInventory: {
          "Rich Chicken": new Decimal(1),
        },
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
              tradeType: "onchain",
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123"],
      },
    });

    expect(state.previousInventory["Rich Chicken"]).toStrictEqual(
      new Decimal(0),
    );
  });

  it("subtracts from the previous wardrobe if the trade is onchain", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
        previousWardrobe: {
          "Abyssal Angler Hat": 1,
        },
        trades: {
          listings: {
            "123": {
              collection: "wearables",
              items: {
                "Abyssal Angler Hat": 1,
              },
              sfl: 13,
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
              createdAt: 0,
              signature: "123",
              tradeType: "onchain",
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123"],
      },
    });

    expect(state.previousWardrobe["Abyssal Angler Hat"]).toStrictEqual(0);
  });

  it("deletes a pet from the seller if somehow it wasn't deleted when the listing was fulfilled", () => {
    const state = claimPurchase({
      state: {
        ...INITIAL_FARM,
        trades: {
          listings: {
            "123": {
              collection: "pets",
              items: {
                "Pet #1": 1,
              },
              sfl: 13,
              createdAt: 0,
              tradeType: "instant",
              fulfilledAt: Date.now() - 60 * 1000,
              fulfilledById: 43,
            },
          },
        },
        pets: {
          nfts: {
            1: {
              name: "Pet #1",
              id: 1,
              requests: {
                food: [],
                fedAt: 0,
              },
              energy: 0,
              experience: 0,
              pettedAt: 0,
            },
          },
        },
      },
      action: {
        type: "purchase.claimed",
        tradeIds: ["123"],
      },
    });

    expect(state.pets?.nfts?.[1]).toBeUndefined();
  });
});
