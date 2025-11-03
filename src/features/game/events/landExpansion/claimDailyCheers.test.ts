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

  it("should give 5 free cheers to the player if they have Giant Gold Bone placed", () => {
    const now = Date.now();

    const game = claimDailyCheers({
      state: {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Giant Gold Bone": [
            {
              id: "1",
              createdAt: now,
              coordinates: {
                x: 0,
                y: 0,
              },
              readyAt: now,
            },
          ],
        },
      },
      action: { type: "cheers.claimed" },
      createdAt: now,
    });

    expect(game?.socialFarming.cheers.freeCheersClaimedAt).toBe(now);
    expect(game?.inventory.Cheer?.toNumber()).toBe(5);
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
