import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { claimOffer } from "./offerClaimed";

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
            },
          },
        },
      },
    });

    expect(state.wardrobe["Painter's Cap"]).toEqual(1);
  });

  it("skips claiming an on chain item (this is already done)", () => {
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
            },
          },
        },
      },
    });

    expect(state.inventory["Kuebiko"]).toBeUndefined();
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
            },
          },
        },
      },
    });

    expect(state.inventory["Trade Point"]?.toNumber()).toEqual(32);
    expect(state.trades.tradePoints).toBeGreaterThanOrEqual(32);
  });

  it("grants trade points for onchain trade when offer is claimed", () => {
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
              signature: "123",
            },
          },
        },
      },
    });

    expect(state.inventory["Trade Point"]?.toNumber()).toEqual(160);
    expect(state.trades.tradePoints).toBeGreaterThanOrEqual(160);
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
              signature: "123",
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
            },
          },
        },
      },
    });

    expect(state.inventory["Fat Chicken"]).toEqual(new Decimal(1));
    expect(state.inventory["Rich Chicken"]).toEqual(new Decimal(1));
  });
});
