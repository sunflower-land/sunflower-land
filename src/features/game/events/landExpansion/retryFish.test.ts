import { retryFish } from "./retryFish";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

describe("retryFish", () => {
  const now = Date.now();

  const BASE_STATE: GameState = {
    ...INITIAL_FARM,
    fishing: {
      ...INITIAL_FARM.fishing,
      wharf: {
        castedAt: now,
      },
    },
  };

  it("requires coins to retry", () => {
    expect(() =>
      retryFish({
        state: BASE_STATE,
        action: { type: "fish.retried" },
      }),
    ).toThrow("Insufficient coins");
  });

  it("tracks fish retried", () => {
    const state = retryFish({
      state: {
        ...BASE_STATE,
        coins: 1000,
      },
      action: { type: "fish.retried" },
    });
    expect(state.farmActivity["Fish Retried"]).toEqual(1);
    expect(state.coins).toEqual(0);
  });
});
