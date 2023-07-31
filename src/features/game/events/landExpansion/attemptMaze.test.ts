import Decimal from "decimal.js-light";

import {
  MAX_FEATHERS_PER_WEEK,
  MAZE_TIME_LIMIT_SECONDS,
  mazeAttempted,
} from "./attemptMaze";
import { jest } from "@jest/globals";
import { GameState, Inventory, SeasonWeek } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";

const GAME_STATE: GameState = {
  ...TEST_FARM,
};

const INSIDE_WITCHES_EVE_DATE = new Date("2023-08-5");

describe("mazeAttempted", () => {
  // Lost crows: 25
  const lostCrowCount = 25;
  let week: SeasonWeek;

  beforeAll(() => {
    const timers = jest.useFakeTimers();

    timers.setSystemTime(new Date(INSIDE_WITCHES_EVE_DATE));

    week = getSeasonWeek(Date.now());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("throws an error if no Bumpkin is found", () => {
    expect(() =>
      mazeAttempted({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "maze.attempted",
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
      mazeAttempted({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "maze.attempted",
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
      mazeAttempted({
        state: {
          ...GAME_STATE,
          witchesEve: undefined,
        },
        action: {
          type: "maze.attempted",
          crowsFound: 0,
          health: 0,
          timeRemaining: 0,
        },
      })
    ).toThrow("Witches eve not found on game state");
  });

  it("does not reward crow feathers they player loses (health 0 || timeRemaining 0)", () => {
    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        witchesEve: {
          weeklyLostCrowCount: 25,
          maze: {},
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound: 0,
        health: 0,
        timeRemaining: 0,
      },
    });

    const feathers = state.inventory["Crow Feather"] ?? new Decimal(0);

    expect(feathers).toEqual(new Decimal(0));
  });

  it("records stats for an attempt that ended as a loss", () => {
    const crowsFound = 5;
    const health = 0;
    const timeRemaining = 30;

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        witchesEve: {
          weeklyLostCrowCount: 25,
          maze: {},
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    expect(state.witchesEve?.maze?.[week]?.losses).toHaveLength(1);
    expect(state.witchesEve?.maze?.[week]?.losses[0]).toEqual({
      crowsFound,
      health,
      time: MAZE_TIME_LIMIT_SECONDS - timeRemaining,
    });
  });

  it("rewards the player 4 feathers per crow * crows found when no claimed feathers", () => {
    const crowsFound = 10;
    const health = 3;
    const timeRemaining = 30;
    // Lost crows: 25
    const feathersPerCrow = MAX_FEATHERS_PER_WEEK / lostCrowCount; // 4

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        witchesEve: {
          weeklyLostCrowCount: 25,
          maze: {},
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    expect(state.inventory["Crow Feather"]).toEqual(
      new Decimal(feathersPerCrow * crowsFound)
    );
  });

  it("rewards the player 4 feathers per crow * crows found minus any claimed feathers", () => {
    const crowsFound = 15;
    const health = 3;
    const timeRemaining = 30;
    const claimedFeathers = 30;
    const highestScore = 10;
    // Lost crows: 25
    const feathersPerCrow = MAX_FEATHERS_PER_WEEK / lostCrowCount; // 4

    const currentInventory: Inventory = {
      "Crow Feather": new Decimal(claimedFeathers),
    };

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        inventory: currentInventory,
        witchesEve: {
          weeklyLostCrowCount: lostCrowCount,
          maze: {
            [week]: {
              highestScore,
              claimedFeathers,
              wins: [],
              losses: [],
            },
          },
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    const totalReward = feathersPerCrow * crowsFound; // 60;
    const expectedFeathers = totalReward - claimedFeathers; // 30

    const newInventory = currentInventory["Crow Feather"]!.add(
      new Decimal(expectedFeathers)
    );

    expect(state.inventory["Crow Feather"]).toEqual(newInventory);
    expect(state.witchesEve?.maze?.[week]?.claimedFeathers).toBe(60);
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

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        inventory: currentInventory,
        witchesEve: {
          weeklyLostCrowCount: lostCrowCount,
          maze: {
            [week]: {
              highestScore,
              claimedFeathers,
              wins: [{ crowsFound: 10, health: 2, time: 30 }],
              losses: [],
            },
          },
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    expect(state.witchesEve?.maze[week]?.claimedFeathers).toEqual(30);
    expect(state.inventory["Crow Feather"]).toEqual(
      currentInventory["Crow Feather"]
    );
  });

  it("rewards players the total remaining unclaimed feathers if they complete the maze", () => {
    const crowsFound = 25;
    const health = 3;
    const timeRemaining = 30;
    const claimedFeathers = 30;
    const highestScore = 15;
    // Lost crows: 25
    const feathersPerCrow = MAX_FEATHERS_PER_WEEK / lostCrowCount; // 4

    const currentInventory: Inventory = {
      "Crow Feather": new Decimal(claimedFeathers),
    };

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        inventory: currentInventory,
        witchesEve: {
          weeklyLostCrowCount: lostCrowCount,
          maze: {
            [week]: {
              highestScore,
              claimedFeathers,
              wins: [{ crowsFound: 10, health: 2, time: 30 }],
              losses: [],
            },
          },
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    const totalReward = feathersPerCrow * lostCrowCount; // 100
    const expectedFeathers = totalReward - claimedFeathers; // 70

    const newInventory = currentInventory["Crow Feather"]!.add(
      new Decimal(expectedFeathers)
    );

    expect(state.inventory["Crow Feather"]).toEqual(newInventory);
    expect(state.witchesEve?.maze?.[week]?.claimedFeathers).toBe(100);
  });

  it("records stats for a an attempt that ended in a win", () => {
    const crowsFound = 10;
    const health = 2;
    const timeRemaining = 30;

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        witchesEve: {
          weeklyLostCrowCount: 25,
          maze: {},
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
    });

    expect(state.witchesEve?.maze?.[week]?.wins).toHaveLength(1);
    expect(state.witchesEve?.maze?.[week]?.wins[0]).toEqual({
      crowsFound,
      health,
      time: MAZE_TIME_LIMIT_SECONDS - timeRemaining,
    });
  });

  it("sets completed at when all feathers have been claimed", () => {
    const crowsFound = 25;
    const health = 2;
    const timeRemaining = 30;

    const now = Date.now();

    const state = mazeAttempted({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crow Feather": new Decimal(60),
        },
        witchesEve: {
          weeklyLostCrowCount: lostCrowCount,
          maze: {
            [week]: {
              highestScore: 15,
              claimedFeathers: 60,
              wins: [{ crowsFound: 15, health: 2, time: 30 }],
              losses: [],
            },
          },
        },
      },
      action: {
        type: "maze.attempted",
        crowsFound,
        health,
        timeRemaining,
      },
      createdAt: now,
    });

    expect(state.witchesEve?.maze?.[week]?.completedAt).toBe(now);
    expect(state.witchesEve?.maze?.[week]?.claimedFeathers).toBe(
      MAX_FEATHERS_PER_WEEK
    );
  });
});
