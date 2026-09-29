import Decimal from "decimal.js-light";
import { feedMixed, getMaxFeedMixAmount } from "./feedMixed";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { AnimalFoodName, GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

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

describe("Beetle Feed", () => {
  const BEETLE_FARM: GameState = {
    ...INITIAL_FARM,
    coins: 0,
    inventory: {
      "Brown Beetle": new Decimal(1),
      "Blue Beetle": new Decimal(1),
      "Pink Beetle": new Decimal(1),
      "Amber Beetle": new Decimal(1),
      Corn: new Decimal(10),
      Wheat: new Decimal(10),
      Barley: new Decimal(10),
    },
  };

  const mix = (state: GameState, item: AnimalFoodName) =>
    feedMixed({ state, action: { type: "feed.mixed", item, amount: 1 } });

  it.each([
    ["Brown Beetle Feed", "Brown Beetle", { Corn: 8, Wheat: 10, Barley: 10 }],
    ["Blue Beetle Feed", "Blue Beetle", { Corn: 10, Wheat: 8, Barley: 10 }],
    ["Pink Beetle Feed", "Pink Beetle", { Corn: 10, Wheat: 10, Barley: 8 }],
    ["Amber Beetle Feed", "Amber Beetle", { Corn: 8, Wheat: 8, Barley: 8 }],
  ] as const)(
    "mixes %s from 1 %s and 2 of each crop",
    (item, beetle, crops) => {
      const state = mix(BEETLE_FARM, item);

      expect(state.inventory[item]).toEqual(new Decimal(1));
      expect(state.inventory[beetle]).toEqual(new Decimal(0));
      expect(state.inventory.Corn).toEqual(new Decimal(crops.Corn));
      expect(state.inventory.Wheat).toEqual(new Decimal(crops.Wheat));
      expect(state.inventory.Barley).toEqual(new Decimal(crops.Barley));
    },
  );

  it("does not mix a Beetle Feed without its Beetle", () => {
    expect(() =>
      mix(
        { ...INITIAL_FARM, inventory: { Corn: new Decimal(10) } },
        "Brown Beetle Feed",
      ),
    ).toThrow("Insufficient Ingredient: Brown Beetle");
  });

  it("does not apply Kale Mix to Amber Beetle Feed", () => {
    const state = mix(
      {
        ...BEETLE_FARM,
        bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Kale Mix": 1 } },
        inventory: { ...BEETLE_FARM.inventory, Kale: new Decimal(10) },
      },
      "Amber Beetle Feed",
    );

    expect(state.inventory["Amber Beetle Feed"]).toEqual(new Decimal(1));
    expect(state.inventory.Kale).toEqual(new Decimal(10));
    expect(state.inventory.Corn).toEqual(new Decimal(8));
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("does not mix a Beetle Feed without the BEETLE_FEED feature flag", () => {
      expect(() => mix(BEETLE_FARM, "Brown Beetle Feed")).toThrow(
        "Beetle Feed is not available",
      );
    });

    it("is not unlocked by holding a Beta Pass", () => {
      expect(() =>
        mix(
          {
            ...BEETLE_FARM,
            inventory: {
              ...BEETLE_FARM.inventory,
              "Beta Pass": new Decimal(1),
            },
          },
          "Brown Beetle Feed",
        ),
      ).toThrow("Beetle Feed is not available");
    });

    it("still mixes the existing feeds", () => {
      const state = mix(BEETLE_FARM, "Kernel Blend");

      expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(1));
    });
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
