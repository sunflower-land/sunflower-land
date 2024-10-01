import "lib/__mocks__/configMock";

import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { claimOffer } from "./offerClaimed";

describe("offer.claimed", () => {
  it("requires offer exists", () => {
    expect(() =>
      claimOffer({
        action: {
          tradeId: "123",
          type: "offer.claimed",
        },
        state: INITIAL_FARM,
      }),
    ).toThrow("Offer does not exist");
  });

  it("requires offer is fulfilled", () => {
    expect(() =>
      claimOffer({
        action: {
          tradeId: "123",
          type: "offer.claimed",
        },
        state: {
          ...INITIAL_FARM,
          trades: {
            tradePoints: 0,
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
    ).toThrow("Offer is not fulfilled");
  });

  it("claims the collectibles", () => {
    const state = claimOffer({
      action: {
        tradeId: "123",
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          tradePoints: 0,
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
        tradeId: "123",
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          tradePoints: 0,
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
        tradeId: "123",
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          tradePoints: 0,
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

  it("removes the offer", () => {
    const state = claimOffer({
      action: {
        tradeId: "123",
        type: "offer.claimed",
      },
      state: {
        ...INITIAL_FARM,
        trades: {
          tradePoints: 0,
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

  it("grants trade points when offer is claimed", () => {
    const state = claimOffer({
      action: {
        tradeId: "123",
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

    expect(state.inventory["Trade Point"]?.toNumber()).toBeGreaterThanOrEqual(
      6,
    );
    expect(state.trades.tradePoints).toBeGreaterThanOrEqual(6);
  });
});
