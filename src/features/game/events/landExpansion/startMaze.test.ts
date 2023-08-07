import { TEST_FARM } from "features/game/lib/constants";
import { MAZE_TIME_LIMIT_SECONDS, startMaze } from "./startMaze";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import { SeasonWeek } from "features/game/types/game";
import { jest } from "@jest/globals";
import Decimal from "decimal.js-light";

const WITCHES_EVE_ACTIVE_DATE = new Date("2023-08-5");

describe("startMaze", () => {
  const weeklyLostCrowCount = 25;
  let week: SeasonWeek;

  beforeAll(() => {
    const timers = jest.useFakeTimers();

    timers.setSystemTime(new Date(WITCHES_EVE_ACTIVE_DATE));

    week = getSeasonWeek(Date.now());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("throws an error if the season has not started", () => {
    expect(() =>
      startMaze({
        state: {
          ...TEST_FARM,
        },
        action: {
          type: "maze.started",
        },
        // July 31st 2023
        createdAt: 1690780337574,
      })
    ).toThrow("Witches eve has not started");
  });

  it("throws an error if the bumpkin is not found", () => {
    expect(() =>
      startMaze({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "maze.started",
        },
      })
    ).toThrow("Bumpkin not found");
  });

  it("throws an error if the witches eve is not found on game state", () => {
    expect(() =>
      startMaze({
        state: {
          ...TEST_FARM,
          witchesEve: undefined,
        },
        action: {
          type: "maze.started",
        },
      })
    ).toThrow("Witches eve not found on game state");
  });

  it("doesn't start a new attempt if there is a maze in progress", () => {
    const state = startMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [
                {
                  startedAt: Date.now() - 1 * 60 * 1000, // 1 minute ago
                  crowsFound: 0,
                  health: 3,
                  timeRemaining: 120,
                },
              ],
            },
          },
        },
      },
      action: {
        type: "maze.started",
      },
    });

    expect(state.witchesEve?.maze[week]?.attempts.length).toEqual(1);
  });

  it("doesn't take 5 SFL game fee if there is a maze in progress", () => {
    const balance = new Decimal(10);

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [
                {
                  startedAt: Date.now() - 1 * 60 * 1000, // 1 minute ago
                  crowsFound: 0,
                  health: 3,
                  timeRemaining: 120,
                },
              ],
            },
          },
        },
      },
      action: {
        type: "maze.started",
      },
    });

    expect(state.balance).toEqual(balance);
  });

  it.skip("throws an error if the player doesn't have 5 SFL", () => {
    expect(() =>
      startMaze({
        state: {
          ...TEST_FARM,
          balance: new Decimal(4),
          witchesEve: {
            weeklyLostCrowCount,
            maze: {
              [week]: {
                highestScore: 0,
                claimedFeathers: 0,
                attempts: [],
              },
            },
          },
        },
        action: {
          type: "maze.started",
        },
      })
    ).toThrow("Insufficient SFL balance");
  });

  it.skip("takes 5 SFL game fee if there is no maze in progress", () => {
    const balance = new Decimal(10);

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [],
            },
          },
        },
      },
      action: {
        type: "maze.started",
      },
    });

    expect(state.balance).toEqual(balance.minus(5));
  });

  it("initializes a new week if there is no weekly data for the current recorded", () => {
    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance: new Decimal(10),
        witchesEve: {
          weeklyLostCrowCount,
          maze: {},
        },
      },
      action: {
        type: "maze.started",
      },
    });

    expect(state.witchesEve?.maze[week]).toEqual(
      expect.objectContaining({
        highestScore: 0,
        claimedFeathers: 0,
        attempts: expect.any(Array),
      })
    );
  });

  it.skip("starts a new attempt if there is no maze in progress", () => {
    const now = Date.now();

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance: new Decimal(10),
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [],
            },
          },
        },
      },
      action: {
        type: "maze.started",
      },
      createdAt: now,
    });

    expect(state.witchesEve?.maze[week]?.attempts.length).toEqual(1);
    expect(state.witchesEve?.maze[week]?.attempts[0]).toEqual(
      expect.objectContaining({
        startedAt: now,
        crowsFound: 0,
        health: 3,
        timeRemaining: MAZE_TIME_LIMIT_SECONDS,
      })
    );
  });

  it("allows a player to enter the maze for free if they have already claimed all feathers for the week", () => {
    const now = Date.now();

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance: new Decimal(10),
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 25,
              claimedFeathers: 100,
              attempts: [
                {
                  startedAt: 0,
                  crowsFound: 25,
                  health: 3,
                  timeRemaining: 10,
                  completedAt: 123456,
                },
              ],
            },
          },
        },
      },
      action: {
        type: "maze.started",
      },
      createdAt: now,
    });

    expect(state.balance).toEqual(new Decimal(10));
  });
});
