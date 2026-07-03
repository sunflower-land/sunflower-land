import {
  computeReadyAt,
  getBoostWindows,
  getEffectiveSpeedAt,
  workAccruedAt,
  CROP_PLOT_BOOST_SPEED,
  TREE_BOOST_SPEED,
  MINE_BOOST_SPEED,
  FRUIT_BOOST_SPEED,
  FLOWER_BOOST_SPEED,
  GREENHOUSE_BOOST_SPEED,
  getTreeBoostWindows,
  getMineBoostWindows,
  getFruitBoostWindows,
  getTurbofruitMixWindows,
  getCropFertiliserWindows,
  getFlowerBoostWindows,
  getGreenhouseBoostWindows,
  getGreenhouseGlowWindows,
  getOilBoostWindows,
  OIL_BOOST_SPEED,
  appendBoostHistory,
  type BoostWindow,
} from "./boostWindows";
import { getExpiryCooldown } from "./collectibleBuilt";
import { TEST_FARM } from "./constants";
import type {
  CropFertiliser,
  GameState,
  GreenhouseFertiliser,
} from "../types/game";
import type { RockName } from "../types/resources";

const HOUR = 60 * 60 * 1000;

describe("computeReadyAt", () => {
  it("returns startedAt + baseDuration when there are no windows", () => {
    const startedAt = 1_000_000;
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows: [] }),
    ).toEqual(startedAt + 4 * HOUR);
  });

  it("runs at full speed while a window covers the whole task", () => {
    const startedAt = 0;
    const windows: BoostWindow[] = [{ from: 0, to: 10 * HOUR, speed: 2 }];
    // 4h of work at 2x finishes in 2h.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows }),
    ).toEqual(2 * HOUR);
  });

  it("only credits the overlap when the window is shorter than the task", () => {
    const startedAt = 0;
    // Window active for the first hour at 2x → 2h of work done in 1h.
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    // Remaining 2h of work at 1x → finishes at 1h + 2h = 3h.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows }),
    ).toEqual(3 * HOUR);
  });

  it("applies a window placed AFTER the task started (retroactive)", () => {
    const startedAt = 0;
    // No boost for the first 2h, then a 2x window opens.
    const windows: BoostWindow[] = [
      { from: 2 * HOUR, to: 10 * HOUR, speed: 2 },
    ];
    // 2h of work done in the first 2h, remaining 2h of work at 2x → +1h = 3h.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows }),
    ).toEqual(3 * HOUR);
  });

  it("reverts to 1x after a window expires mid-task", () => {
    const startedAt = 0;
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    // 6h of work: 2h done in the first hour, remaining 4h at 1x → 1h + 4h = 5h.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 6 * HOUR, windows }),
    ).toEqual(5 * HOUR);
  });

  it("multiplies speeds where two windows overlap", () => {
    const startedAt = 0;
    const windows: BoostWindow[] = [
      { from: 0, to: 10 * HOUR, speed: 2 },
      { from: 0, to: 1 * HOUR, speed: 2 },
    ];
    // First hour at 4× → 4h of work → finishes in 1h exactly.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows }),
    ).toEqual(1 * HOUR);
  });

  it("stacks two equal boosts multiplicatively (1.35× × 1.35× = 1.8225×)", () => {
    const startedAt = 0;
    const windows: BoostWindow[] = [
      { from: 0, to: 10 * HOUR, speed: 1.35 },
      { from: 0, to: 10 * HOUR, speed: 1.35 },
    ];
    // Both cover the whole task → 1.35 × 1.35 = 1.8225× → base / 1.8225.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows }),
    ).toBeCloseTo((4 * HOUR) / (1.35 * 1.35), 5);
  });

  it("ignores the portion of a window before the task started", () => {
    const startedAt = 5 * HOUR;
    const windows: BoostWindow[] = [{ from: 0, to: 6 * HOUR, speed: 2 }];
    // Only [5h, 6h] overlaps: 1h at 2x = 2h work, remaining 2h at 1x.
    // → 6h + 2h = 8h.
    expect(
      computeReadyAt({ startedAt, baseDurationMs: 4 * HOUR, windows }),
    ).toEqual(8 * HOUR);
  });
});

describe("workAccruedAt", () => {
  it("returns 0 before the task started", () => {
    expect(workAccruedAt({ startedAt: 100, at: 50, windows: [] })).toEqual(0);
  });

  it("is the dual of computeReadyAt", () => {
    const startedAt = 0;
    const baseDurationMs = 4 * HOUR;
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    const readyAt = computeReadyAt({ startedAt, baseDurationMs, windows });
    expect(workAccruedAt({ startedAt, at: readyAt, windows })).toBeCloseTo(
      baseDurationMs,
      5,
    );
  });

  it("accrues at the window speed while active", () => {
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    // Half an hour into a 2x window → 1h of work accrued.
    expect(workAccruedAt({ startedAt: 0, at: 0.5 * HOUR, windows })).toEqual(
      1 * HOUR,
    );
  });
});

describe("getEffectiveSpeedAt", () => {
  it("returns 1 when no window covers the instant", () => {
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    expect(getEffectiveSpeedAt({ at: 2 * HOUR, windows })).toEqual(1);
  });

  it("returns the window speed while it is active", () => {
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    expect(getEffectiveSpeedAt({ at: 0.5 * HOUR, windows })).toEqual(2);
  });

  it("treats the window as half-open [from, to)", () => {
    const windows: BoostWindow[] = [{ from: 0, to: 1 * HOUR, speed: 2 }];
    expect(getEffectiveSpeedAt({ at: 0, windows })).toEqual(2);
    expect(getEffectiveSpeedAt({ at: 1 * HOUR, windows })).toEqual(1);
  });

  it("multiplies overlapping window speeds", () => {
    const windows: BoostWindow[] = [
      { from: 0, to: 2 * HOUR, speed: 2 },
      { from: 1 * HOUR, to: 3 * HOUR, speed: 1.5 },
    ];
    expect(getEffectiveSpeedAt({ at: 1.5 * HOUR, windows })).toEqual(3);
  });
});

describe("getBoostWindows", () => {
  it("builds a window from createdAt + cooldown for an active Sparrow Shrine", () => {
    const createdAt = 1_000_000;
    const windows = getBoostWindows({
      game: {
        ...TEST_FARM,
        collectibles: {
          ...TEST_FARM.collectibles,
          "Sparrow Shrine": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
          ],
        },
      },
      name: "Sparrow Shrine",
      speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    });

    expect(windows).toEqual([
      {
        from: createdAt,
        to: createdAt + getExpiryCooldown("Sparrow Shrine", TEST_FARM),
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      },
    ]);
  });

  it("anchors the window on createdAt even when readyAt is later", () => {
    // Matches isTemporaryCollectibleActive, which keys off createdAt + cooldown;
    // temporary collectibles are placed active (no build delay), so readyAt does
    // not gate the boost window.
    const createdAt = 1_000_000;
    const windows = getBoostWindows({
      game: {
        ...TEST_FARM,
        collectibles: {
          ...TEST_FARM.collectibles,
          "Sparrow Shrine": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt,
              readyAt: createdAt + 60 * 60 * 1000,
            },
          ],
        },
      },
      name: "Sparrow Shrine",
      speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    });

    expect(windows).toEqual([
      {
        from: createdAt,
        to: createdAt + getExpiryCooldown("Sparrow Shrine", TEST_FARM),
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      },
    ]);
  });

  it("truncates the window at removedAt when the shrine was picked up", () => {
    const createdAt = 1_000_000;
    const removedAt = createdAt + 2 * HOUR;
    const windows = getBoostWindows({
      game: {
        ...TEST_FARM,
        collectibles: {
          ...TEST_FARM.collectibles,
          "Sparrow Shrine": [{ id: "1", createdAt, removedAt }],
        },
      },
      name: "Sparrow Shrine",
      speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    });

    expect(windows).toEqual([
      {
        from: createdAt,
        to: removedAt,
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      },
    ]);
  });

  it("returns no windows when none are placed", () => {
    expect(
      getBoostWindows({
        game: TEST_FARM,
        name: "Sparrow Shrine",
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      }),
    ).toEqual([]);
  });

  it("merges overlapping placements into one window (no double-multiply)", () => {
    const createdAt = 1_000_000;
    const cooldown = getExpiryCooldown("Sparrow Shrine", TEST_FARM);
    // Second shrine placed 1h later — its window overlaps the first's.
    const secondCreatedAt = createdAt + 60 * 60 * 1000;
    const windows = getBoostWindows({
      game: {
        ...TEST_FARM,
        collectibles: {
          ...TEST_FARM.collectibles,
          "Sparrow Shrine": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
            {
              id: "2",
              coordinates: { x: 1, y: 1 },
              createdAt: secondCreatedAt,
            },
          ],
        },
      },
      name: "Sparrow Shrine",
      speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    });

    // Coalesced into a single window at the single speed (not stacked/4x).
    expect(windows).toEqual([
      {
        from: createdAt,
        to: secondCreatedAt + cooldown,
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      },
    ]);
  });

  it("includes finalized intervals from boostHistory (even with no live placement)", () => {
    // The shrine is gone (burned), but its window survives in boostHistory.
    const windows = getBoostWindows({
      game: {
        ...TEST_FARM,
        collectibles: {},
        boostHistory: { "Sparrow Shrine": [{ from: 1000, to: 5000 }] },
      },
      name: "Sparrow Shrine",
      speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    });

    expect(windows).toEqual([
      { from: 1000, to: 5000, speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"] },
    ]);
  });

  it("unions a live placement with a disjoint history interval", () => {
    const cooldown = getExpiryCooldown("Sparrow Shrine", TEST_FARM);
    const liveCreatedAt = 1_000_000;
    const windows = getBoostWindows({
      game: {
        ...TEST_FARM,
        collectibles: {
          ...TEST_FARM.collectibles,
          "Sparrow Shrine": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: liveCreatedAt },
          ],
        },
        boostHistory: { "Sparrow Shrine": [{ from: 0, to: 5000 }] },
      },
      name: "Sparrow Shrine",
      speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    });

    expect(windows).toEqual([
      { from: 0, to: 5000, speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"] },
      {
        from: liveCreatedAt,
        to: liveCreatedAt + cooldown,
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      },
    ]);
  });
});

describe("appendBoostHistory", () => {
  const DAY = 24 * HOUR;

  it("records a finalized window for a windowed boost collectible", () => {
    const game = { ...TEST_FARM, boostHistory: {} } as GameState;
    appendBoostHistory(game, "Sparrow Shrine", { from: 1000, to: 2000 }, 2000);
    expect(game.boostHistory?.["Sparrow Shrine"]).toEqual([
      { from: 1000, to: 2000 },
    ]);
  });

  it("appends to existing history for the same boost", () => {
    const game = {
      ...TEST_FARM,
      boostHistory: { "Harvest Hourglass": [{ from: 1000, to: 2000 }] },
    } as GameState;
    appendBoostHistory(
      game,
      "Harvest Hourglass",
      { from: 3000, to: 4000 },
      4000,
    );
    expect(game.boostHistory?.["Harvest Hourglass"]).toEqual([
      { from: 1000, to: 2000 },
      { from: 3000, to: 4000 },
    ]);
  });

  it("prunes intervals that ended long before now", () => {
    const now = 100 * DAY;
    const game = {
      ...TEST_FARM,
      boostHistory: { "Sparrow Shrine": [{ from: 0, to: 1000 }] }, // ancient
    } as GameState;
    appendBoostHistory(
      game,
      "Sparrow Shrine",
      { from: now - 500, to: now },
      now,
    );
    expect(game.boostHistory?.["Sparrow Shrine"]).toEqual([
      { from: now - 500, to: now },
    ]);
  });

  it("records for any temporary collectible (future-proof, even if not windowed yet)", () => {
    const game = { ...TEST_FARM, boostHistory: {} } as GameState;
    appendBoostHistory(game, "Ore Hourglass", { from: 1000, to: 2000 }, 2000);
    expect(game.boostHistory?.["Ore Hourglass"]).toEqual([
      { from: 1000, to: 2000 },
    ]);
  });

  it("ignores empty/zero-length windows", () => {
    const game = { ...TEST_FARM, boostHistory: {} } as GameState;
    appendBoostHistory(game, "Sparrow Shrine", { from: 2000, to: 2000 }, 2000);
    expect(game.boostHistory?.["Sparrow Shrine"]).toBeUndefined();
  });
});

describe("getTreeBoostWindows", () => {
  const createdAt = 1_000_000;

  it("builds a window for an active Timber Hourglass at the tree speed", () => {
    const windows = getTreeBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Timber Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Timber Hourglass", TEST_FARM),
      speed: TREE_BOOST_SPEED["Timber Hourglass"],
    });
  });

  it("includes the Badger Shrine at the tree speed", () => {
    const windows = getTreeBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Badger Shrine": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Badger Shrine", TEST_FARM),
      speed: TREE_BOOST_SPEED["Badger Shrine"],
    });
  });

  it("merges Super Totem & Time Warp Totem into one 2× window (no stacking)", () => {
    const windows = getTreeBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
        "Time Warp Totem": [
          { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
        ],
      },
    });

    // Both totems share 2× and merge into a single window, not two stacked.
    const totemWindows = windows.filter(
      (w) => w.speed === TREE_BOOST_SPEED["Super Totem"],
    );
    expect(totemWindows).toEqual([
      {
        from: createdAt,
        to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
        speed: TREE_BOOST_SPEED["Super Totem"],
      },
    ]);
  });

  it("includes a removed/burned Timber Hourglass via boostHistory", () => {
    // The booster is gone from collectibles, but its finalised window survives
    // in boostHistory so an in-progress tree still gets the recovered credit.
    const from = 1_000_000;
    const to = from + getExpiryCooldown("Timber Hourglass", TEST_FARM);
    const windows = getTreeBoostWindows({
      ...TEST_FARM,
      collectibles: {},
      boostHistory: { "Timber Hourglass": [{ from, to }] },
    });

    expect(windows).toContainEqual({
      from,
      to,
      speed: TREE_BOOST_SPEED["Timber Hourglass"],
    });
  });

  it("returns no windows when none are placed", () => {
    expect(getTreeBoostWindows(TEST_FARM)).toEqual([]);
  });
});

describe("FRUIT_BOOST_SPEED", () => {
  it("has the exact tuned multipliers", () => {
    expect(FRUIT_BOOST_SPEED).toEqual({
      "Super Totem": 2,
      "Time Warp Totem": 2,
      "Orchard Hourglass": 1.35,
      "Toucan Shrine": 1.35,
      "Turbofruit Mix": 1.25,
    });
  });
});

describe("getFruitBoostWindows", () => {
  const createdAt = 1_000_000;

  it("builds a window for an active Orchard Hourglass at the fruit speed", () => {
    const windows = getFruitBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Orchard Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Orchard Hourglass", TEST_FARM),
      speed: FRUIT_BOOST_SPEED["Orchard Hourglass"],
    });
  });

  it("includes the Toucan Shrine at the fruit speed", () => {
    const windows = getFruitBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Toucan Shrine": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Toucan Shrine", TEST_FARM),
      speed: FRUIT_BOOST_SPEED["Toucan Shrine"],
    });
  });

  it("merges Super Totem & Time Warp Totem into one 2× window (no stacking)", () => {
    const windows = getFruitBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
        "Time Warp Totem": [
          { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
        ],
      },
    });

    const totemWindows = windows.filter(
      (w) => w.speed === FRUIT_BOOST_SPEED["Super Totem"],
    );
    expect(totemWindows).toEqual([
      {
        from: createdAt,
        to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
        speed: FRUIT_BOOST_SPEED["Super Totem"],
      },
    ]);
  });

  it("Orchard Hourglass and Toucan Shrine stack MULTIPLICATIVELY over an overlap", () => {
    const windows = getFruitBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Orchard Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
        "Toucan Shrine": [{ id: "2", coordinates: { x: 1, y: 1 }, createdAt }],
      },
    });

    // Effective speed during the overlap = 1.35 × 1.35 = 1.8225.
    const speed = getEffectiveSpeedAt({ at: createdAt + 1000, windows });
    expect(speed).toBeCloseTo(
      FRUIT_BOOST_SPEED["Orchard Hourglass"] *
        FRUIT_BOOST_SPEED["Toucan Shrine"],
      10,
    );
  });

  it("includes a removed/burned Orchard Hourglass via boostHistory", () => {
    const from = 1_000_000;
    const to = from + getExpiryCooldown("Orchard Hourglass", TEST_FARM);
    const windows = getFruitBoostWindows({
      ...TEST_FARM,
      collectibles: {},
      boostHistory: { "Orchard Hourglass": [{ from, to }] },
    });

    expect(windows).toContainEqual({
      from,
      to,
      speed: FRUIT_BOOST_SPEED["Orchard Hourglass"],
    });
  });

  it("returns no windows when none are placed", () => {
    expect(getFruitBoostWindows(TEST_FARM)).toEqual([]);
  });
});

describe("FLOWER_BOOST_SPEED", () => {
  it("has the exact tuned multipliers", () => {
    expect(FLOWER_BOOST_SPEED).toEqual({
      "Blossom Hourglass": 1.35,
      "Moth Shrine": 1.35,
    });
  });
});

describe("getFlowerBoostWindows", () => {
  const createdAt = 1_000_000;

  it("builds a window for an active Blossom Hourglass at the flower speed", () => {
    const windows = getFlowerBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Blossom Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Blossom Hourglass", TEST_FARM),
      speed: FLOWER_BOOST_SPEED["Blossom Hourglass"],
    });
  });

  it("includes the Moth Shrine time boost at the flower speed", () => {
    const windows = getFlowerBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Moth Shrine": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Moth Shrine", TEST_FARM),
      speed: FLOWER_BOOST_SPEED["Moth Shrine"],
    });
  });

  it("does NOT include totems (flowers get no totem boost)", () => {
    const windows = getFlowerBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
        "Time Warp Totem": [
          { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
        ],
      },
    });

    expect(windows).toEqual([]);
  });

  it("Blossom Hourglass and Moth Shrine stack MULTIPLICATIVELY over an overlap", () => {
    const windows = getFlowerBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Blossom Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
        "Moth Shrine": [{ id: "2", coordinates: { x: 1, y: 1 }, createdAt }],
      },
    });

    // Effective speed during the overlap = 1.35 × 1.35 = 1.8225.
    const speed = getEffectiveSpeedAt({ at: createdAt + 1000, windows });
    expect(speed).toBeCloseTo(
      FLOWER_BOOST_SPEED["Blossom Hourglass"] *
        FLOWER_BOOST_SPEED["Moth Shrine"],
      10,
    );
  });

  it("includes a removed/burned Blossom Hourglass via boostHistory", () => {
    const from = 1_000_000;
    const to = from + getExpiryCooldown("Blossom Hourglass", TEST_FARM);
    const windows = getFlowerBoostWindows({
      ...TEST_FARM,
      collectibles: {},
      boostHistory: { "Blossom Hourglass": [{ from, to }] },
    });

    expect(windows).toContainEqual({
      from,
      to,
      speed: FLOWER_BOOST_SPEED["Blossom Hourglass"],
    });
  });

  it("returns no windows when none are placed", () => {
    expect(getFlowerBoostWindows(TEST_FARM)).toEqual([]);
  });
});

describe("getOilBoostWindows", () => {
  const createdAt = 1_000_000;

  it("builds a window for an active Stag Shrine at the oil speed", () => {
    const windows = getOilBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Stag Shrine": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    expect(windows).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Stag Shrine", TEST_FARM),
      speed: OIL_BOOST_SPEED["Stag Shrine"],
    });
  });

  it("does NOT include totems (oil gets no totem boost)", () => {
    const windows = getOilBoostWindows({
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
        "Time Warp Totem": [
          { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
        ],
      },
    });

    expect(windows).toEqual([]);
  });

  it("includes a removed/burned Stag Shrine via boostHistory", () => {
    const from = 1_000_000;
    const to = from + getExpiryCooldown("Stag Shrine", TEST_FARM);
    const windows = getOilBoostWindows({
      ...TEST_FARM,
      collectibles: {},
      boostHistory: { "Stag Shrine": [{ from, to }] },
    });

    expect(windows).toContainEqual({
      from,
      to,
      speed: OIL_BOOST_SPEED["Stag Shrine"],
    });
  });

  it("returns no windows when none are placed", () => {
    expect(getOilBoostWindows(TEST_FARM)).toEqual([]);
  });
});

describe("getTurbofruitMixWindows", () => {
  const fertilisedAt = 1_000_000;

  it("returns no window when the patch has no fertiliser", () => {
    expect(getTurbofruitMixWindows(undefined)).toEqual([]);
  });

  it("returns no window for a non-Turbofruit fertiliser", () => {
    expect(
      getTurbofruitMixWindows({ name: "Fruitful Blend", fertilisedAt }),
    ).toEqual([]);
  });

  it("builds an open-ended 1.25× window from fertilisedAt for Turbofruit Mix", () => {
    expect(
      getTurbofruitMixWindows({ name: "Turbofruit Mix", fertilisedAt }),
    ).toEqual([
      {
        from: fertilisedAt,
        to: Number.MAX_SAFE_INTEGER,
        speed: FRUIT_BOOST_SPEED["Turbofruit Mix"],
      },
    ]);
  });

  it("keeps the segment maths finite over the far-future bound", () => {
    // Edge case for the MAX_SAFE_INTEGER bound: a fruit under a Turbofruit window
    // is ready long before the bound and computeReadyAt stays finite.
    const startedAt = fertilisedAt;
    const baseDurationMs = 10 * HOUR;
    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: getTurbofruitMixWindows({
        name: "Turbofruit Mix",
        fertilisedAt,
      }),
    });

    // Whole grow is at 1.25× → wall-clock = base / 1.25.
    expect(readyAt).toBe(
      startedAt + baseDurationMs / FRUIT_BOOST_SPEED["Turbofruit Mix"],
    );
    expect(Number.isFinite(readyAt)).toBe(true);
  });

  it("only speeds work accrued AFTER it was applied mid-grow", () => {
    const startedAt = 0;
    const baseDurationMs = 10 * HOUR;
    const midFertilisedAt = 2 * HOUR;
    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: getTurbofruitMixWindows({
        name: "Turbofruit Mix",
        fertilisedAt: midFertilisedAt,
      }),
    });

    // First 2h at 1× (2h work), remaining 8h work at 1.25× → 8h / 1.25 = 6.4h.
    expect(readyAt).toBe(
      midFertilisedAt +
        (baseDurationMs - 2 * HOUR) / FRUIT_BOOST_SPEED["Turbofruit Mix"],
    );
  });

  it("stacks MULTIPLICATIVELY with the collectible fruit windows", () => {
    const startedAt = 0;
    const baseDurationMs = 10 * HOUR;
    const orchard: BoostWindow[] = [
      {
        from: 0,
        to: Number.MAX_SAFE_INTEGER,
        speed: FRUIT_BOOST_SPEED["Orchard Hourglass"],
      },
    ];
    const turbo = getTurbofruitMixWindows({
      name: "Turbofruit Mix",
      fertilisedAt: 0,
    });

    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: [...orchard, ...turbo],
    });

    // Both cover the whole grow → 1.35 × 1.25 effective speed.
    expect(readyAt).toBe(
      startedAt +
        baseDurationMs /
          (FRUIT_BOOST_SPEED["Orchard Hourglass"] *
            FRUIT_BOOST_SPEED["Turbofruit Mix"]),
    );
  });
});

describe("getCropFertiliserWindows", () => {
  const fertilisedAt = 1_000_000;

  it("returns no window when the plot has no fertiliser", () => {
    expect(getCropFertiliserWindows(undefined)).toEqual([]);
  });

  it("returns no window for a non-speed fertiliser (Sprout Mix)", () => {
    expect(
      getCropFertiliserWindows({ name: "Sprout Mix", fertilisedAt }),
    ).toEqual([]);
  });

  it("returns no window when the name is valid but fertilisedAt is missing (malformed state)", () => {
    expect(
      getCropFertiliserWindows({ name: "Rapid Root" } as CropFertiliser),
    ).toEqual([]);
  });

  it("builds an open-ended 2× window from fertilisedAt for Rapid Root", () => {
    expect(
      getCropFertiliserWindows({ name: "Rapid Root", fertilisedAt }),
    ).toEqual([
      {
        from: fertilisedAt,
        to: Number.MAX_SAFE_INTEGER,
        speed: CROP_PLOT_BOOST_SPEED["Rapid Root"],
      },
    ]);
  });

  it("builds an open-ended 2× window from fertilisedAt for Sproutroot Surprise", () => {
    expect(
      getCropFertiliserWindows({ name: "Sproutroot Surprise", fertilisedAt }),
    ).toEqual([
      {
        from: fertilisedAt,
        to: Number.MAX_SAFE_INTEGER,
        speed: CROP_PLOT_BOOST_SPEED["Sproutroot Surprise"],
      },
    ]);
  });

  it("keeps the segment maths finite over the far-future bound", () => {
    // Edge case for the MAX_SAFE_INTEGER bound: a crop under a fertiliser window
    // is ready long before the bound and computeReadyAt stays finite.
    const startedAt = fertilisedAt;
    const baseDurationMs = 10 * HOUR;
    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: getCropFertiliserWindows({ name: "Rapid Root", fertilisedAt }),
    });

    // Whole grow is at 2× → wall-clock = base / 2.
    expect(readyAt).toBe(
      startedAt + baseDurationMs / CROP_PLOT_BOOST_SPEED["Rapid Root"],
    );
    expect(Number.isFinite(readyAt)).toBe(true);
  });

  it("only speeds work accrued AFTER it was applied mid-grow", () => {
    const startedAt = 0;
    const baseDurationMs = 10 * HOUR;
    const midFertilisedAt = 2 * HOUR;
    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: getCropFertiliserWindows({
        name: "Rapid Root",
        fertilisedAt: midFertilisedAt,
      }),
    });

    // First 2h at 1× (2h work), remaining 8h work at 2× → 8h / 2 = 4h.
    expect(readyAt).toBe(
      midFertilisedAt +
        (baseDurationMs - 2 * HOUR) / CROP_PLOT_BOOST_SPEED["Rapid Root"],
    );
  });

  it("stacks MULTIPLICATIVELY with the collectible crop windows", () => {
    const startedAt = 0;
    const baseDurationMs = 10 * HOUR;
    const sparrow: BoostWindow[] = [
      {
        from: 0,
        to: Number.MAX_SAFE_INTEGER,
        speed: CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
      },
    ];
    const rapidRoot = getCropFertiliserWindows({
      name: "Rapid Root",
      fertilisedAt: 0,
    });

    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: [...sparrow, ...rapidRoot],
    });

    // Both cover the whole grow → 1.35 × 2 effective speed.
    expect(readyAt).toBe(
      startedAt +
        baseDurationMs /
          (CROP_PLOT_BOOST_SPEED["Sparrow Shrine"] *
            CROP_PLOT_BOOST_SPEED["Rapid Root"]),
    );
  });
});

describe("MINE_BOOST_SPEED", () => {
  it("has the exact tuned multipliers", () => {
    expect(MINE_BOOST_SPEED).toEqual({
      "Super Totem": 2,
      "Time Warp Totem": 2,
      "Ore Hourglass": 2,
      "Badger Shrine": 1.35,
      "Mole Shrine": 1.35,
    });
  });
});

describe("getMineBoostWindows", () => {
  const createdAt = 1_000_000;

  const withCollectibles = (
    collectibles: GameState["collectibles"],
  ): GameState => ({
    ...TEST_FARM,
    collectibles: { ...TEST_FARM.collectibles, ...collectibles },
  });

  const placed = (id: string) => [
    { id, coordinates: { x: 0, y: 0 }, createdAt },
  ];

  describe("Stone Rock", () => {
    it("includes the Super Totem at speed 2", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Super Totem": placed("1") }),
        "Stone Rock",
      );

      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
        speed: MINE_BOOST_SPEED["Super Totem"],
      });
    });

    it("includes the Badger Shrine at speed 1.35", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Badger Shrine": placed("1") }),
        "Stone Rock",
      );

      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Badger Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Badger Shrine"],
      });
    });

    it("includes the Ore Hourglass at speed 2", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Ore Hourglass": placed("1") }),
        "Stone Rock",
      );

      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Ore Hourglass", TEST_FARM),
        speed: MINE_BOOST_SPEED["Ore Hourglass"],
      });
    });

    it("merges both totems into a single 2× window (no stacking)", () => {
      const windows = getMineBoostWindows(
        withCollectibles({
          "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
          "Time Warp Totem": [
            { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
          ],
        }),
        "Stone Rock",
      );

      const totemWindows = windows.filter(
        (w) => w.speed === MINE_BOOST_SPEED["Super Totem"],
      );
      expect(totemWindows).toEqual([
        {
          from: createdAt,
          to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
          speed: MINE_BOOST_SPEED["Super Totem"],
        },
      ]);
    });

    it("keeps a Totem, Ore Hourglass and Badger Shrine as SEPARATE windows that stack multiplicatively", () => {
      const windows = getMineBoostWindows(
        withCollectibles({
          "Super Totem": placed("1"),
          "Ore Hourglass": placed("2"),
          "Badger Shrine": placed("3"),
        }),
        "Stone Rock",
      );

      // Independent categories do NOT merge — only the two totems merge with each
      // other — so this is three distinct windows even though the Totem and Ore
      // Hourglass both run at 2×.
      expect(windows).toHaveLength(3);
      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
        speed: MINE_BOOST_SPEED["Super Totem"],
      });
      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Ore Hourglass", TEST_FARM),
        speed: MINE_BOOST_SPEED["Ore Hourglass"],
      });
      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Badger Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Badger Shrine"],
      });

      // During the overlap the effective speed is the PRODUCT (2 × 2 × 1.35 = 5.4×):
      // categories stack multiplicatively, NOT "highest speed wins".
      expect(getEffectiveSpeedAt({ at: createdAt + 1, windows })).toEqual(
        MINE_BOOST_SPEED["Super Totem"] *
          MINE_BOOST_SPEED["Ore Hourglass"] *
          MINE_BOOST_SPEED["Badger Shrine"],
      );
    });

    it("does NOT include the Mole Shrine (stone uses Badger, not Mole)", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Mole Shrine": placed("1") }),
        "Stone Rock",
      );

      expect(windows).toEqual([]);
    });

    it("returns no windows when nothing is placed", () => {
      expect(getMineBoostWindows(TEST_FARM, "Stone Rock")).toEqual([]);
    });
  });

  describe.each<RockName>(["Iron Rock", "Gold Rock"])("%s", (rockName) => {
    it("includes the Mole Shrine at speed 1.35", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Mole Shrine": placed("1") }),
        rockName,
      );

      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Mole Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Mole Shrine"],
      });
    });

    it("includes the Ore Hourglass at speed 2", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Ore Hourglass": placed("1") }),
        rockName,
      );

      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Ore Hourglass", TEST_FARM),
        speed: MINE_BOOST_SPEED["Ore Hourglass"],
      });
    });

    it("merges both totems into a single 2× window (no stacking)", () => {
      const windows = getMineBoostWindows(
        withCollectibles({
          "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
          "Time Warp Totem": [
            { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
          ],
        }),
        rockName,
      );

      const totemWindows = windows.filter(
        (w) => w.speed === MINE_BOOST_SPEED["Super Totem"],
      );
      expect(totemWindows).toEqual([
        {
          from: createdAt,
          to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
          speed: MINE_BOOST_SPEED["Super Totem"],
        },
      ]);
    });

    it("keeps a Totem, Ore Hourglass and Mole Shrine as SEPARATE windows that stack multiplicatively", () => {
      const windows = getMineBoostWindows(
        withCollectibles({
          "Super Totem": placed("1"),
          "Ore Hourglass": placed("2"),
          "Mole Shrine": placed("3"),
        }),
        rockName,
      );

      // Independent categories do NOT merge — three distinct windows.
      expect(windows).toHaveLength(3);
      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
        speed: MINE_BOOST_SPEED["Super Totem"],
      });
      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Ore Hourglass", TEST_FARM),
        speed: MINE_BOOST_SPEED["Ore Hourglass"],
      });
      expect(windows).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Mole Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Mole Shrine"],
      });

      // Effective speed during the overlap is the PRODUCT (2 × 2 × 1.35 = 5.4×).
      expect(getEffectiveSpeedAt({ at: createdAt + 1, windows })).toEqual(
        MINE_BOOST_SPEED["Super Totem"] *
          MINE_BOOST_SPEED["Ore Hourglass"] *
          MINE_BOOST_SPEED["Mole Shrine"],
      );
    });

    it("does NOT include the Badger Shrine (iron/gold use Mole, not Badger)", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Badger Shrine": placed("1") }),
        rockName,
      );

      expect(windows).toEqual([]);
    });
  });

  describe("Crimstone Rock", () => {
    it("includes the Mole Shrine at speed 1.35", () => {
      const windows = getMineBoostWindows(
        withCollectibles({ "Mole Shrine": placed("1") }),
        "Crimstone Rock",
      );

      expect(windows).toEqual([
        {
          from: createdAt,
          to: createdAt + getExpiryCooldown("Mole Shrine", TEST_FARM),
          speed: MINE_BOOST_SPEED["Mole Shrine"],
        },
      ]);
    });

    it("does NOT include totems, Ore Hourglass or Badger Shrine", () => {
      const windows = getMineBoostWindows(
        withCollectibles({
          "Super Totem": placed("1"),
          "Time Warp Totem": [
            { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
          ],
          "Ore Hourglass": [
            { id: "3", coordinates: { x: 2, y: 2 }, createdAt },
          ],
          "Badger Shrine": [
            { id: "4", coordinates: { x: 3, y: 3 }, createdAt },
          ],
        }),
        "Crimstone Rock",
      );

      expect(windows).toEqual([]);
    });
  });

  describe("Sunstone Rock", () => {
    it("always returns [] regardless of placed collectibles", () => {
      const windows = getMineBoostWindows(
        withCollectibles({
          "Super Totem": placed("1"),
          "Time Warp Totem": [
            { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
          ],
          "Ore Hourglass": [
            { id: "3", coordinates: { x: 2, y: 2 }, createdAt },
          ],
          "Badger Shrine": [
            { id: "4", coordinates: { x: 3, y: 3 }, createdAt },
          ],
          "Mole Shrine": [{ id: "5", coordinates: { x: 4, y: 4 }, createdAt }],
        }),
        "Sunstone Rock",
      );

      expect(windows).toEqual([]);
    });
  });

  describe("tier-2/3 names map to the base family", () => {
    it("Fused Stone Rock behaves like Stone Rock (gets Badger, not Mole)", () => {
      const game = withCollectibles({
        "Badger Shrine": placed("1"),
        "Mole Shrine": [{ id: "2", coordinates: { x: 1, y: 1 }, createdAt }],
      });

      expect(getMineBoostWindows(game, "Fused Stone Rock")).toEqual(
        getMineBoostWindows(game, "Stone Rock"),
      );
      // Stone family → Badger present, Mole absent.
      expect(getMineBoostWindows(game, "Fused Stone Rock")).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Badger Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Badger Shrine"],
      });
    });

    it("Prime Gold Rock behaves like Gold Rock (gets Mole, not Badger)", () => {
      const game = withCollectibles({
        "Mole Shrine": placed("1"),
        "Badger Shrine": [{ id: "2", coordinates: { x: 1, y: 1 }, createdAt }],
      });

      expect(getMineBoostWindows(game, "Prime Gold Rock")).toEqual(
        getMineBoostWindows(game, "Gold Rock"),
      );
      expect(getMineBoostWindows(game, "Prime Gold Rock")).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Mole Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Mole Shrine"],
      });
    });

    it("Refined Iron Rock behaves like Iron Rock (gets Mole, not Badger)", () => {
      const game = withCollectibles({
        "Mole Shrine": placed("1"),
        "Badger Shrine": [{ id: "2", coordinates: { x: 1, y: 1 }, createdAt }],
      });

      expect(getMineBoostWindows(game, "Refined Iron Rock")).toEqual(
        getMineBoostWindows(game, "Iron Rock"),
      );
      expect(getMineBoostWindows(game, "Refined Iron Rock")).toContainEqual({
        from: createdAt,
        to: createdAt + getExpiryCooldown("Mole Shrine", TEST_FARM),
        speed: MINE_BOOST_SPEED["Mole Shrine"],
      });
    });
  });
});

describe("GREENHOUSE_BOOST_SPEED", () => {
  it("pins the greenhouse speeds", () => {
    expect(GREENHOUSE_BOOST_SPEED).toEqual({
      "Super Totem": 2,
      "Time Warp Totem": 2,
      "Harvest Hourglass": 1.35,
      "Orchard Hourglass": 1.35,
      "Tortoise Shrine": 1.5,
      "Greenhouse Glow": 1.25,
    });
  });
});

describe("getGreenhouseBoostWindows", () => {
  const createdAt = 1_000_000;

  it("includes the Tortoise Shrine window for every plant", () => {
    const game: GameState = {
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Tortoise Shrine": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    };
    const expected = {
      from: createdAt,
      to: createdAt + getExpiryCooldown("Tortoise Shrine", TEST_FARM),
      speed: GREENHOUSE_BOOST_SPEED["Tortoise Shrine"],
    };

    expect(getGreenhouseBoostWindows(game, "Rice")).toContainEqual(expected);
    expect(getGreenhouseBoostWindows(game, "Olive")).toContainEqual(expected);
    expect(getGreenhouseBoostWindows(game, "Grape")).toContainEqual(expected);
  });

  it("includes Harvest Hourglass for the greenhouse CROPS only", () => {
    const game: GameState = {
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Harvest Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    };
    const expected = {
      from: createdAt,
      to: createdAt + getExpiryCooldown("Harvest Hourglass", TEST_FARM),
      speed: GREENHOUSE_BOOST_SPEED["Harvest Hourglass"],
    };

    expect(getGreenhouseBoostWindows(game, "Rice")).toContainEqual(expected);
    expect(getGreenhouseBoostWindows(game, "Olive")).toContainEqual(expected);
    // Grape is a fruit — Harvest Hourglass never covered it.
    expect(getGreenhouseBoostWindows(game, "Grape")).toEqual([]);
  });

  it("includes Orchard Hourglass for Grape only (windowed-model addition)", () => {
    const game: GameState = {
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Orchard Hourglass": [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    };

    expect(getGreenhouseBoostWindows(game, "Grape")).toContainEqual({
      from: createdAt,
      to: createdAt + getExpiryCooldown("Orchard Hourglass", TEST_FARM),
      speed: GREENHOUSE_BOOST_SPEED["Orchard Hourglass"],
    });
    expect(getGreenhouseBoostWindows(game, "Rice")).toEqual([]);
    expect(getGreenhouseBoostWindows(game, "Olive")).toEqual([]);
  });

  it("merges Super Totem & Time Warp Totem into one 2× window (no stacking)", () => {
    const windows = getGreenhouseBoostWindows(
      {
        ...TEST_FARM,
        collectibles: {
          ...TEST_FARM.collectibles,
          "Super Totem": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
          "Time Warp Totem": [
            { id: "2", coordinates: { x: 1, y: 1 }, createdAt },
          ],
        },
      },
      "Rice",
    );

    // Both totems share 2× and merge into a single window, not two stacked.
    const totemWindows = windows.filter(
      (w) => w.speed === GREENHOUSE_BOOST_SPEED["Super Totem"],
    );
    expect(totemWindows).toEqual([
      {
        from: createdAt,
        to: createdAt + getExpiryCooldown("Super Totem", TEST_FARM),
        speed: GREENHOUSE_BOOST_SPEED["Super Totem"],
      },
    ]);
  });

  it("includes a burned Tortoise Shrine via boostHistory", () => {
    // The shrine is gone from collectibles, but its finalised window survives
    // in boostHistory so an in-progress plant keeps the earned credit.
    const from = 1_000_000;
    const to = from + getExpiryCooldown("Tortoise Shrine", TEST_FARM);
    const windows = getGreenhouseBoostWindows(
      {
        ...TEST_FARM,
        collectibles: {},
        boostHistory: { "Tortoise Shrine": [{ from, to }] },
      },
      "Rice",
    );

    expect(windows).toContainEqual({
      from,
      to,
      speed: GREENHOUSE_BOOST_SPEED["Tortoise Shrine"],
    });
  });

  it("returns no windows when none are placed", () => {
    expect(getGreenhouseBoostWindows(TEST_FARM, "Rice")).toEqual([]);
    expect(getGreenhouseBoostWindows(TEST_FARM, "Grape")).toEqual([]);
  });
});

describe("getGreenhouseGlowWindows", () => {
  it("returns an open-ended 1.25× window from fertilisedAt for Greenhouse Glow", () => {
    const fertilisedAt = 1_000_000;

    expect(
      getGreenhouseGlowWindows({ name: "Greenhouse Glow", fertilisedAt }),
    ).toEqual([
      {
        from: fertilisedAt,
        to: Number.MAX_SAFE_INTEGER,
        speed: GREENHOUSE_BOOST_SPEED["Greenhouse Glow"],
      },
    ]);
  });

  it("returns no window for Greenhouse Goodie (a yield compost)", () => {
    expect(
      getGreenhouseGlowWindows({ name: "Greenhouse Goodie", fertilisedAt: 1 }),
    ).toEqual([]);
  });

  it("returns no window without a fertiliser", () => {
    expect(getGreenhouseGlowWindows(undefined)).toEqual([]);
  });

  it("guards a malformed fertiliser with no fertilisedAt", () => {
    expect(
      getGreenhouseGlowWindows({
        name: "Greenhouse Glow",
      } as unknown as GreenhouseFertiliser),
    ).toEqual([]);
  });
});
