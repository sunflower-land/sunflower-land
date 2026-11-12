import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { getCraftingTimePreview } from "./craftingTimePreview";

const HOUR = 60 * 60 * 1000;
const START = 1_000_000_000;

/** A farm with a Time Warp Totem placed at `createdAt` (2x crafting speed). */
const withTotem = (createdAt: number): GameState =>
  ({
    ...INITIAL_FARM,
    collectibles: {
      ...INITIAL_FARM.collectibles,
      "Time Warp Totem": [
        { id: "1", coordinates: { x: 0, y: 0 }, createdAt, readyAt: createdAt },
      ],
    },
  }) as GameState;

describe("getCraftingTimePreview", () => {
  // An 8h recipe, the Lumber Doll's time.
  const timeMs = 8 * HOUR;

  it("leaves the duration unbaked and applies the totem as a window", () => {
    const { displaySeconds } = getCraftingTimePreview({
      state: withTotem(START),
      timeMs,
      at: START,
    });

    // Not baked, so the 2x window does all the work: 8h of work at 2x = 4h.
    expect(displaySeconds).toEqual((4 * HOUR) / 1000);
  });

  it("still names the totem once, from the windowed contributions", () => {
    const { boosts } = getCraftingTimePreview({
      state: withTotem(START),
      timeMs,
      at: START,
    });

    expect(boosts.filter((b) => b.name === "Time Warp Totem")).toHaveLength(1);
  });
});
