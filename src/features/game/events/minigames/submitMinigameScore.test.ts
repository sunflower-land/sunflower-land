import { TEST_FARM } from "features/game/lib/constants";
import { submitMinigameScore } from "./submitMinigameScore";

describe("minigame.scoreSubmitted", () => {
  it("requires minigame exists", () => {
    expect(() =>
      submitMinigameScore({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          score: 10,
          type: "minigame.scoreSubmitted",
        },
      }),
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("updates the first score", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = submitMinigameScore({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {},
        },
      },
      action: {
        id: "chicken-rescue",
        score: 10,
        type: "minigame.scoreSubmitted",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 10,
          attempts: 0,
        },
      },
    });
  });

  it("updates a highscore", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = submitMinigameScore({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {
                [date.toISOString().substring(0, 10)]: {
                  highscore: 10,
                  attempts: 2,
                },
              },
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        score: 15,
        type: "minigame.scoreSubmitted",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 15,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 15,
          attempts: 2,
        },
      },
    });
  });

  it("does not update a highscore", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = submitMinigameScore({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {
                [date.toISOString().substring(0, 10)]: {
                  highscore: 10,
                  attempts: 2,
                },
              },
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        score: 5,
        type: "minigame.scoreSubmitted",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 10,
          attempts: 2,
        },
      },
    });
  });

  describe("tiered prizes", () => {
    const date = new Date("2026-10-27T12:00:00Z");
    const dateKey = date.toISOString().substring(0, 10);
    const prize = {
      coins: 0,
      startAt: date.getTime() - 1000,
      endAt: date.getTime() + 1000,
      items: { "Halloween Token 2026": 50 },
      wearables: {},
      score: 2000,
      tiers: [
        { score: 2000, items: { "Halloween Token 2026": 50 } },
        { score: 5000, items: { "Halloween Token 2026": 100 } },
      ],
    };

    it("records the latest run's score, even below today's best", () => {
      const state = submitMinigameScore({
        state: {
          ...TEST_FARM,
          minigames: {
            prizes: { "halloween-2026-game-2": prize },
            games: {
              "halloween-2026-game-2": {
                highscore: 9000,
                history: { [dateKey]: { highscore: 9000, attempts: 2 } },
              },
            },
          },
        },
        action: {
          id: "halloween-2026-game-2",
          score: 3000,
          type: "minigame.scoreSubmitted",
        },
        createdAt: date.getTime(),
      });

      const history =
        state.minigames.games["halloween-2026-game-2"]!.history[dateKey];
      expect(history.lastScore).toEqual(3000);
      expect(history.highscore).toEqual(9000);
    });

    it("does not record a run score for minigames without tiers", () => {
      const state = submitMinigameScore({
        state: { ...TEST_FARM, minigames: { prizes: {}, games: {} } },
        action: {
          id: "chicken-rescue",
          score: 30,
          type: "minigame.scoreSubmitted",
        },
        createdAt: date.getTime(),
      });

      expect(
        state.minigames.games["chicken-rescue"]!.history[dateKey].lastScore,
      ).toBeUndefined();
    });
  });
});
