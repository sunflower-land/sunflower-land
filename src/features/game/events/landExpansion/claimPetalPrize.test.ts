import Decimal from "decimal.js-light";
import { claimPetalPrize } from "./claimPetalPrize";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("claimPetalPrize", () => {
  it("should claim the petal prize", () => {
    const now = Date.now();
    const state = claimPetalPrize({
      action: {
        type: "petalPuzzle.solved",
      },
      state: INITIAL_FARM,
      createdAt: now,
    });

    expect(state.floatingIsland.petalPuzzleSolvedAt).toBe(now);
    expect(state.inventory["Bronze Love Box"]).toEqual(new Decimal(1));
  });

  it("requires player has not claimed petal prize already", () => {
    const now = Date.now();
    const state = claimPetalPrize({
      action: {
        type: "petalPuzzle.solved",
      },
      state: INITIAL_FARM,
      createdAt: now,
    });

    expect(() =>
      claimPetalPrize({
        action: {
          type: "petalPuzzle.solved",
        },
        state,
        createdAt: now,
      }),
    ).toThrow("Petal Prize already claimed today");
  });
});
