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
      state: INITIAL_FARM,
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
            farms: [],
            projects: {},
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

    expect(game?.inventory.Cheer?.toNumber()).toBe(1);
  });
});
