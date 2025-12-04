import { claimDailyReward } from "./claimDailyReward";
import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { getSeasonalTicket } from "features/game/types/seasons";

describe("claimDailyReward", () => {
  it("requires daily reward is ready", () => {
    expect(() =>
      claimDailyReward({
        state: INITIAL_FARM,
        action: { type: "dailyReward.claimed" },
        createdAt: Date.now(),
      }),
    ).toThrow("Daily reward not ready");
  });

  it("requires daily reward not already claimed", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    expect(() =>
      claimDailyReward({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            experience: 10000,
          },
          dailyRewards: {
            chest: {
              code: 1,
              collectedAt: now,
            },
          },
        },
        action: { type: "dailyReward.claimed" },
        createdAt: now,
      }),
    ).toThrow("Daily reward not ready");
  });

  it("should claim first reward", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(1);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Basic Farming Pack"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });
  it("should claim day one after streak ends", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
        dailyRewards: {
          streaks: 5,
          chest: {
            collectedAt: now - 36 * 60 * 60 * 1000,
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(1);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Basic Farming Pack"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });

  it("should claim day two", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
        dailyRewards: {
          streaks: 1,
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(2);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Basic Food Box"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });
  it("should claim day seven", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
        dailyRewards: {
          streaks: 6,
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(7);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Weekly Mega Box"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });
  it("should claim day eigth", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
        dailyRewards: {
          streaks: 7,
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(8);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Basic Farming Pack"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });

  it("should claim day 365", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
        dailyRewards: {
          streaks: 364,
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(365);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Pirate Cake"]).toEqual(new Decimal(10));
    expect(state.inventory["Treasure Key"]).toEqual(new Decimal(1));
    expect(state.inventory["Rare Key"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory["Luxury Key"]).toEqual(new Decimal(1));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });
  it("should claim day 730", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000,
        },
        dailyRewards: {
          streaks: 729,
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(730);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Pizza Margherita"]).toEqual(new Decimal(5));
    expect(state.inventory["Super Totem"]).toEqual(new Decimal(1));
    expect(state.inventory["Gem"]).toEqual(new Decimal(320));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory["Luxury Key"]).toEqual(new Decimal(1));
    expect(state.inventory[getSeasonalTicket(new Date(now))]).toEqual(
      new Decimal(1),
    );
  });
});
