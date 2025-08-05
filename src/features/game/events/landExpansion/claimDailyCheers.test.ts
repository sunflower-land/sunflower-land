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

    expect(game?.socialFarming.cheers.freeCheersClaimedAt).toBe(now);
    expect(game?.inventory.Cheer?.toNumber()).toBe(3);
  });

  it("gives six free cheers to the player if they have VIP", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        vip: {
          bundles: [],
          expiresAt: now + 24 * 60 * 60 * 1000,
        },
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
          },
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.socialFarming.cheers.freeCheersClaimedAt).toBe(now);
    expect(game?.inventory.Cheer?.toNumber()).toBe(6);
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
});
