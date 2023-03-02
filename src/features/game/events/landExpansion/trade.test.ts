import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { trade } from "./trade";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
};

describe("trade", () => {
  const dateNow = Date.now();

  const tradeOffer = {
    reward: {
      items: { Chicken: new Decimal(1) },
      sfl: new Decimal(0),
    },
    ingredients: {
      Beetroot: new Decimal(50),
      Carrot: new Decimal(100),
    },
    // Some older times
    startAt: new Date(Date.now() - 1000).toISOString(),
    endAt: new Date(Date.now() + 1000).toISOString(),
  };

  it("does not trade an item if nothing is on offer", () => {
    expect(() =>
      trade({
        action: {
          type: "item.traded",
        },
        state: {
          ...GAME_STATE,
          tradeOffer: undefined,
        },
        createdAt: dateNow,
      })
    ).toThrow("Nothing to trade");
  });

  it("does not trade if missing multiple ingredients", () => {
    expect(() =>
      trade({
        action: {
          type: "item.traded",
        },
        state: {
          ...GAME_STATE,
          tradeOffer,
        },
        createdAt: dateNow,
      })
    ).toThrow("Insufficient ingredient: Beetroot");
  });

  it("does not trade if missing  ingredient", () => {
    expect(() =>
      trade({
        action: {
          type: "item.traded",
        },
        state: {
          ...GAME_STATE,
          inventory: {
            Beetroot: new Decimal(50),
          },
          tradeOffer,
        },
        createdAt: dateNow,
      })
    ).toThrow("Insufficient ingredient: Carrot");
  });

  it("only trades an offer once", () => {
    expect(() =>
      trade({
        action: {
          type: "item.traded",
        },
        state: {
          ...GAME_STATE,
          inventory: {
            Beetroot: new Decimal(50),
            Carrot: new Decimal(200),
          },
          tradedAt: new Date(
            new Date(tradeOffer.startAt).getTime() + 1000
          ).toString(),
          tradeOffer,
        },
        createdAt: dateNow,
      })
    ).toThrow("Already traded");
  });

  it("trades different items", () => {
    const state = trade({
      action: {
        type: "item.traded",
      },
      createdAt: dateNow,
      state: {
        ...GAME_STATE,
        inventory: {
          Beetroot: new Decimal(50),
          Carrot: new Decimal(200),
        },
        // Made a trade long ago in the past
        tradedAt: new Date(Date.now() - 100000).toISOString(),
        tradeOffer: {
          reward: {
            items: { Chicken: new Decimal(1) },
            sfl: new Decimal(0),
          },
          ingredients: {
            Beetroot: new Decimal(50),
            Carrot: new Decimal(100),
          },
          // Some older times
          startAt: new Date(Date.now() - 1000).toISOString(),
          endAt: new Date(Date.now() + 1000).toISOString(),
        },
      },
    });

    expect(state.inventory.Chicken).toEqual(new Decimal(1));
  });

  it("trades seasonal items", () => {
    const state = trade({
      action: {
        type: "item.traded",
      },
      createdAt: dateNow,
      state: {
        ...GAME_STATE,
        inventory: {
          Beetroot: new Decimal(50),
        },
        // Made a trade long ago in the past
        tradedAt: new Date(Date.now() - 100000).toISOString(),
        tradeOffer: {
          reward: {
            items: { "Solar Flare Ticket": new Decimal(3) },
            sfl: new Decimal(1.25),
          },
          ingredients: {
            Beetroot: new Decimal(50),
          },
          // Some older times
          startAt: new Date(Date.now() - 1000).toISOString(),
          endAt: new Date(Date.now() + 1000).toISOString(),
        },
      },
    });

    expect(state.inventory["Solar Flare Ticket"]).toEqual(new Decimal(3));
    expect(state.balance).toEqual(new Decimal(1.25));
  });

  it("trades an item", () => {
    const state = trade({
      action: {
        type: "item.traded",
      },
      createdAt: dateNow,
      state: {
        ...GAME_STATE,
        inventory: {
          Beetroot: new Decimal(50),
          Carrot: new Decimal(200),
        },
        tradeOffer,
      },
    });

    expect(state.inventory.Chicken).toEqual(new Decimal(1));
    expect(state.inventory.Beetroot).toEqual(new Decimal(0));
    expect(state.inventory.Carrot).toEqual(new Decimal(100));
    expect(state.tradedAt).toEqual(expect.any(String));
  });

  it("prevents multiple trades of an item", () => {
    const state = trade({
      action: {
        type: "item.traded",
      },
      createdAt: dateNow,
      state: {
        ...GAME_STATE,
        inventory: {
          Beetroot: new Decimal(500),
          Carrot: new Decimal(2000),
        },
        tradeOffer: {
          reward: {
            items: { Chicken: new Decimal(1) },
            sfl: new Decimal(0),
          },
          ingredients: {
            Beetroot: new Decimal(50),
            Carrot: new Decimal(100),
          },
          // Some older times
          startAt: new Date(Date.now() - 1000).toISOString(),
          endAt: new Date(Date.now() + 1000).toISOString(),
        },
      },
    });

    expect(() =>
      trade({
        action: {
          type: "item.traded",
        },
        state,
        createdAt: dateNow,
      })
    ).toThrow("Already traded");
  });
});
