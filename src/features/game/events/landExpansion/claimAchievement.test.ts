import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { ACHIEVEMENTS } from "features/game/types/achievements";
import { GameState } from "features/game/types/game";
import { claimAchievement } from "./claimAchievement";

const GAME_STATE: GameState = TEST_FARM;

describe("claim achievements", () => {
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
      }),
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
      }),
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
      }),
    ).toThrow("You already have this achievement");
  });

  it("claims busy bumpkin achievement", () => {
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

  it("claims busy bumpkin coin rewards", () => {
    const coins = 0;
    const experience = 250;
    const state = claimAchievement({
      state: {
        ...GAME_STATE,
        coins,
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
    expect(state.coins).toEqual(coins + ACHIEVEMENTS()["Busy Bumpkin"].coins);
  });

  it("claims farmer bear", () => {
    const balance = new Decimal(0);
    const experience = 250;
    const state = claimAchievement({
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(2),
        },
        balance,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience,
          achievements: undefined,
          activity: {
            "Sunflower Harvested": 10000,
          },
        },
      },
      action: {
        type: "achievement.claimed",
        achievement: "Farm Hand",
      },
    });

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.inventory).toEqual({
      Pickaxe: new Decimal(2),
      "Farmer Bear": new Decimal(1),
    });
  });
});
