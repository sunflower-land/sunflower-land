import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  TEST_FARM,
} from "features/game/lib/constants";
import { castRod } from "./castRod";
import Decimal from "decimal.js-light";
import { Bumpkin } from "features/game/types/game";
import { Chum, getDailyFishingLimit } from "features/game/types/fishing";

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

  describe("getDailyFishingLimit", () => {
    it("increases fishing limit by 10 when Angler Waders is equipped", () => {
      const { limit } = getDailyFishingLimit({
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            pants: "Angler Waders",
          },
        },
      });
      expect(limit).toEqual(30);
    });

    it("increases fishing limit by 10 with Fisherman's 10 Fold skill", () => {
      const { limit } = getDailyFishingLimit({
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Fisherman's 10 Fold": 1,
          },
        },
      });
      expect(limit).toEqual(30);
    });

    it("increases fishing limit by 5 with Fisherman's 5 Fold skill", () => {
      const { limit } = getDailyFishingLimit({
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Fisherman's 5 Fold": 1,
          },
        },
      });
      expect(limit).toEqual(25);
    });

    it("increases fishing limit by 5 with Reelmaster's Chair", () => {
      const { limit } = getDailyFishingLimit({
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
      });
      expect(limit).toEqual(25);
    });
  });
});
