import Decimal from "decimal.js-light";
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

  it("uses the free retry when Anemone Flower is placed", () => {
    const state = retryFish({
      state: {
        ...BASE_STATE,
        coins: 0,
        inventory: {
          "Anemone Flower": new Decimal(1),
        },
        collectibles: {
          "Anemone Flower": [
            {
              id: "anemone",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
      },
      action: { type: "fish.retried" },
    });

    expect(state.coins).toEqual(0);
    expect(state.fishing.wharf.freePuzzleAttemptUsed).toEqual(true);
  });
});
