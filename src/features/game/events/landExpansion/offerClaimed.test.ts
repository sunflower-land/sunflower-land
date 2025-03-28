import Decimal from "decimal.js-light";
import { claimOffer } from "./offerClaimed";
import { INITIAL_FARM } from "features/game/lib/constants";
import { calculateTradePoints } from "./addTradePoints";

describe("offer.claimed", () => {
  it("requires offer exists", () => {
    expect(() =>
      claimOffer({
        action: {
          tradeIds: ["123"],
          type: "offer.claimed",
        },
        state: INITIAL_FARM,
      }),
    ).toThrow("One or more offers do not exist");
  });

  it("requires offer is fulfilled", () => {
    expect(() =>
      claimOffer({
        action: {
          tradeIds: ["123"],
          type: "offer.claimed",
        },
        state: {
          ...INITIAL_FARM,
          trades: {
            offers: {
              "123": {
                collection: "collectibles",
                items: {
                  "Fat Chicken": 1,
                },
                createdAt: Date.now(),
                sfl: 15,
                tradeType: "instant",
              },
            },
          },
        },
      }),
    ).toThrow("One or more offers have not been fulfilled");
  });

  it("claims the collectibles", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "123": {
              collection: "collectibles",
              items: {
                "Fat Chicken": 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.inventory["Fat Chicken"]).toEqual(new Decimal(1));
  });

  it("claims the wearables", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "123": {
              collection: "wearables",
              items: {
                "Painter's Cap": 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.wardrobe["Painter's Cap"]).toEqual(1);
  });

  it("removes the offers from the farm", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "123": {
              collection: "collectibles",
              items: {
                "Fat Chicken": 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.trades.offers).toEqual({});
  });

  it("grants trade points for instant trade when offer is claimed", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          tradePoints: 5,
          offers: {
            "123": {
              collection: "collectibles",
              items: {
                "Fat Chicken": 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
          },
        },
      },
    });

    const result = calculateTradePoints({
      points: 2,
      sfl: 15,
    }).multipliedPoints;

    expect(state.inventory["Trade Point"]).toEqual(new Decimal(result));
    expect(state.trades.tradePoints).toBeGreaterThanOrEqual(result);
  });

  it("does not reward trade points for resources", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "123": {
              collection: "collectibles",
              items: {
                Barley: 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.trades.tradePoints ?? 0).toEqual(0);
    expect(state.inventory["Trade Point"] ?? new Decimal(0)).toEqual(
      new Decimal(0),
    );
  });

  it("gives the items from multiple instant offers", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123", "124"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "123": {
              collection: "collectibles",
              items: {
                "Fat Chicken": 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
            "124": {
              collection: "collectibles",
              items: {
                "Rich Chicken": 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.inventory["Fat Chicken"]).toEqual(new Decimal(1));
    expect(state.inventory["Rich Chicken"]).toEqual(new Decimal(1));
  });

  it("adds the items from 2 instant trades and 1 on chain trade", () => {
    const state = claimOffer({
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
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
              sfl: 200,
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
        type: "offer.claimed",
        tradeIds: ["123", "124", "125"],
      },
    });

    expect(state.inventory["Fat Chicken"]).toEqual(new Decimal(1));
    expect(state.inventory["Rich Chicken"]).toEqual(new Decimal(2));
    expect(state.previousInventory["Rich Chicken"]).toEqual(new Decimal(1));
  });

  it("does not allow claiming offers if there is a transaction in progress", () => {
    expect(() =>
      claimOffer({
        action: {
          tradeIds: ["123"],
          type: "offer.claimed",
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

  it("gives you the item if the trade is onchain", () => {
    const state = claimOffer({
      action: {
        tradeIds: ["123"],
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "123": {
              collection: "collectibles",
              items: {
                Kuebiko: 1,
              },
              createdAt: Date.now(),
              sfl: 15,
              fulfilledAt: Date.now(),
              fulfilledById: 67,
              signature: "0x123",
              tradeType: "onchain",
            },
          },
        },
      },
    });

    expect(state.inventory["Kuebiko"]).toEqual(new Decimal(1));
    expect(state.previousInventory["Kuebiko"]).toEqual(new Decimal(1));
  });
});
