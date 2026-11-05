import { CONFIG } from "lib/config";
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

const setNetwork = (network: "mainnet" | "amoy") => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = network;
};

describe("getCraftingTimePreview", () => {
  const originalNetwork = CONFIG.NETWORK;
  afterEach(() => setNetwork(originalNetwork));

  // An 8h recipe, the Lumber Doll's time.
  const timeMs = 8 * HOUR;

  describe("SPEED_BOOSTS off", () => {
    // Nothing has STARTED here, so there is no `baseDurationMs` marker to read.
    // The legacy model bakes the totem into the duration and names it in
    // `boostsUsed`, so applying the windows on top would count it twice - the
    // hole `seedBoostWindows` closes for every other activity.
    beforeEach(() => setNetwork("mainnet"));

    it("bakes the totem in ONCE rather than also applying it as a window", () => {
      const { displaySeconds } = getCraftingTimePreview({
        state: withTotem(START),
        timeMs,
        at: START,
      });

      // 8h x0.5 baked = 4h. NOT 2h, which is the window applied a second time.
      expect(displaySeconds).toEqual((4 * HOUR) / 1000);
    });

    it("names the totem ONCE", () => {
      const { boosts } = getCraftingTimePreview({
        state: withTotem(START),
        timeMs,
        at: START,
      });

      expect(boosts.filter((b) => b.name === "Time Warp Totem")).toHaveLength(
        1,
      );
    });
  });

  describe("SPEED_BOOSTS on", () => {
    beforeEach(() => setNetwork("amoy"));

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

      expect(boosts.filter((b) => b.name === "Time Warp Totem")).toHaveLength(
        1,
      );
    });
  });
});
