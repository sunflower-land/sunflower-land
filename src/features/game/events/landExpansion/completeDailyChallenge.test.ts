import { INITIAL_FARM } from "features/game/lib/constants";
import { completeDailyChallenge } from "./completeDailyChallenge";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { ONBOARDING_CHALLENGES } from "features/game/types/rewards";

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
            [firstChallenge.activity]: firstChallenge.requirement,
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
            [firstChallenge.activity]: firstChallenge.requirement,
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
            [firstChallenge.activity]: firstChallenge.requirement,
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

  it("does not complete challenge unless work was done since it started", () => {
    const firstChallenge = ONBOARDING_CHALLENGES[0];

    expect(() =>
      completeDailyChallenge({
        action: {
          type: "dailyChallenge.completed",
        },
        state: {
          ...INITIAL_FARM,
          rewards: {
            challenges: {
              active: {
                index: 0,
                startCount: 5,
              },
              completed: 0,
            },
          },
          bumpkin: {
            ...TEST_BUMPKIN,
            activity: {
              [firstChallenge.activity]: firstChallenge.requirement,
            },
          },
        },
      }),
    ).toThrow("Daily challenge is not completed");
  });

  it.skip("requires next day has started", () => {
    expect(() =>
      completeDailyChallenge({
        action: {
          type: "dailyChallenge.completed",
        },
        state: {
          ...INITIAL_FARM,
          rewards: {
            challenges: {
              ...INITIAL_FARM.rewards.challenges,
              active: {
                index: 0,
                startCount: 0,
                completedAt: Date.now(),
              },
              completed: 1,
            },
          },
          bumpkin: {
            ...TEST_BUMPKIN,
          },
        },
      }),
    ).toThrow("Task is not yet available");
  });

  it("completes the second challenge", () => {
    const secondChallenge = ONBOARDING_CHALLENGES[1];

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
          activity: {
            [secondChallenge.activity]: secondChallenge.requirement,
          },
        },
      },
    });

    expect(state.coins).toEqual(secondChallenge.reward.coins);
  });

  it("claims a mystery prize", () => {});
});
