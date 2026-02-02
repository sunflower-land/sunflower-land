import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  TEST_FARM,
} from "features/game/lib/constants";
import { castRod, getReelsPackGemPrice } from "./castRod";
import Decimal from "decimal.js-light";
import { Bumpkin } from "features/game/types/game";
import { Chum, getDailyFishingLimit } from "features/game/types/fishing";
import { CHAPTERS } from "features/game/types/chapters";

const farm = { ...TEST_FARM };

describe("castRod", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("requires player has a rod", () => {
    expect(() => {
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: farm,
      });
    }).toThrow("Missing rod");
  });

  it("requires player has bait", () => {
    expect(() => {
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
          },
        },
      });
    }).toThrow("Missing Earthworm");
  });

  it("requires chum is supported", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          chum: "Axe" as Chum,
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Axe: new Decimal(1),
          },
        },
      });
    }).toThrow("Axe is not a supported chum");
  });

  it("requires guaranteed catch when using guaranteed bait", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Fish Flake",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            "Fish Flake": new Decimal(1),
          },
        },
      });
    }).toThrow("Missing guaranteed catch");
  });

  it("requires player has enough gems to buy more reels if reelPacksToBuy is provided", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Fish Flake",
          type: "rod.casted",
          reelPacksToBuy: 1,
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            "Fish Flake": new Decimal(1),
          },
        },
      });
    }).toThrow("Player does not have enough Gems to buy more reels");
  });

  it("increases timesBought count by packs amount and scales extra reels", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = castRod({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(70),
          Rod: new Decimal(1),
          Earthworm: new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          extraReels: {
            timesBought: {
              [today]: 0,
            },
            count: 0,
          },
        },
      },
      action: { bait: "Earthworm", type: "rod.casted", reelPacksToBuy: 3 },
    });
    expect(result.fishing.extraReels?.timesBought?.[today]).toEqual(3);
    // Bought 3 packs (15 reels) and used 1 for the cast, leaving 14
    expect(result.fishing.extraReels?.count).toEqual(14);
    expect(result.inventory["Gem"]).toEqual(new Decimal(0));
  });

  it("removes Gems from the player's inventory when buying more reels", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = castRod({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(10),
          Rod: new Decimal(1),
          Earthworm: new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          extraReels: {
            count: 0,
          },
        },
      },
      action: { bait: "Earthworm", type: "rod.casted", reelPacksToBuy: 1 },
    });

    expect(result.inventory["Gem"]).toEqual(new Decimal(0));
  });

  it("when multiplier is 1 and 1 pack is required it adds 4 extra reels (uses 1)", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = castRod({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(10),
          Rod: new Decimal(1),
          Earthworm: new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          extraReels: {
            count: 0,
          },
        },
      },
      action: { bait: "Earthworm", type: "rod.casted", reelPacksToBuy: 1 },
    });

    expect(result.fishing.extraReels?.count).toEqual(4);
  });

  it("when multiplier is 25 and 22 reels remaining and 1 pack is required it leaves 2 extra reels (uses 3)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T00:00:00.000Z"));
    const now = Date.now();
    const today = new Date(now).toISOString().split("T")[0];

    const bumpkinWithFiveFold: Bumpkin = {
      ...INITIAL_BUMPKIN,
      skills: {
        "Fisherman's 5 Fold": 1,
      },
    };

    const result = castRod({
      state: {
        ...INITIAL_FARM,
        bumpkin: bumpkinWithFiveFold,
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: now }],
          expiresAt: now + 31 * 24 * 60 * 60 * 1000,
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(10),
          Rod: new Decimal(30),
          Earthworm: new Decimal(30),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 3,
          },
          extraReels: {
            count: 0,
            timesBought: {
              [today]: 0,
            },
          },
        },
      },
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        multiplier: 25,
        reelPacksToBuy: 1,
      },
    });

    expect(result.fishing.extraReels?.count).toEqual(2);
    expect(result.fishing.extraReels?.timesBought?.[today]).toEqual(1);
    expect(result.fishing.dailyAttempts?.[today]).toEqual(28);
    jest.useRealTimers();
  });

  it("rejects guaranteed catch when using regular bait", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          guaranteedCatch: "Anchovy",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
          },
        },
      });
    }).toThrow("Invalid guaranteed catch");
  });

  it("requires player has not already casts", () => {
    expect(() => {
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Axe: new Decimal(1),
          },
          fishing: {
            wharf: {
              castedAt: 1000000200,
            },
            dailyAttempts: {},
          },
        },
      });
    }).toThrow("Already casted");
  });

  it("requires player has sufficient chum", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          chum: "Sunflower",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Sunflower: new Decimal(30),
          },
        },
      });
    }).toThrow("Insufficient Chum: Sunflower");
  });

  it("requires a player hasn't maxed out their daily attempts", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-10-11T09:00:00Z"));

    const date = new Date().toISOString().split("T")[0];

    expect(() => {
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Axe: new Decimal(1),
          },
          fishing: {
            dailyAttempts: {
              [date]: 20,
            },
            wharf: {},
          },
        },
      });
    }).toThrow("Daily attempts exhausted");
  });

  it("subtracts rod", () => {
    const state = castRod({
      action: { bait: "Earthworm", type: "rod.casted" },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
        },
      },
    });

    expect(state.inventory.Rod).toEqual(new Decimal(2));
  });

  it("subtracts bait", () => {
    const state = castRod({
      action: { bait: "Earthworm", type: "rod.casted" },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(2),
        },
      },
    });

    expect(state.inventory.Earthworm).toEqual(new Decimal(1));
  });

  it("subtracts chum", () => {
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        chum: "Sunflower",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
          Sunflower: new Decimal(500),
        },
      },
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(450));
  });

  it("multiplies rods, bait and chum when multi casting", () => {
    const now = Date.now();
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        chum: "Sunflower",
        multiplier: 5,
      },
      state: {
        ...farm,
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: now }],
          expiresAt: now + 31 * 24 * 60 * 60 * 1000,
        },
        inventory: {
          Rod: new Decimal(10),
          Earthworm: new Decimal(10),
          Sunflower: new Decimal(1000),
          "Beta Pass": new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {},
          extraReels: {
            count: 20,
          },
        },
      },
    });

    expect(state.inventory.Rod).toEqual(new Decimal(5));
    expect(state.inventory.Earthworm).toEqual(new Decimal(5));
    // 50 sunflower per chum * 5 casts = 250
    expect(state.inventory.Sunflower).toEqual(new Decimal(750));
    expect(state.fishing.wharf.multiplier).toEqual(5);
    expect(state.farmActivity["Rod Casted"]).toEqual(5);
  });

  it("requires VIP when multiplier is greater than 1", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          type: "rod.casted",
          multiplier: 5,
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(10),
            Earthworm: new Decimal(10),
          },
          fishing: {
            wharf: {},
            dailyAttempts: {},
            extraReels: {
              count: 20,
            },
          },
        },
      });
    }).toThrow("VIP is required");
  });

  it("applies the Angler Waders boost which increases the daily fishing limit by 10", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-10-11T09:00:00Z"));
    const now = Date.now();
    const today = new Date(now).toISOString().split("T")[0];

    const bumpkinWithAnglerWaders: Bumpkin = {
      ...INITIAL_BUMPKIN,
      equipped: {
        ...INITIAL_BUMPKIN.equipped,
        pants: "Angler Waders",
      },
    };

    expect(() =>
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          bumpkin: bumpkinWithAnglerWaders,
          fishing: {
            dailyAttempts: {
              [today]: 20,
            },
            wharf: {},
          },
          inventory: {
            Rod: new Decimal(3),
            Earthworm: new Decimal(1),
          },
        },
      }),
    ).not.toThrow();
  });

  it("applies Saw Fish boost which increases the daily fishing limit by 5", () => {
    const now = Date.now();
    const today = new Date(now).toISOString().split("T")[0];

    const bumpkinWithSawFish: Bumpkin = {
      ...INITIAL_BUMPKIN,
      equipped: {
        ...INITIAL_BUMPKIN.equipped,
        secondaryTool: "Saw Fish",
      },
    };

    expect(() =>
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          bumpkin: bumpkinWithSawFish,
          fishing: {
            dailyAttempts: {
              [today]: 24,
            },
            wharf: {},
          },
          inventory: {
            Rod: new Decimal(3),
            Earthworm: new Decimal(1),
          },
        },
      }),
    ).not.toThrow();
  });

  it("applies Nautilus boost which increases the daily fishing limit by 5", () => {
    const now = Date.now();
    const today = new Date(now).toISOString().split("T")[0];

    expect(() =>
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          collectibles: {
            Nautilus: [
              {
                id: "1",
                createdAt: now,
                coordinates: {
                  x: 0,
                  y: 0,
                },
              },
            ],
          },
          fishing: {
            dailyAttempts: {
              [today]: 24,
            },
            wharf: {},
          },
          inventory: {
            Rod: new Decimal(3),
            Earthworm: new Decimal(1),
          },
        },
      }),
    ).not.toThrow();
  });

  it("requires a player with Angler Waders boost hasn't maxed out their daily attempts", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-10-11T09:00:00Z"));

    const date = new Date().toISOString().split("T")[0];

    const bumpkinWithAnglerWaders: Bumpkin = {
      ...INITIAL_BUMPKIN,
      equipped: {
        ...INITIAL_BUMPKIN.equipped,
        pants: "Angler Waders",
      },
    };

    expect(() => {
      castRod({
        action: { bait: "Earthworm", type: "rod.casted" },
        state: {
          ...farm,
          bumpkin: bumpkinWithAnglerWaders,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Axe: new Decimal(1),
          },
          fishing: {
            dailyAttempts: {
              [date]: 30,
            },
            wharf: {},
          },
        },
      });
    }).toThrow("Daily attempts exhausted");
  });

  it("casts rod on wharf", () => {
    const now = Date.now();
    const state = castRod({
      action: { bait: "Earthworm", type: "rod.casted" },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
        },
      },
      createdAt: now,
    });

    expect(state.fishing.wharf.castedAt).toEqual(now);
  });

  it("casts rod on wharf with chum", () => {
    const now = Date.now();
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        chum: "Sunflower",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
          Sunflower: new Decimal(500),
        },
      },
      createdAt: now,
    });

    expect(state.fishing.wharf).toEqual({
      castedAt: expect.any(Number),
      bait: "Earthworm",
      chum: "Sunflower",
      multiplier: 1,
    });
  });

  it("does not subtracts rod if wearing Ancient Rod", () => {
    const state = castRod({
      action: { bait: "Earthworm", type: "rod.casted" },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: { ...INITIAL_BUMPKIN.equipped, tool: "Ancient Rod" },
        },
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
        },
      },
    });

    expect(state.inventory.Rod).toEqual(new Decimal(3));
  });

  it("subtracts extra reels", () => {
    const now = Date.now();
    const date = new Date(now).toISOString().split("T")[0];
    const state = castRod({
      action: { bait: "Earthworm", type: "rod.casted" },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(20),
          Earthworm: new Decimal(20),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [date]: 20,
          },
          extraReels: {
            count: 5,
          },
        },
      },
    });
    expect(state.fishing.extraReels?.count).toEqual(4);
  });

  it("does not subtract extra reels when daily limit not hit yet", () => {
    const now = Date.now();
    const date = new Date(now).toISOString().split("T")[0];
    const state = castRod({
      action: { bait: "Earthworm", type: "rod.casted" },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(20),
          Earthworm: new Decimal(20),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [date]: 1,
          },
          extraReels: {
            count: 5,
          },
        },
      },
    });
    expect(state.fishing.extraReels?.count).toEqual(5);
  });

  it("subtracts extra reels by the delta over the daily limit when already over the limit (multi-cast)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T00:00:00.000Z"));
    const now = Date.now();
    const date = new Date(now).toISOString().split("T")[0];

    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        multiplier: 5,
      },
      state: {
        ...farm,
        // Provide VIP so multi-cast is allowed
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: now }],
          expiresAt: now + 31 * 24 * 60 * 60 * 1000,
        },
        inventory: {
          Rod: new Decimal(20),
          Earthworm: new Decimal(20),
          "Beta Pass": new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            // Limit is 20 by default, so we're already 1 over
            [date]: 21,
          },
          extraReels: {
            count: 6,
          },
        },
      },
      createdAt: now,
    });

    expect(state.fishing.extraReels?.count).toEqual(1);
    jest.useRealTimers();
  });

  it("initializes and persists extraReels when buying reels with undefined extraReels on state", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = castRod({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(10),
          Rod: new Decimal(1),
          Earthworm: new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          // extraReels is intentionally undefined to test initialization
        },
      },
      action: { bait: "Earthworm", type: "rod.casted", reelPacksToBuy: 1 },
    });

    // Should have initialized extraReels and added 5 reels, then used 1
    expect(result.fishing.extraReels).toBeDefined();
    expect(result.fishing.extraReels?.count).toEqual(4);
    expect(result.fishing.extraReels?.timesBought?.[today]).toEqual(1);
  });

  it("correctly counts purchased reels towards totalReelsAvailable when extraReels was undefined", () => {
    const today = new Date().toISOString().split("T")[0];

    // This test ensures the purchased reels are available for the cast
    // Previously, this would fail because the purchased reels were stored
    // in a temporary object that wasn't persisted to game.fishing.extraReels
    const result = castRod({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(10),
          Rod: new Decimal(1),
          Earthworm: new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20, // At daily limit
          },
          // extraReels undefined - this is the key part of the test
        },
      },
      action: { bait: "Earthworm", type: "rod.casted", reelPacksToBuy: 1 },
    });

    // Cast should succeed (not throw "Daily attempts exhausted")
    expect(result.fishing.wharf.castedAt).toBeDefined();
    expect(result.fishing.dailyAttempts?.[today]).toEqual(21);
  });

  it("handles buying multiple packs when extraReels was undefined", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = castRod({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(70), // 10 + 20 + 40 = 70 for 3 packs
          Rod: new Decimal(1),
          Earthworm: new Decimal(1),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          // extraReels undefined
        },
      },
      action: { bait: "Earthworm", type: "rod.casted", reelPacksToBuy: 3 },
    });

    // Should have 3 packs * 5 reels = 15 reels, minus 1 used = 14
    expect(result.fishing.extraReels?.count).toEqual(14);
    expect(result.fishing.extraReels?.timesBought?.[today]).toEqual(3);
    expect(result.inventory.Gem).toEqual(new Decimal(0));
  });
});

describe("getDailyFishingLimit", () => {
  it("increases fishing limit by 10 when Angler Waders is equipped", () => {
    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            pants: "Angler Waders",
          },
        },
      },
      Date.now(),
    );
    expect(limit).toEqual(30);
  });

  it("increases fishing limit by 10 with Fisherman's 10 Fold skill", () => {
    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Fisherman's 10 Fold": 1,
          },
        },
      },
      Date.now(),
    );
    expect(limit).toEqual(30);
  });

  it("increases fishing limit by 5 with Fisherman's 5 Fold skill", () => {
    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Fisherman's 5 Fold": 1,
          },
        },
      },
      Date.now(),
    );
    expect(limit).toEqual(25);
  });

  it("increases fishing limit by 5 with Reelmaster's Chair", () => {
    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
        },
        collectibles: {
          "Reelmaster's Chair": [
            {
              readyAt: 1,
              coordinates: { x: 0, y: 0 },
              createdAt: 1,
              id: "1",
            },
          ],
        },
      },
      Date.now(),
    );
    expect(limit).toEqual(25);
  });

  it("increases fishing limit by 5 for VIP during Crabs and Traps", () => {
    jest.useFakeTimers();
    jest.setSystemTime(CHAPTERS["Crabs and Traps"].startDate);

    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        vip: {
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
          bundles: [],
        },
      },
      Date.now(),
    );

    expect(limit).toEqual(25);
    jest.useRealTimers();
  });

  it("does not increase fishing limit for VIP outside Crabs and Traps", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T00:00:00.000Z"));

    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        vip: {
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
          bundles: [],
        },
      },
      Date.now(),
    );

    expect(limit).toEqual(20);
    jest.useRealTimers();
  });

  it("does not increase fishing limit when VIP expired at cast time", () => {
    jest.useFakeTimers();
    jest.setSystemTime(CHAPTERS["Crabs and Traps"].startDate);

    const { limit } = getDailyFishingLimit(
      {
        ...INITIAL_FARM,
        vip: {
          expiresAt: Date.now() - 1000,
          bundles: [],
        },
      },
      Date.now(),
    );

    expect(limit).toEqual(20);
    jest.useRealTimers();
  });
});

describe("getReelsPackGemPrice", () => {
  it("returns the correct price for 1 pack", () => {
    const price = getReelsPackGemPrice({
      state: farm,
      packs: 1,
    });
    expect(price).toEqual(10);
  });

  it("increases price of gems by 2x after buying once", () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const price = getReelsPackGemPrice({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(10),
        },
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          extraReels: {
            timesBought: {
              [today]: 1,
            },
            count: 0,
          },
        },
      },
      packs: 1,
      createdAt: Date.now(),
    });
    expect(price).toEqual(20);
  });

  it("scales price exponentially across multiple packs in one purchase", () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const price = getReelsPackGemPrice({
      state: {
        ...INITIAL_FARM,
        fishing: {
          wharf: {},
          dailyAttempts: {
            [today]: 20,
          },
          extraReels: {
            timesBought: {
              [today]: 2,
            },
            count: 0,
          },
        },
      },
      packs: 3,
      createdAt: Date.now(),
    });
    // Prices: 40, 80, 160 => total 280
    expect(price).toEqual(280);
  });
});
