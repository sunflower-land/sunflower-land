import Decimal from "decimal.js-light";
import { feedMixed, getMaxFeedMixAmount } from "./feedMixed";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CONFIG } from "lib/config";
import { bulkMixFeed } from "./bulkMixFeed";
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

describe("feedMixed: Pig Slops", () => {
  it("mixes a Slop from the chosen input in that input's quantity", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        inventory: {
          Sunflower: new Decimal(2200),
          Potato: new Decimal(100),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Basic Slop",
        ingredient: "Sunflower",
        amount: 2,
      },
    });

    expect(state.inventory["Basic Slop"]).toEqual(new Decimal(2));
    expect(state.inventory.Sunflower).toEqual(new Decimal(200));
    expect(state.inventory.Potato).toEqual(new Decimal(100));
  });

  it("mixes a tier 4 Slop from a crustacean", () => {
    const state = feedMixed({
      state: { ...INITIAL_FARM, inventory: { Lobster: new Decimal(3) } },
      action: {
        type: "feed.mixed",
        item: "Gourmet Slop",
        ingredient: "Lobster",
      },
    });

    expect(state.inventory["Gourmet Slop"]).toEqual(new Decimal(1));
    expect(state.inventory.Lobster).toEqual(new Decimal(2));
  });

  it("needs enough of the chosen input", () => {
    expect(() =>
      feedMixed({
        state: { ...INITIAL_FARM, inventory: { Sunflower: new Decimal(999) } },
        action: {
          type: "feed.mixed",
          item: "Basic Slop",
          ingredient: "Sunflower",
        },
      }),
    ).toThrow("Insufficient Ingredient: Sunflower");
  });

  it("needs an input", () => {
    expect(() =>
      feedMixed({
        state: { ...INITIAL_FARM, inventory: { Sunflower: new Decimal(1000) } },
        action: { type: "feed.mixed", item: "Basic Slop" },
      }),
    ).toThrow("Invalid ingredient");
  });

  it("rejects an input from another tier", () => {
    expect(() =>
      feedMixed({
        state: { ...INITIAL_FARM, inventory: { Wheat: new Decimal(10) } },
        action: {
          type: "feed.mixed",
          item: "Basic Slop",
          ingredient: "Wheat",
        },
      }),
    ).toThrow("Invalid ingredient");
  });

  it("rejects an input on a feed with a fixed recipe", () => {
    expect(() =>
      feedMixed({
        state: { ...INITIAL_FARM, inventory: { Wheat: new Decimal(10) } },
        action: { type: "feed.mixed", item: "Hay", ingredient: "Wheat" },
      }),
    ).toThrow("Invalid ingredient");
  });

  it("mixes Slops alongside other feeds in a bulk mix", () => {
    const state = bulkMixFeed({
      state: {
        ...INITIAL_FARM,
        inventory: {
          Wheat: new Decimal(5),
          Tomato: new Decimal(18),
        },
      },
      action: {
        type: "feeds.bulkMixed",
        feeds: [
          { item: "Hay", amount: 2 },
          { item: "Hearty Slop", ingredient: "Tomato", amount: 1 },
        ],
      },
    });

    expect(state.inventory.Hay).toEqual(new Decimal(2));
    expect(state.inventory["Hearty Slop"]).toEqual(new Decimal(1));
    expect(state.inventory.Tomato).toEqual(new Decimal(0));
  });

  describe("without the Pigpen", () => {
    // Jest runs on amoy, where the testnet PIGPEN flag is on.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("does not mix Slops", () => {
      expect(() =>
        feedMixed({
          state: {
            ...INITIAL_FARM,
            inventory: { Sunflower: new Decimal(1000) },
          },
          action: {
            type: "feed.mixed",
            item: "Basic Slop",
            ingredient: "Sunflower",
          },
        }),
      ).toThrow("Pig feeds are not available");
    });
  });
});
