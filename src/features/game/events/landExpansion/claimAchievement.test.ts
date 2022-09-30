import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, INITIAL_FARM } from "features/game/lib/constants";
import { ACHIEVEMENTS } from "features/game/types/achievements";
import { GameState } from "features/game/types/game";
import { claimAchievement } from "./claimAchievement";

const GAME_STATE: GameState = INITIAL_FARM;

describe("claim achievements", () => {
  const date = Date.now();
  it("throws an error if bumpkin does not exist", () => {
    expect(() =>
      claimAchievement({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "achievement.claimed",
          achievement: "Explorer",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });
  it("throws an error if requirement is not met", () => {
    expect(() =>
      claimAchievement({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: 0,
            achievements: undefined,
          },
        },
        action: {
          type: "achievement.claimed",
          achievement: "Busy Bumpkin",
        },
      })
    ).toThrow("You do not meet the requirements");
  });
  it("throws an error if achievement has already been claimed", () => {
    expect(() =>
      claimAchievement({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: 150,
            achievements: {
              "Busy Bumpkin": 1,
            },
          },
        },
        action: {
          type: "achievement.claimed",
          achievement: "Busy Bumpkin",
        },
      })
    ).toThrow("You already have this achievement");
  });
  it("claims busy bumpkin achievment", () => {
    const state = claimAchievement({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 250,
          achievements: undefined,
        },
      },
      action: {
        type: "achievement.claimed",
        achievement: "Busy Bumpkin",
      },
    });
    expect(state.bumpkin?.achievements?.["Busy Bumpkin"]).toBe(1);
  });
  it("claims busy bumpkin rewards", () => {
    const balance = new Decimal(0);
    const experience = 250;
    const state = claimAchievement({
      state: {
        ...GAME_STATE,
        balance,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience,
          achievements: undefined,
        },
      },
      action: {
        type: "achievement.claimed",
        achievement: "Busy Bumpkin",
      },
    });
    expect(state.balance).toEqual(
      balance.add(ACHIEVEMENTS()["Busy Bumpkin"].sflReward)
    );
    expect(state.bumpkin?.experience).toEqual(
      experience + ACHIEVEMENTS()["Busy Bumpkin"].experienceReward
    );
  });
});
