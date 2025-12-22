import { claimDailyReward } from "./claimDailyReward";
import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { getChapterTicket } from "features/game/types/chapters";
import { calculateXPPotion } from "features/game/types/dailyRewards";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";

const LEVEL_3_EXPERIENCE = 30; // >= 22 (level 3+ required for rewards)

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
            experience: LEVEL_3_EXPERIENCE,
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
          experience: LEVEL_3_EXPERIENCE,
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(1);
    expect(state.dailyRewards?.chest?.collectedAt).toEqual(now);
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(70));
    expect(state.inventory["Rhubarb Seed"]).toEqual(new Decimal(30));
    expect(state.inventory["Carrot Seed"]).toEqual(new Decimal(20));
    expect(state.coins).toBe(50);
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getChapterTicket(now)]).toEqual(new Decimal(1));
  });
  it("keeps streak for first 7 days even if a day is missed", () => {
    const now = new Date("2025-01-10T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
        },
        dailyRewards: {
          streaks: 5, // day 6 incoming
          chest: {
            collectedAt: now - 48 * 60 * 60 * 1000, // missed a day
            code: 1,
          },
        },
        farmActivity: {}, // new player safeguard
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(6);
    expect(state.inventory["Rod"]).toEqual(new Decimal(3));
    expect(state.inventory["Earthworm"]).toEqual(new Decimal(5));
    expect(state.inventory["Carrot"]).toEqual(new Decimal(30));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
  });

  it("awards onboarding day 7 rewards", () => {
    const now = new Date("2025-01-07T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
        },
        dailyRewards: {
          streaks: 6,
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
        farmActivity: {},
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(7);
    expect(state.inventory["Weekly Mega Box"]).toEqual(new Decimal(1));
    expect(state.inventory["Gem"]).toEqual(new Decimal(50 + 20)); // 20 initial + 50 reward
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getChapterTicket(now)]).toEqual(new Decimal(1));
  });

  it("resets streak after onboarding when a day is missed", () => {
    const now = new Date("2025-02-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
        },
        dailyRewards: {
          streaks: 8, // beyond onboarding
          chest: {
            collectedAt: now - 48 * 60 * 60 * 1000, // missed a day
            code: 1,
          },
        },
        farmActivity: { "Daily Reward Collected": 10 }, // disable onboarding protection
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(1); // reset then increment
    expect(state.inventory["Axe"]).toEqual(new Decimal(5));
    expect(state.inventory["Pickaxe"]).toEqual(new Decimal(2));
    expect(state.inventory["Stone Pickaxe"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
  });

  it("grants weekly buff reward and default rewards", () => {
    const now = new Date("2025-02-05T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
        },
        dailyRewards: {
          streaks: 1, // claiming weekly day 2 (Growth Boost - buff)
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
        farmActivity: { "Daily Reward Collected": 10 },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(2);
    expect(state.buffs?.["Power hour"]).toBeDefined();
    expect(state.inventory["Cheer"]).toEqual(new Decimal(3));
    expect(state.inventory[getChapterTicket(now)]).toEqual(new Decimal(1));
  });

  it("scales weekly tool rewards with higher level", () => {
    const now = new Date("2025-03-01T05:00:00.000Z").getTime();
    const highLevel = 60;
    const highLevelXp =
      LEVEL_EXPERIENCE[highLevel as keyof typeof LEVEL_EXPERIENCE];

    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: highLevelXp,
        },
        dailyRewards: {
          streaks: 7, // weekly day 1 (streak%7 === 0)
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
        farmActivity: { "Daily Reward Collected": 10 },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.dailyRewards?.streaks).toBe(8);
    expect(state.inventory["Axe"]).toEqual(new Decimal(15)); // 5 * ceil(60/25)
    expect(state.inventory["Pickaxe"]).toEqual(new Decimal(6)); // 2 * ceil(60/25)
    expect(state.inventory["Stone Pickaxe"]).toEqual(new Decimal(3)); // 1 * ceil(60/25)
  });

  it("awards different XP potion amounts by level", () => {
    const now = new Date("2025-03-02T05:00:00.000Z").getTime();

    const level10 = 10 as const;
    const xpAt10 = LEVEL_EXPERIENCE[level10];
    const xpNeeded10 =
      LEVEL_EXPERIENCE[(level10 + 1) as keyof typeof LEVEL_EXPERIENCE] - xpAt10;
    const expectedXp10 = calculateXPPotion(level10, xpNeeded10);

    const state10 = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: xpAt10,
        },
        dailyRewards: {
          streaks: 4, // weekly day 5 (Growth Feast - XP reward)
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
        farmActivity: { "Daily Reward Collected": 10 },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state10.dailyRewards?.streaks).toBe(5);
    expect(state10.bumpkin?.experience).toBe(xpAt10 + expectedXp10);

    const level50 = 50 as const;
    const xpAt50 = LEVEL_EXPERIENCE[level50];
    const xpNeeded50 =
      LEVEL_EXPERIENCE[(level50 + 1) as keyof typeof LEVEL_EXPERIENCE] - xpAt50;
    const expectedXp50 = calculateXPPotion(level50, xpNeeded50);

    const state50 = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: xpAt50,
        },
        dailyRewards: {
          streaks: 4, // weekly day 5 (Growth Feast - XP reward)
          chest: {
            collectedAt: now - 24 * 60 * 60 * 1000,
            code: 1,
          },
        },
        farmActivity: { "Daily Reward Collected": 10 },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state50.dailyRewards?.streaks).toBe(5);
    expect(state50.bumpkin?.experience).toBe(xpAt50 + expectedXp50);

    // Higher level should grant different XP than lower level
    expect(expectedXp50).not.toBe(expectedXp10);
  });

  it("should claim day 365", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
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
    expect(state.inventory[getChapterTicket(now)]).toEqual(new Decimal(1));
  });
  it("should claim day 730", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
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
    expect(state.inventory[getChapterTicket(now)]).toEqual(new Decimal(1));
  });

  it("should award 2 extra cheers for giant gold bone", () => {
    const now = new Date("2025-01-01T05:00:00.000Z").getTime();
    const state = claimDailyReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: LEVEL_3_EXPERIENCE,
        },
        collectibles: {
          "Giant Gold Bone": [
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
        dailyRewards: {
          streaks: 8, // beyond onboarding
          chest: {
            collectedAt: now - 48 * 60 * 60 * 1000, // missed a day
            code: 1,
          },
        },
      },
      action: { type: "dailyReward.claimed" },
      createdAt: now,
    });

    expect(state.inventory["Cheer"]).toEqual(new Decimal(5));
    expect(state.boostsUsedAt?.["Giant Gold Bone"]).toBe(now);
  });
});
