import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { produce } from "immer";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { saveLayout } from "./saveLayout";
import { applyLayout } from "./applyLayout";
import { applyFarmLayout } from "./lib/layouts";

const createdAt = 1_700_000_000_000;

const baseFarm: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(1),
    "Beta Pass": new Decimal(1),
  },
  collectibles: {},
  buildings: {},
  trees: {},
  stones: {},
  gold: {},
  iron: {},
  crimstones: {},
  sunstones: {},
  ascensionCrystals: {},
  oilReserves: {},
  crops: {},
  fruitPatches: {},
  beehives: {},
  lavaPits: {},
  flowers: { ...TEST_FARM.flowers, flowerBeds: {} },
  layouts: [],
};

/** Save a layout snapshot of `state` and return the state with the layout. */
const withSavedLayout = (state: GameState): GameState =>
  saveLayout({ state, action: { type: "layout.saved", name: "L" }, createdAt });

describe("applyLayout", () => {
  it("restores a collectible to its saved position and flip", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, flipped: true, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 2, y: 0 };
    moved.collectibles["Wicker Man"]![0].flipped = false;

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
    });
    expect(result.collectibles["Wicker Man"]![0].flipped).toEqual(true);
  });

  it("swaps two items without a false self-collision (lift then place)", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 1, y: 0 };
    moved.collectibles["Wicker Man"]![1].coordinates = { x: 0, y: 0 };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const group = result.collectibles["Wicker Man"]!;
    expect(group.find((c) => c.id === "a")!.coordinates).toEqual({
      x: 0,
      y: 0,
    });
    expect(group.find((c) => c.id === "b")!.coordinates).toEqual({
      x: 1,
      y: 0,
    });
  });

  it("skips an item whose target is blocked but applies the others", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    // Displace both, and drop a non-layout item onto a's saved spot.
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 2, y: 0 };
    moved.collectibles["Wicker Man"]![1].coordinates = { x: -1, y: 0 };
    moved.collectibles["Golden Bonsai"] = [
      { id: "c", coordinates: { x: 0, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const group = result.collectibles["Wicker Man"]!;
    // a's target (0,0) is blocked → a stays where it was.
    expect(group.find((c) => c.id === "a")!.coordinates).toEqual({
      x: 2,
      y: 0,
    });
    // b's target (1,0) is free → b is placed.
    expect(group.find((c) => c.id === "b")!.coordinates).toEqual({
      x: 1,
      y: 0,
    });
    expect(result.collectibles["Golden Bonsai"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("skips an item whose saved position is now off the land", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [{ id: "a", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    const moved = cloneDeep(saved);
    // Pretend the farm shrank (e.g. ascension): the saved spot is now water.
    moved.layouts![0].collectibles["Wicker Man"]![0].coordinates = {
      x: 50,
      y: 50,
    };
    // a currently sits on valid land.
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 1, y: 0 };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 1,
      y: 0,
    });
  });

  it("reports applied and skipped counts", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.layouts![0].collectibles["Wicker Man"]![1].coordinates = {
      x: 50,
      y: 50,
    }; // b's target is now off-land
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 2, y: 0 };
    moved.collectibles["Wicker Man"]![1].coordinates = { x: -1, y: 0 };

    let counts: { applied: number; skipped: number } | undefined;
    produce(moved, (draft) => {
      counts = applyFarmLayout(draft, draft.layouts![0]);
    });

    expect(counts).toEqual({ applied: 1, skipped: 1 });
  });

  it("skips snapshot members that no longer exist and applies the rest", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"] = [
      { id: "a", coordinates: { x: 2, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]).toHaveLength(1);
    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("restores resource coordinates as top-level x/y", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      crops: { c1: { x: 2, y: 0, createdAt } },
    });

    const moved = cloneDeep(saved);
    moved.crops.c1.x = -3;
    moved.crops.c1.y = 0;

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.crops.c1.x).toEqual(2);
    expect(result.crops.c1.y).toEqual(0);
    expect("coordinates" in result.crops.c1).toBe(false);
  });

  it("carries oX/oY render offsets through to the restored position", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0, oX: 4, oY: -4 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 2, y: 0 };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
      oX: 4,
      oY: -4,
    });
  });

  it("repositions buildings", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      buildings: {
        "Fire Pit": [
          {
            id: "fp",
            coordinates: { x: -3, y: 0 },
            createdAt,
            readyAt: createdAt,
          },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.buildings["Fire Pit"]![0].coordinates = { x: -2, y: 3 };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.buildings["Fire Pit"]![0].coordinates).toEqual({
      x: -3,
      y: 0,
    });
  });

  it("never restores a skipped item onto another layout item's tile", () => {
    // Saved: a -> (0,0), b -> (2,0). Now: a sits at (2,0) (b's target), b is
    // elsewhere, and a non-layout item blocks a's target (0,0). a can't move, so
    // b must NOT be placed onto (2,0) and overlap a.
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 2, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 2, y: 0 };
    moved.collectibles["Wicker Man"]![1].coordinates = { x: -1, y: 0 };
    moved.collectibles["Golden Bonsai"] = [
      { id: "c", coordinates: { x: 0, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const group = result.collectibles["Wicker Man"]!;
    const a = group.find((c) => c.id === "a")!.coordinates!;
    const b = group.find((c) => c.id === "b")!.coordinates!;
    expect(a).toEqual({ x: 2, y: 0 });
    expect(`${a.x},${a.y}`).not.toEqual(`${b.x},${b.y}`);
  });

  it("does not re-place a withdrawn (coordinate-less) collectible", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      collectibles: {
        "Wicker Man": [{ id: "a", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    const moved = cloneDeep(saved);
    // Removed during landscaping: still owned (in the bucket) but unplaced.
    delete moved.collectibles["Wicker Man"]![0].coordinates;
    moved.collectibles["Wicker Man"]![0].removedAt = createdAt;

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]![0].coordinates).toBeUndefined();
  });

  it("throws when the layout does not exist", () => {
    expect(() =>
      applyLayout({
        state: baseFarm,
        action: { type: "layout.applied", layoutId: 0 },
      }),
    ).toThrow("Layout does not exist");
  });
});
