import Decimal from "decimal.js-light";
import { feedMixed, getMaxFeedMixAmount } from "./feedMixed";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { AnimalFoodName } from "features/game/types/game";

describe("feedMixed", () => {
  it.each([0, -1, 1.5, Number.POSITIVE_INFINITY])(
    "does not mix an invalid amount of %s",
    (amount) => {
      expect(() =>
        feedMixed({
          state: {
            ...INITIAL_FARM,
            inventory: {
              Wheat: new Decimal(100),
            },
          },
          action: {
            type: "feed.mixed",
            item: "Hay",
            amount,
          },
        }),
      ).toThrow("Invalid amount");
    },
  );

  it("throws an error if item is not a feed", () => {
    expect(() =>
      feedMixed({
        state: INITIAL_FARM,
        action: {
          type: "feed.mixed",
          item: "Sunflower Seed" as AnimalFoodName,
          amount: 1,
        },
      }),
    ).toThrow("Item is not a feed!");
  });

  it("does not mix feed if there's not enough ingredients", () => {
    expect(() =>
      feedMixed({
        state: {
          ...INITIAL_FARM,
          inventory: {},
        },
        action: {
          type: "feed.mixed",
          item: "Hay",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient Ingredient: Wheat");
  });

  it("adds the feed into inventory", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Wheat: new Decimal(100),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Hay",
        amount: 1,
      },
    });
    expect(state.inventory.Hay).toEqual(new Decimal(1));
    expect(state.inventory.Wheat).toEqual(new Decimal(99));
  });

  it("mixes Barn Delight correctly", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Lemon: new Decimal(5),
          Honey: new Decimal(3),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Barn Delight",
        amount: 1,
      },
    });
    expect(state.inventory["Barn Delight"]).toEqual(new Decimal(1));
    expect(state.inventory.Lemon).toEqual(new Decimal(0));
    expect(state.inventory.Honey).toEqual(new Decimal(0));
  });

  it("removes the ingredients for 1 x Kernel Blend from inventory", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Corn: new Decimal(10),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Kernel Blend",
        amount: 1,
      },
    });

    expect(state.inventory.Corn).toEqual(new Decimal(9));
  });

  it("removes the ingredients for 10 x Kernel Blend from inventory", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Corn: new Decimal(15),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Kernel Blend",
        amount: 10,
      },
    });

    expect(state.inventory.Corn).toEqual(new Decimal(5));
    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(10));
  });
  it("uses kale to mix mixed grain instead of wheat barley and corn", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Kale Mix": 1,
          },
        },
        inventory: {
          Corn: new Decimal(10),
          Wheat: new Decimal(10),
          Barley: new Decimal(10),
          Kale: new Decimal(10),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Mixed Grain",
        amount: 1,
      },
    });

    expect(state.inventory.Corn).toEqual(new Decimal(10));
    expect(state.inventory.Wheat).toEqual(new Decimal(10));
    expect(state.inventory.Barley).toEqual(new Decimal(10));
    expect(state.inventory.Kale).toEqual(new Decimal(7));
  });
});

describe("getMaxFeedMixAmount", () => {
  it("uses the least available ingredient as the maximum", () => {
    expect(
      getMaxFeedMixAmount({
        state: {
          ...INITIAL_FARM,
          inventory: {
            Wheat: new Decimal(12),
            Corn: new Decimal(9),
            Barley: new Decimal(20),
          },
        },
        name: "Mixed Grain",
      }),
    ).toBe(9);
  });

  it("rounds fractional ingredient availability down to whole feed", () => {
    expect(
      getMaxFeedMixAmount({
        state: {
          ...INITIAL_FARM,
          inventory: {
            Wheat: new Decimal(10.9),
          },
        },
        name: "Hay",
      }),
    ).toBe(10);
  });

  it("returns zero when an ingredient is unavailable", () => {
    expect(
      getMaxFeedMixAmount({
        state: {
          ...INITIAL_FARM,
          inventory: {
            Wheat: new Decimal(10),
            Corn: new Decimal(10),
          },
        },
        name: "Mixed Grain",
      }),
    ).toBe(0);
  });

  it("uses the skill-adjusted recipe", () => {
    expect(
      getMaxFeedMixAmount({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: {
              "Kale Mix": 2,
            },
          },
          inventory: {
            Kale: new Decimal(12.5),
          },
        },
        name: "Mixed Grain",
      }),
    ).toBe(5);
  });
});
