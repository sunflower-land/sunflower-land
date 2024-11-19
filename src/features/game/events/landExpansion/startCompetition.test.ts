import { INITIAL_FARM } from "features/game/lib/constants";
import { startCompetition } from "./startCompetition";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import Decimal from "decimal.js-light";

describe("startCompetition", () => {
  it("requires competition exists", () => {
    expect(() =>
      startCompetition({
        action: {
          type: "competition.started",
          name: "fake" as any,
        },
        state: INITIAL_FARM,
      }),
    ).toThrow("Competition does not exist");
  });

  it("requires it has started", () => {
    expect(() =>
      startCompetition({
        action: {
          type: "competition.started",
          name: "FSL",
        },
        state: INITIAL_FARM,
        createdAt: new Date("2023-04-04").getTime(),
      }),
    ).toThrow("Competition has not started");
  });
  it("requires it has not ended", () => {
    expect(() =>
      startCompetition({
        action: {
          type: "competition.started",
          name: "FSL",
        },
        state: INITIAL_FARM,
        createdAt: new Date("2025-04-04").getTime(),
      }),
    ).toThrow("Competition has ended");
  });

  it("requires player has not already started progress", () => {
    expect(() =>
      startCompetition({
        action: {
          type: "competition.started",
          name: "FSL",
        },
        state: {
          ...INITIAL_FARM,
          competitions: {
            progress: {
              FSL: {
                startedAt: 100000000,
                initialProgress: {
                  "Complete chore": 0,
                  "Complete delivery": 0,
                  "Expand island": 0,
                  "Level up": 0,
                },
              },
            },
          },
        },
        createdAt: new Date("2024-10-15").getTime(),
      }),
    ).toThrow("Player has already started");
  });

  it("starts FSL competition", () => {
    const now = new Date("2024-10-15").getTime();
    const game = startCompetition({
      action: {
        type: "competition.started",
        name: "FSL",
      },
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[5],
        },
        delivery: {
          fulfilledCount: 177,
          milestone: {} as any,
          orders: [],
        },
        island: {
          type: "spring",
        },
        inventory: {
          "Basic Land": new Decimal(5),
        },
        chores: {
          choresCompleted: 13,
          chores: {} as any,
          choresSkipped: 0,
        },
      },
      createdAt: now,
    });

    expect(game.competitions).toEqual({
      progress: {
        FSL: {
          startedAt: now,
          initialProgress: {
            "Level up": 5,
            "Expand island": 8,
            "Complete delivery": 177,
            "Complete chore": 13,
          },
        },
      },
    });
  });
});
