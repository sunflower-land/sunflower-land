import { CROPS } from "../types/crops";
import {
  canUseTimeBoostAOE,
  canUseYieldBoostAOE,
  getCropCycleStartedAt,
  getRockCycleStartedAt,
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
  const now = Date.now();

  it("returns true for the Emerald Turtle if the boost has not been used", () => {
    expect(
      canUseYieldBoostAOE({}, "Emerald Turtle", { dx: 0, dy: 0 }, now),
    ).toBe(true);
  });

  it("returns false if the tile's last bonus came after the rock's cycle started", () => {
    const canUse = canUseYieldBoostAOE(
      { "Emerald Turtle": { "0": { "0": now } } },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      now - 1,
    );

    expect(canUse).toBe(false);
  });

  it("returns false even when a full recovery has passed since the tile's last bonus", () => {
    // The rock started its cycle before the tile paid out, so that cycle has
    // already been paid for, however long ago.
    const lastBonus = now - 10 * STONE_RECOVERY_TIME * 1000;

    const canUse = canUseYieldBoostAOE(
      { "Emerald Turtle": { "0": { "0": lastBonus } } },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      lastBonus - 1,
    );

    expect(canUse).toBe(false);
  });

  it("returns true when the rock's cycle started at the tile's last bonus", () => {
    // Mining stamps the tile's last bonus and the rock's new cycle start with
    // the same createdAt, so the next mine of that rock must still qualify.
    const canUse = canUseYieldBoostAOE(
      { "Emerald Turtle": { "0": { "0": now } } },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns true when the rock's cycle started after the tile's last bonus", () => {
    const canUse = canUseYieldBoostAOE(
      { "Emerald Turtle": { "0": { "0": now - 1 } } },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns true for the Emerald Turtle on a tile it has not paid out on", () => {
    const canUse = canUseYieldBoostAOE(
      { "Emerald Turtle": { "0": { "0": now } } },
      "Emerald Turtle",
      { dx: 0, dy: 1 },
      now - 1,
    );

    expect(canUse).toBe(true);
  });

  it("returns false for an iron rock moved onto a tile that paid out on stone after the iron rock was mined", () => {
    // The Emerald Turtle's tiles are shared by every rock family.
    const ironMinedAt = now - IRON_RECOVERY_TIME * 1000;

    const canUse = canUseYieldBoostAOE(
      { "Emerald Turtle": { "0": { "0": ironMinedAt + 1 } } },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      ironMinedAt,
    );

    expect(canUse).toBe(false);
  });
});

describe("getCropCycleStartedAt", () => {
  it("returns the recorded cycle start", () => {
    expect(
      getCropCycleStartedAt({
        name: "Sunflower",
        plantedAt: 5000,
        cycleStartedAt: 1000,
      }),
    ).toBe(1000);
  });

  it("falls back to plantedAt for a crop planted before the field existed", () => {
    expect(getCropCycleStartedAt({ name: "Sunflower", plantedAt: 5000 })).toBe(
      5000,
    );
  });
});

describe("getRockCycleStartedAt", () => {
  it("returns the recorded cycle start", () => {
    expect(
      getRockCycleStartedAt({
        createdAt: 100,
        stone: { minedAt: 5000, cycleStartedAt: 1000 },
      }),
    ).toBe(1000);
  });

  it("falls back to minedAt for a rock mined before the field existed", () => {
    expect(
      getRockCycleStartedAt({ createdAt: 100, stone: { minedAt: 5000 } }),
    ).toBe(5000);
  });

  it("falls back to the rock's createdAt for a rock that has never been mined", () => {
    expect(
      getRockCycleStartedAt({ createdAt: 100, stone: { minedAt: 0 } }),
    ).toBe(100);
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
