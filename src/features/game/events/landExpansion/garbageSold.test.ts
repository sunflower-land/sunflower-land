import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { GARBAGE, type GarbageName } from "features/game/types/garbage";
import { CONFIG } from "lib/config";
import { sellGarbage } from "./garbageSold";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

describe("garbageSold", () => {
  it("does not sell a non treasure item", () => {
    expect(() =>
      sellGarbage({
        state: GAME_STATE,
        action: {
          type: "garbage.sold",
          item: "Sunflower" as GarbageName,
          amount: 1,
        },
      }),
    ).toThrow("Not for sale");
  });

  it("does not sell an unusual amount", () => {
    expect(() =>
      sellGarbage({
        state: {
          ...GAME_STATE,
          inventory: {
            "Solar Flare Ticket": new Decimal(5),
          },
        },
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 1.5,
        },
      }),
    ).toThrow("Invalid amount");
  });

  it("does not sell a missing item", () => {
    expect(() =>
      sellGarbage({
        state: GAME_STATE,
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient quantity to sell");
  });

  it("sells a treasure", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount: 1,
      },
    });

    expect(state.inventory["Solar Flare Ticket"]).toEqual(new Decimal(4));
    expect(state.coins).toEqual(
      GAME_STATE.coins + GARBAGE["Solar Flare Ticket"].sellPrice,
    );
  });

  it("sells a block buck", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Block Buck": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Block Buck",
        amount: 5,
      },
    });

    expect(state.inventory["Block Buck"]).toEqual(new Decimal(0));
    expect(state.inventory["Gem"]).toEqual(new Decimal(100));
  });

  it("sell the treasure in bulk given sufficient quantity", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount: 4,
      },
    });

    expect(state.inventory["Solar Flare Ticket"]).toEqual(new Decimal(1));
    expect(state.coins).toEqual(
      GAME_STATE.coins + GARBAGE["Solar Flare Ticket"].sellPrice * 4,
    );
  });

  it("does not sell the treasure in bulk given insufficient quantity", () => {
    expect(() =>
      sellGarbage({
        state: {
          ...GAME_STATE,
          inventory: {
            "Solar Flare Ticket": new Decimal(1),
          },
        },
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 4,
        },
      }),
    ).toThrow("Insufficient quantity to sell");
  });

  it("increments the coins earned activity ", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount: 1,
      },
    });
    expect(state.farmActivity["Coins Earned"]).toEqual(
      GARBAGE["Solar Flare Ticket"].sellPrice,
    );
  });

  it("increments the treasure sold activity ", () => {
    const amount = 1;
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount,
      },
    });
    expect(state.farmActivity["Solar Flare Ticket Sold"]).toEqual(amount);
  });

  it("gives items", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Hen House": new Decimal(2),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Hen House",
        amount: 1,
      },
    });

    expect(state.inventory["Wood"]).toEqual(
      (GAME_STATE.inventory["Wood"] ?? new Decimal(0)).add(200),
    );
  });

  describe("legacy weather items", () => {
    const LEGACY = [
      "Tornado Pinwheel",
      "Mangrove",
      "Thermal Stone",
      "Protective Pesticide",
    ] as const;

    it.each(LEGACY)("sells an unplaced %s", (name) => {
      const state = sellGarbage({
        state: {
          ...GAME_STATE,
          coins: 50,
          inventory: { [name]: new Decimal(2) },
        },
        action: { type: "garbage.sold", item: name, amount: 2 },
      });

      expect(state.inventory[name]).toEqual(new Decimal(0));
      // PENDING BRYN: Garbo pays 0 coins and no items until the exchange
      // values are set. Update this when they are.
      expect(state.coins).toEqual(50);
      expect(state.inventory.Wood).toBeUndefined();
      expect(state.farmActivity[`${name} Sold`]).toEqual(2);
    });

    it("doesn't sell a placed one", () => {
      expect(() =>
        sellGarbage({
          state: {
            ...GAME_STATE,
            inventory: { Mangrove: new Decimal(1) },
            collectibles: {
              Mangrove: [
                {
                  id: "1",
                  coordinates: { x: 1, y: 1 },
                  readyAt: 0,
                  createdAt: 0,
                },
              ],
            },
          },
          action: { type: "garbage.sold", item: "Mangrove", amount: 1 },
        }),
      ).toThrow("Insufficient quantity to sell");
    });

    it("doesn't sell one placed at home", () => {
      expect(() =>
        sellGarbage({
          state: {
            ...GAME_STATE,
            inventory: { "Tornado Pinwheel": new Decimal(2) },
            home: {
              ...GAME_STATE.home,
              collectibles: {
                "Tornado Pinwheel": [
                  {
                    id: "1",
                    coordinates: { x: 1, y: 1 },
                    readyAt: 0,
                    createdAt: 0,
                  },
                ],
              },
            },
          },
          action: {
            type: "garbage.sold",
            item: "Tornado Pinwheel",
            amount: 2,
          },
        }),
      ).toThrow("Insufficient quantity to sell");
    });

    describe("without the Weather flag", () => {
      const network = CONFIG.NETWORK;
      beforeAll(() => {
        CONFIG.NETWORK = "mainnet";
      });
      afterAll(() => {
        CONFIG.NETWORK = network;
      });

      it.each(LEGACY)("doesn't sell %s", (name) => {
        expect(() =>
          sellGarbage({
            state: { ...GAME_STATE, inventory: { [name]: new Decimal(1) } },
            action: { type: "garbage.sold", item: name, amount: 1 },
          }),
        ).toThrow("Not for sale");
      });
    });
  });
});
