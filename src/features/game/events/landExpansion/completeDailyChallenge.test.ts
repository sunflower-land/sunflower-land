import Decimal from "decimal.js-light";
import { completeDailyChallenge } from "./completeDailyChallenge";
import { INITIAL_FARM } from "features/game/lib/constants";
import { ONBOARDING_CHALLENGES } from "features/game/types/rewards";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";

describe("completeDailyChallenge", () => {
  it("requires daily challenge is complete", () => {
    expect(() =>
      completeDailyChallenge({
        action: {
          type: "dailyChallenge.completed",
        },
        state: INITIAL_FARM,
      }),
    ).toThrow("Daily challenge is not completed");
  });

  it("completes the first challenge", () => {
    const firstChallenge = ONBOARDING_CHALLENGES[0];

    const state = completeDailyChallenge({
      action: {
        type: "dailyChallenge.completed",
      },
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          activity: {
            ["Tree Chopped"]: firstChallenge.requirement,
          },
        },
      },
    });

    expect(state.coins).toEqual(firstChallenge.reward.coins);
  });

  it("starts the next task immediately if onboarding", () => {
    const firstChallenge = ONBOARDING_CHALLENGES[0];

    const state = completeDailyChallenge({
      action: {
        type: "dailyChallenge.completed",
      },
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          activity: {
            ["Tree Chopped"]: firstChallenge.requirement,
          },
        },
      },
    });

    expect(state.coins).toEqual(firstChallenge.reward.coins);
    expect(state.rewards.challenges.completed).toEqual(1);
    expect(state.rewards.challenges.active).toEqual({
      index: 1,
      startCount: 0,
    });
  });

  it.skip("does not start the next task immediately if finished onboarding", () => {
    const firstChallenge = ONBOARDING_CHALLENGES[0];

    const now = Date.now();
    const state = completeDailyChallenge({
      action: {
        type: "dailyChallenge.completed",
      },
      state: {
        ...INITIAL_FARM,
        rewards: {
          challenges: {
            ...INITIAL_FARM.rewards.challenges,
            completed: 7,
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          activity: {
            ["Tree Chopped"]: firstChallenge.requirement,
          },
        },
      },
      createdAt: now,
    });

    expect(state.coins).toEqual(firstChallenge.reward.coins);
    expect(state.rewards.challenges.active).toEqual({
      index: 0,
      startCount: 0,
      completedAt: now,
    });
  });

  it("completes the second challenge", () => {
    const state = completeDailyChallenge({
      action: {
        type: "dailyChallenge.completed",
      },
      state: {
        ...INITIAL_FARM,
        rewards: {
          challenges: {
            ...INITIAL_FARM.rewards.challenges,
            active: {
              index: 1,
              startCount: 0,
            },
            completed: 1,
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 100,
        },
      },
    });

    expect(state.inventory["Mashed Potato"]).toEqual(new Decimal(1));
  });

  it("completes the last challenge", () => {
    const state = completeDailyChallenge({
      action: {
        type: "dailyChallenge.completed",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "spring",
        },
        rewards: {
          challenges: {
            ...INITIAL_FARM.rewards.challenges,
            active: {
              index: 12,
              startCount: 0,
            },
            completed: 12,
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 100,
        },
      },
    });

    expect(state.coins).toEqual(1000);
    expect(state.inventory["Pickaxe"]).toEqual(new Decimal(10));
    expect(state.inventory["Iron Pickaxe"]).toEqual(new Decimal(5));
    expect(state.wardrobe["Unicorn Hat"]).toEqual(1);
  });
});
