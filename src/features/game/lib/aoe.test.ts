import { CROPS } from "../types/crops";
import {
  canUseTimeBoostAOE,
  canUseYieldBoostAOE,
  refreshBasicScarecrowTimeAOE,
} from "./aoe";
import {
  IRON_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
  INITIAL_FARM,
} from "./constants";
import {
  computeReadyAt,
  getCropPlotBoostWindows,
  CROP_PLOT_BOOST_SPEED,
} from "./boostWindows";
import type { GameState } from "../types/game";

describe("canUseYieldAOE", () => {
  it("returns true for the Emerald Turtle if the boost has not been used", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {},
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns false for the Emerald Turtle if the emerald turtle boost has already been used", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": now,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(false);
  });

  it("returns true if the Emerald Turtle boost has been used on the first rock and is ready to be used again", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": now - STONE_RECOVERY_TIME,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns true for the Emerald Turtle if the emerald turtle boost has not been used on the second rock", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": now,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 1 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns false if the Emerald Turtle boost was used to mine stone, but now the player is trying to mine iron while still in the cooldown period", () => {
    const now = Date.now();
    const startTime = now - IRON_RECOVERY_TIME;

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": startTime + STONE_RECOVERY_TIME,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      IRON_RECOVERY_TIME,
      startTime + IRON_RECOVERY_TIME,
    );

    expect(canUse).toBe(false);
  });
});

describe("canUseTimeBoostAOE", () => {
  it("returns true if the time boost has not been used", () => {
    const now = Date.now();

    const canUse = canUseTimeBoostAOE(
      {},
      "Basic Scarecrow",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns false if the AOE is not ready yet", () => {
    const now = Date.now();

    const canUse = canUseTimeBoostAOE(
      {
        "Basic Scarecrow": {
          "0": {
            "0": now + CROPS["Sunflower"].harvestSeconds * 1000,
          },
        },
      },
      "Basic Scarecrow",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(false);
  });

  it("returns true if the AOE is ready", () => {
    const now = Date.now();

    const canUse = canUseTimeBoostAOE(
      {
        "Basic Scarecrow": {
          "0": {
            "0": now,
          },
        },
      },
      "Basic Scarecrow",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(true);
  });
});

describe("refreshBasicScarecrowTimeAOE", () => {
  const now = Date.now();
  const base = 120_000;

  const gameWith = (overrides: Partial<GameState>): GameState =>
    ({
      ...INITIAL_FARM,
      collectibles: {
        "Basic Scarecrow": [
          {
            id: "s",
            coordinates: { x: 0, y: 0 },
            createdAt: now,
            readyAt: now,
          },
        ],
      },
      crops: {},
      aoe: {},
      ...overrides,
    }) as GameState;

  it("re-syncs a windowed crop's cell to its boosted ready time", () => {
    const game = gameWith({
      collectibles: {
        "Basic Scarecrow": [
          {
            id: "s",
            coordinates: { x: 0, y: 0 },
            createdAt: now,
            readyAt: now,
          },
        ],
        "Sparrow Shrine": [
          {
            id: "sh",
            coordinates: { x: 5, y: 5 },
            createdAt: now,
            readyAt: now,
          },
        ],
      },
      crops: {
        "1": {
          createdAt: now,
          x: 1,
          y: 0,
          crop: { name: "Sunflower", plantedAt: now, baseDurationMs: base },
        },
      },
      // Frozen at the un-boosted ready time (stale).
      aoe: { "Basic Scarecrow": { 1: { 0: now + base } } },
    });

    refreshBasicScarecrowTimeAOE(game);

    // Recomputed from the live windows...
    const expected = computeReadyAt({
      startedAt: now,
      baseDurationMs: base,
      windows: getCropPlotBoostWindows(game),
    });
    expect(game.aoe["Basic Scarecrow"]![1]![0]).toBe(expected);
    // ...which, with the 1.35x Sparrow window covering the whole grow, is base/1.35.
    expect(game.aoe["Basic Scarecrow"]![1]![0]).toBeCloseTo(
      now + base / CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      0,
    );
  });

  it("leaves legacy crops (no baseDurationMs) untouched", () => {
    const stale = now + base;
    const game = gameWith({
      crops: {
        "1": {
          createdAt: now,
          x: 1,
          y: 0,
          crop: { name: "Sunflower", plantedAt: now },
        },
      },
      aoe: { "Basic Scarecrow": { 1: { 0: stale } } },
    });

    refreshBasicScarecrowTimeAOE(game);

    expect(game.aoe["Basic Scarecrow"]![1]![0]).toBe(stale);
  });

  it("does nothing when there is no Basic Scarecrow", () => {
    const stale = now + base;
    const game = gameWith({
      collectibles: {},
      crops: {
        "1": {
          createdAt: now,
          x: 1,
          y: 0,
          crop: { name: "Sunflower", plantedAt: now, baseDurationMs: base },
        },
      },
      aoe: { "Basic Scarecrow": { 1: { 0: stale } } },
    });

    refreshBasicScarecrowTimeAOE(game);

    expect(game.aoe["Basic Scarecrow"]![1]![0]).toBe(stale);
  });

  it("does not create an AOE entry for a cell that has none", () => {
    const game = gameWith({
      crops: {
        "1": {
          createdAt: now,
          x: 1,
          y: 0,
          crop: { name: "Sunflower", plantedAt: now, baseDurationMs: base },
        },
      },
      aoe: {},
    });

    refreshBasicScarecrowTimeAOE(game);

    expect(game.aoe["Basic Scarecrow"]?.[1]?.[0]).toBeUndefined();
  });
});
