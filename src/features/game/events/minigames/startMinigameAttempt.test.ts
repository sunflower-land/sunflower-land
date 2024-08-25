import { TEST_FARM } from "features/game/lib/constants";
import { startMinigameAttempt } from "./startMinigameAttempt";

describe("minigame.attemptStarted", () => {
  it("requires minigame exists", () => {
    expect(() =>
      startMinigameAttempt({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          type: "minigame.attemptStarted",
        },
      }),
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("updates the first attempt", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = startMinigameAttempt({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {},
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.attemptStarted",
      },
      createdAt: date.getTime(),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 0,
      history: {
        [date.toISOString().substring(0, 10)]: {
          highscore: 0,
          attempts: 1,
        },
      },
    });
  });

  it("updates more attempts", () => {
    const date = new Date("2024-05-04T00:00:00Z");
    const state = startMinigameAttempt({
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
        type: "minigame.attemptStarted",
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
