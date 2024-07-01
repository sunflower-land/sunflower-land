import { TEST_FARM } from "features/game/lib/constants";
import { playMinigame } from "./playMinigame";

describe("minigame.played", () => {
  it("requires minigame exists", () => {
    expect(() =>
      playMinigame({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          score: 10,
          type: "minigame.played",
        },
      }),
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("updates the first attempt", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = playMinigame({
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
        type: "minigame.played",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 10,
          attempts: 1,
        },
      },
    });
  });

  it("updates a highscore", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = playMinigame({
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
        type: "minigame.played",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 15,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 15,
          attempts: 3,
        },
      },
    });
  });

  it("does not update a highscore", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = playMinigame({
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
        type: "minigame.played",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 10,
          attempts: 3,
        },
      },
    });
  });
});
