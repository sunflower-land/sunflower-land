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
});
