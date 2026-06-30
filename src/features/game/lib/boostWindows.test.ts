import {
  computeReadyAt,
  getBoostWindows,
  getEffectiveSpeedAt,
  workAccruedAt,
  CROP_PLOT_BOOST_SPEED,
  TREE_BOOST_SPEED,
  MINE_BOOST_SPEED,
  getTreeBoostWindows,
  getMineBoostWindows,
  appendBoostHistory,
  type BoostWindow,
} from "./boostWindows";
import { EXPIRY_COOLDOWNS } from "./collectibleBuilt";
import { TEST_FARM } from "./constants";
import type { GameState } from "../types/game";
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
      to: createdAt + EXPIRY_COOLDOWNS["Timber Hourglass"],
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
      to: createdAt + EXPIRY_COOLDOWNS["Badger Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Super Totem"],
        speed: TREE_BOOST_SPEED["Super Totem"],
      },
    ]);
  });

  it("includes a removed/burned Timber Hourglass via boostHistory", () => {
    // The booster is gone from collectibles, but its finalised window survives
    // in boostHistory so an in-progress tree still gets the recovered credit.
    const from = 1_000_000;
    const to = from + EXPIRY_COOLDOWNS["Timber Hourglass"];
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
        to: createdAt + EXPIRY_COOLDOWNS["Super Totem"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Badger Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Ore Hourglass"],
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
          to: createdAt + EXPIRY_COOLDOWNS["Super Totem"],
          speed: MINE_BOOST_SPEED["Super Totem"],
        },
      ]);
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
        to: createdAt + EXPIRY_COOLDOWNS["Mole Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Ore Hourglass"],
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
          to: createdAt + EXPIRY_COOLDOWNS["Super Totem"],
          speed: MINE_BOOST_SPEED["Super Totem"],
        },
      ]);
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
          to: createdAt + EXPIRY_COOLDOWNS["Mole Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Badger Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Mole Shrine"],
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
        to: createdAt + EXPIRY_COOLDOWNS["Mole Shrine"],
        speed: MINE_BOOST_SPEED["Mole Shrine"],
      });
    });
  });
});
