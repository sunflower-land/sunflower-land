import "lib/__mocks__/configMock";

import { MAX_FEATHERS_PER_WEEK, saveMaze } from "./saveMaze";
import { jest } from "@jest/globals";
import { Inventory, SeasonWeek } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import Decimal from "decimal.js-light";
import { MAZE_TIME_LIMIT_SECONDS } from "./startMaze";

const INSIDE_WITCHES_EVE_DATE = new Date("2023-08-5");

describe("mazeSaved", () => {
  const weeklyLostCrowCount = 25;
  let week: SeasonWeek;

  beforeAll(() => {
    const timers = jest.useFakeTimers();

    timers.setSystemTime(new Date(INSIDE_WITCHES_EVE_DATE));

    week = getSeasonWeek();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("throws an error if no Bumpkin is found", () => {
    expect(() =>
      saveMaze({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "maze.saved",
          crowsFound: 0,
          health: 0,
          timeRemaining: 0,
        },
      })
    ).toThrow("Bumpkin not found");
  });

  it("throws an error if the season has not started", () => {
    process.env.NETWORK = "mainnet";

    expect(() =>
      saveMaze({
        state: {
          ...TEST_FARM,
        },
        action: {
          type: "maze.saved",
          crowsFound: 0,
          health: 0,
          timeRemaining: 0,
        },
        // Fri Jul 28 2023 15:11:18 GMT+1000
        createdAt: 1690521314139,
      })
    ).toThrow("Witches eve has not started");
  });

  it("throws an error if witches eve is not available on the gameState", () => {
    expect(() =>
      saveMaze({
        state: {
          ...TEST_FARM,
          witchesEve: undefined,
        },
        action: {
          type: "maze.saved",
          crowsFound: 0,
          health: 0,
          timeRemaining: 0,
        },
      })
    ).toThrow("Witches eve not found on game state");
  });

  it("throws an error if the player has no maze data for the current week", () => {
    expect(() =>
      saveMaze({
        state: {
          ...TEST_FARM,
          witchesEve: {
            weeklyLostCrowCount,
            maze: {},
          },
        },
        action: {
          type: "maze.saved",
          crowsFound: 0,
          health: 0,
          timeRemaining: 0,
        },
      })
    ).toThrow("Maze data not found for current week");
  });

  it("updates values an active attempt", () => {
    const crowsFound = 5;
    const health = 3;
    const timeRemaining = 30;

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    expect(state.witchesEve?.maze?.[week]?.attempts).toHaveLength(1);
    expect(state.witchesEve?.maze?.[week]?.attempts[0]).toEqual(
      expect.objectContaining({
        crowsFound,
        health,
        time: MAZE_TIME_LIMIT_SECONDS - timeRemaining,
      })
    );
    expect(
      state.witchesEve?.maze?.[week]?.attempts[0].completedAt
    ).toBeUndefined();
  });

  it("returns the same state if the player has no active attempt", () => {
    const state = saveMaze({
      state: {
        ...TEST_FARM,
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
        type: "maze.saved",
        crowsFound: 0,
        health: 0,
        timeRemaining: 0,
      },
    });

    expect(state).toEqual({
      ...TEST_FARM,
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
    });
  });

  it("doesn't reward feathers if attempt is not completed", () => {
    const crowsFound = 5;
    const health = 3;
    const timeRemaining = 30;

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    expect(state.inventory["Crow Feather"] ?? new Decimal(0)).toEqual(
      new Decimal(0)
    );
  });

  it("sets completedAt on an attempt that has ended", () => {
    const crowsFound = 20;
    const health = 3;
    const timeRemaining = 30;
    const now = Date.now();

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
        completedAt: now,
      },
    });

    expect(state.witchesEve?.maze?.[week]?.attempts).toHaveLength(1);
    expect(state.witchesEve?.maze?.[week]?.attempts[0]).toEqual(
      expect.objectContaining({
        crowsFound,
        health,
        time: MAZE_TIME_LIMIT_SECONDS - timeRemaining,
        completedAt: now,
      })
    );
  });

  it("updates highestScore if the score is higher than the previous highestScore", () => {
    const crowsFound = 20;
    const health = 3;
    const timeRemaining = 30;

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
        completedAt: Date.now(),
      },
    });

    expect(state.witchesEve?.maze?.[week]?.highestScore).toEqual(crowsFound);
  });

  it("does not reward crow feathers they player loses (health 0 || timeRemaining 0)", () => {
    const state = saveMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound: 10,
        health: 0,
        timeRemaining: 0,
        completedAt: Date.now(),
      },
    });

    const feathers = state.inventory["Crow Feather"] ?? new Decimal(0);

    expect(feathers).toEqual(new Decimal(0));
  });

  it("rewards the player 4 feathers per crow * crows found when no claimed feathers", () => {
    const crowsFound = 10;
    const health = 3;
    const timeRemaining = 30;
    // Lost crows: 25
    const feathersPerCrow = MAX_FEATHERS_PER_WEEK / weeklyLostCrowCount; // 4

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore: 0,
              claimedFeathers: 0,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
        completedAt: Date.now(),
      },
    });

    expect(state.inventory["Crow Feather"]).toEqual(
      new Decimal(feathersPerCrow * crowsFound)
    );
  });

  it("doesn't reward players any feather if their score is lower than the current highest score", () => {
    const crowsFound = 10;
    const health = 3;
    const timeRemaining = 30;
    const claimedFeathers = 30;
    const highestScore = 15;

    const currentInventory: Inventory = {
      "Crow Feather": new Decimal(claimedFeathers),
    };

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        inventory: currentInventory,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore,
              claimedFeathers,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
        completedAt: Date.now(),
      },
    });

    expect(state.witchesEve?.maze[week]?.claimedFeathers).toEqual(30);
    expect(state.inventory["Crow Feather"]).toEqual(
      currentInventory["Crow Feather"]
    );
  });

  it("rewards the player 4 feathers per crow * crows found minus any claimed feathers", () => {
    const crowsFound = 15;
    const health = 3;
    const timeRemaining = 30;
    const claimedFeathers = 30;
    const highestScore = 10;
    // Lost crows: 25
    const feathersPerCrow = MAX_FEATHERS_PER_WEEK / weeklyLostCrowCount; // 4

    const currentInventory: Inventory = {
      "Crow Feather": new Decimal(claimedFeathers),
    };

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        inventory: currentInventory,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore,
              claimedFeathers,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
        completedAt: Date.now(),
      },
    });

    const totalReward = feathersPerCrow * crowsFound; // 60;
    const expectedFeathers = totalReward - claimedFeathers; // 30

    const currentFeathers = currentInventory["Crow Feather"] ?? new Decimal(0);
    const newInventory = currentFeathers.add(new Decimal(expectedFeathers));

    expect(state.inventory["Crow Feather"]).toEqual(newInventory);
    expect(state.witchesEve?.maze?.[week]?.claimedFeathers).toBe(60);
  });

  it("rewards players the total remaining unclaimed feathers if they find all the crows", () => {
    const crowsFound = 25;
    const health = 3;
    const timeRemaining = 30;
    const claimedFeathers = 30;
    const highestScore = 15;
    // Lost crows: 25
    const feathersPerCrow = MAX_FEATHERS_PER_WEEK / weeklyLostCrowCount; // 4

    const currentInventory: Inventory = {
      "Crow Feather": new Decimal(claimedFeathers),
    };

    const state = saveMaze({
      state: {
        ...TEST_FARM,
        inventory: currentInventory,
        witchesEve: {
          weeklyLostCrowCount,
          maze: {
            [week]: {
              highestScore,
              claimedFeathers,
              attempts: [{ crowsFound: 1, health: 3, timeRemaining: 60 }],
            },
          },
        },
      },
      action: {
        type: "maze.saved",
        crowsFound,
        health,
        timeRemaining,
        completedAt: Date.now(),
      },
    });

    const totalReward = feathersPerCrow * weeklyLostCrowCount; // 100
    const expectedFeathers = totalReward - claimedFeathers; // 70

    const currentFeathers = currentInventory["Crow Feather"] ?? new Decimal(0);
    const newInventory = currentFeathers.add(new Decimal(expectedFeathers));

    expect(state.inventory["Crow Feather"]).toEqual(newInventory);
    expect(state.witchesEve?.maze?.[week]?.claimedFeathers).toBe(100);
  });
});
