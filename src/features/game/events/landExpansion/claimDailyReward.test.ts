import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { claimDailyReward } from "./claimDailyReward";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

describe("claimDailyReward", () => {
  const today = Date.UTC(2024, 0, 10);

  const createBaseState = () => ({
    ...TEST_FARM,
    inventory: {},
    coins: 0,
    balance: new Decimal(0),
  });

  it("throws if the reward has already been collected today", () => {
    expect(() =>
      claimDailyReward({
        state: {
          ...createBaseState(),
          dailyRewards: { streaks: 1, chest: { code: 1, collectedAt: today } },
        },
        action: {
          type: "dailyReward.claimed",
          code: 1,
        },
        createdAt: today,
      }),
    ).toThrow("Daily reward already collected");
  });

  it("awards the first day reward and sets up the next code", () => {
    const state = claimDailyReward({
      state: {
        ...createBaseState(),
        dailyRewards: { streaks: 0, chest: { code: 1, collectedAt: 0 } },
      },
      action: {
        type: "dailyReward.claimed",
        code: 1,
      },
      createdAt: today,
    });

    expect(state.inventory["Basic Farming Pack"]).toEqual(new Decimal(1));
    expect(state.dailyRewards?.streaks).toEqual(1);
    expect(state.dailyRewards?.chest).toEqual({
      code: 2,
      collectedAt: today,
    });
  });

  it("increments the streak when collected on consecutive days", () => {
    const state = claimDailyReward({
      state: {
        ...createBaseState(),
        dailyRewards: {
          streaks: 1,
          chest: { code: 2, collectedAt: today - DAY_IN_MS },
        },
      },
      action: {
        type: "dailyReward.claimed",
        code: 2,
      },
      createdAt: today,
    });

    expect(state.inventory["Basic Food Box"]).toEqual(new Decimal(1));
    expect(state.dailyRewards?.streaks).toEqual(2);
    expect(state.dailyRewards?.chest?.code).toEqual(3);
  });

  it("resets the streak when a day is missed", () => {
    const state = claimDailyReward({
      state: {
        ...createBaseState(),
        dailyRewards: {
          streaks: 5,
          chest: { code: 3, collectedAt: today - 2 * DAY_IN_MS },
        },
      },
      action: {
        type: "dailyReward.claimed",
        code: 3,
      },
      createdAt: today,
    });

    expect(state.dailyRewards?.streaks).toEqual(1);
    expect(state.inventory["Basic Farming Pack"]).toEqual(new Decimal(1));
  });

  it("grants the yearly milestone reward on day 365", () => {
    const state = claimDailyReward({
      state: {
        ...createBaseState(),
        dailyRewards: {
          streaks: 364,
          chest: { code: 5, collectedAt: today - DAY_IN_MS },
        },
      },
      action: {
        type: "dailyReward.claimed",
        code: 5,
      },
      createdAt: today,
    });

    expect(state.dailyRewards?.streaks).toEqual(365);
    expect(state.inventory["Basic Farming Pack"]).toEqual(new Decimal(1));
    expect(state.inventory["Pirate Cake"]).toEqual(new Decimal(10));
    expect(state.inventory["Treasure Key"]).toEqual(new Decimal(1));
    expect(state.inventory["Rare Key"]).toEqual(new Decimal(1));
    expect(state.inventory["Luxury Key"]).toEqual(new Decimal(1));
    expect(state.coins).toEqual(10000);
  });

  it("grants the two year milestone reward on day 730", () => {
    const state = claimDailyReward({
      state: {
        ...createBaseState(),
        dailyRewards: {
          streaks: 729,
          chest: { code: 8, collectedAt: today - DAY_IN_MS },
        },
      },
      action: {
        type: "dailyReward.claimed",
        code: 8,
      },
      createdAt: today,
    });

    expect(state.dailyRewards?.streaks).toEqual(730);
    expect(state.inventory["Basic Food Box"]).toEqual(new Decimal(1));
    expect(state.inventory["Pizza Margherita"]).toEqual(new Decimal(5));
    expect(state.inventory["Super Totem"]).toEqual(new Decimal(1));
    expect(state.inventory["Gem"]).toEqual(new Decimal(300));
    expect(state.inventory["Luxury Key"]).toEqual(new Decimal(1));
    expect(state.coins).toEqual(10000);
  });
});
