import {
  computeReadyAt,
  getBoostWindows,
  getEffectiveSpeedAt,
  workAccruedAt,
  CROP_PLOT_BOOST_SPEED,
  appendBoostHistory,
  type BoostWindow,
} from "./boostWindows";
import { EXPIRY_COOLDOWNS } from "./collectibleBuilt";
import { TEST_FARM } from "./constants";
import type { GameState } from "../types/game";

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
        to: createdAt + EXPIRY_COOLDOWNS["Sparrow Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Sparrow Shrine"],
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
    const cooldown = EXPIRY_COOLDOWNS["Sparrow Shrine"];
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
    const cooldown = EXPIRY_COOLDOWNS["Sparrow Shrine"];
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
