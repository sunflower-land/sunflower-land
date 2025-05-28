import { TEST_FARM } from "features/game/lib/constants";
import { trackMinigameActivities } from "./trackMinigameActivities";
import Decimal from "decimal.js-light";

describe("minigame.activitiesTracked", () => {
  it("requires minigame exists", () => {
    expect(() =>
      trackMinigameActivities({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          activities: {
            "Activitiy Name 1": new Decimal(2),
          },
          type: "minigame.activitiesTracked",
        },
      }),
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("tracks an activity", () => {
    const state = trackMinigameActivities({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        activities: {
          "Activitiy Name 1": new Decimal(2),
        },
        type: "minigame.activitiesTracked",
      },
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      activities: {
        "Activitiy Name 1": new Decimal(2),
      },
    });
  });

  it("tracks multiple activities", () => {
    const state = trackMinigameActivities({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        activities: {
          "Activitiy Name 1": new Decimal(2),
          "Activitiy Name 2": new Decimal(3),
        },
        type: "minigame.activitiesTracked",
      },
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      activities: {
        "Activitiy Name 1": new Decimal(2),
        "Activitiy Name 2": new Decimal(3),
      },
    });
  });

  it("adds to existing activities", () => {
    const unlockedAtDate = new Date("2024-05-04T00:00:00Z");
    const now = new Date();
    const state = trackMinigameActivities({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
              activities: {
                "Activitiy Name 1": new Decimal(5),
                "Activitiy Name 2": new Decimal(7.5),
              },
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        activities: {
          "Activitiy Name 1": new Decimal(2),
          "Activitiy Name 2": new Decimal(3),
        },
        type: "minigame.activitiesTracked",
      },
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      activities: {
        "Activitiy Name 1": new Decimal(7),
        "Activitiy Name 2": new Decimal(10.5),
      },
    });
  });
});
