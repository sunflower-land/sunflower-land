import { claimDailyCheers } from "./claimDailyCheers";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("claimDailyCheers", () => {
  it("should claim daily free cheers", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: INITIAL_FARM,
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.socialFarming.cheers.cheersUsed).toBe(0);
    expect(game?.socialFarming.cheers.freeCheersClaimedAt).toBe(now);
  });

  it("should prevent claiming a daily cheers twice in one day", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: INITIAL_FARM,
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(() =>
      claimDailyCheers({
        state: game,
        action: { type: "cheers.claimed" },
        createdAt: now,
      }),
    ).toThrow("Already claimed your daily free cheers");
  });

  it("gives three free cheers to the player", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          points: 0,
          villageProjects: {},
          cheersGiven: {
            date: new Date(now).toISOString().split("T")[0],
            projects: {},
            farms: [],
          },
          cheers: {
            freeCheersClaimedAt: now - 24 * 60 * 60 * 1000,
            cheersUsed: 3,
          },
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.inventory.Cheer?.toNumber()).toBe(3);
  });

  it("gives three free cheers to the player if they didn't claim yesterday", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          points: 0,
          villageProjects: {},
          cheersGiven: {
            date: new Date(now).toISOString().split("T")[0],
            projects: {},
            farms: [],
          },
          cheers: {
            freeCheersClaimedAt: now - 48 * 60 * 60 * 1000,
            cheersUsed: 0,
          },
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.inventory.Cheer?.toNumber()).toBe(3);
  });

  it("should only give bonus cheers if the player has used their free cheers", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          points: 0,
          villageProjects: {},
          cheersGiven: {
            date: new Date(now).toISOString().split("T")[0],
            projects: {},
            farms: [],
          },
          cheers: {
            freeCheersClaimedAt: now - 24 * 60 * 60 * 1000,
            cheersUsed: 2,
          },
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.inventory.Cheer?.toNumber()).toBe(2);
  });

  it("should only give a maximum of 3 bonus cheers if the player has used more than 3 cheers yesterday", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          points: 0,
          villageProjects: {},
          cheersGiven: {
            date: new Date(now).toISOString().split("T")[0],
            projects: {},
            farms: [],
          },
          cheers: {
            freeCheersClaimedAt: now - 24 * 60 * 60 * 1000,
            cheersUsed: 4,
          },
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.inventory.Cheer?.toNumber()).toBe(3);
  });

  it("should give 3 free cheers to player on 4th August 2025, regardless of previous day's value", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-08-04T00:00:00.000Z"));
    const now = Date.now();
    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          points: 0,
          villageProjects: {},
          cheersGiven: {
            date: new Date(now).toISOString().split("T")[0],
            projects: {},
            farms: [],
          },
          cheers: {
            freeCheersClaimedAt: now - 24 * 60 * 60 * 1000,
            cheersUsed: 0,
          },
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.inventory.Cheer?.toNumber()).toBe(3);

    jest.useRealTimers();
  });
});
