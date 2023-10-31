import "lib/__mocks__/configMock";
import { TEST_FARM } from "features/game/lib/constants";
import { startMaze } from "./startMaze";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import { SeasonWeek } from "features/game/types/game";
import { jest } from "@jest/globals";
import Decimal from "decimal.js-light";
import { CORN_MAZES } from "features/world/ui/cornMaze/lib/mazes";

const WITCHES_EVE_ACTIVE_DATE = new Date("2023-08-5");

describe("startMaze", () => {
  const weeklyLostCrowCount = 25;
  let week: SeasonWeek;

  beforeEach(() => {
    const timers = jest.useFakeTimers();

    timers.setSystemTime(new Date(WITCHES_EVE_ACTIVE_DATE));

    week = getSeasonWeek();
  });

  afterEach(() => {
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

  it("doesn't take the SFL entry game fee if the player has already paid for the week", () => {
    const balance = new Decimal(10);
    const sflFee = new Decimal(5);

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              sflFee,
              paidEntryFee: true,
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

    expect(state.balance).toEqual(new Decimal(10));
  });

  it("throws an error if the player doesn't have enough SFL", () => {
    const WEEK_3_DATE = new Date("2023-08-19");

    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date(WEEK_3_DATE));

    const week = getSeasonWeek();
    const balance = new Decimal(2);
    const { sflFee } = CORN_MAZES[week];

    expect(() =>
      startMaze({
        state: {
          ...TEST_FARM,
          balance,
          witchesEve: {
            weeklyLostCrowCount,
            maze: {
              [week]: {
                sflFee,
                paidEntryFee: false,
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

  it("takes SFL entry fee if the fee is greater than 0 and the player hasn't already paid it", () => {
    const WEEK_3_DATE = new Date("2023-08-19");

    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date(WEEK_3_DATE));

    const week = getSeasonWeek();
    const balance = new Decimal(10);
    const { sflFee } = CORN_MAZES[week];

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              sflFee,
              paidEntryFee: false,
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

    expect(state.balance).toEqual(balance.minus(sflFee));
  });

  it("initializes a new week if there is no weekly data for the current recorded", () => {
    const WEEK_3_DATE = new Date("2023-08-19");

    const timers = jest.useFakeTimers();
    timers.setSystemTime(new Date(WEEK_3_DATE));

    const week = getSeasonWeek();
    const balance = new Decimal(10);
    const { sflFee } = CORN_MAZES[week];

    const state = startMaze({
      state: {
        ...TEST_FARM,
        balance,
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
        sflFee,
        paidEntryFee: true,
        highestScore: 0,
        claimedFeathers: 0,
        attempts: expect.any(Array),
      })
    );
  });

  it("starts a new attempt if there is no maze in progress", () => {
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
        time: 0,
      })
    );
  });
});
