import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, PlacedItem } from "features/game/types/game";
import { getHomeImportPlan, type HomeImportPlan } from "./importHomeItems";
import { removeCollectible } from "./removeCollectible";
import { placeCollectible } from "./placeCollectible";

// The default TEST_FARM is on the `basic` island, whose interior is a 6x6
// room (36 placeable tiles, x ∈ [3,8], y ∈ [2,7] in layout coords).
const ROOM_TILES = 36;

const bears = (count: number): PlacedItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `bear-${i}`,
    // Coordinates in the OLD home — values are irrelevant, import reassigns them.
    coordinates: { x: i, y: i },
  }));

// A placed item is owned, so the inventory count must reflect it — otherwise
// placeCollectible (reused by the import loop) would refuse to re-place it.
const baseState = (homeBears: number): GameState => ({
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Bear": new Decimal(homeBears),
  },
  home: { collectibles: { "Basic Bear": bears(homeBears) } },
  interior: { ground: { collectibles: {} } },
});

const placedCount = (items?: PlacedItem[]) =>
  (items ?? []).filter((i) => i.coordinates).length;

/**
 * Mirrors exactly what the migration panel does on confirm: for each planned
 * placement, dig the item up from the old home then place it on the target
 * floor, threading the resulting state through each step.
 */
const applyPlan = (state: GameState, plan: HomeImportPlan): GameState =>
  plan.placements.reduce((acc, { name, id, location, coordinates }) => {
    const dugUp = removeCollectible({
      state: acc,
      action: { type: "collectible.removed", name, id, location: "home" },
    });
    return placeCollectible({
      state: dugUp,
      action: { type: "collectible.placed", name, id, coordinates, location },
    });
  }, state);

describe("getHomeImportPlan", () => {
  it("plans a spot for every placed home item that fits", () => {
    const plan = getHomeImportPlan(baseState(3));
    expect(plan.total).toBe(3);
    expect(plan.placements).toHaveLength(3);
    expect(plan.unplaced).toHaveLength(0);
  });

  it("assigns a distinct, non-overlapping spot to every item", () => {
    const plan = getHomeImportPlan(baseState(5));
    const keys = plan.placements.map(
      (p) => `${p.coordinates.x},${p.coordinates.y}`,
    );
    expect(new Set(keys).size).toBe(plan.placements.length);
  });

  it("marks items that do not fit as unplaced", () => {
    const overflow = ROOM_TILES + 1;
    const plan = getHomeImportPlan(baseState(overflow));
    expect(plan.total).toBe(overflow);
    expect(plan.placements).toHaveLength(ROOM_TILES);
    expect(plan.unplaced).toHaveLength(1);
  });

  it("overflows onto level_one once the ground floor is full and upstairs is unlocked", () => {
    const total = ROOM_TILES + 4;
    const state: GameState = {
      ...baseState(total),
      interior: {
        ground: { collectibles: {} },
        expansion: "level-one-start",
        level_one: { collectibles: {} },
      },
    };

    const plan = getHomeImportPlan(state);
    expect(
      plan.placements.filter((p) => p.location === "interior"),
    ).toHaveLength(ROOM_TILES);
    expect(
      plan.placements.filter((p) => p.location === "level_one"),
    ).toHaveLength(4);
    expect(plan.unplaced).toHaveLength(0);
  });

  it("ignores old-home items that were never placed (no coordinates)", () => {
    const state: GameState = {
      ...baseState(0),
      home: { collectibles: { "Basic Bear": [{ id: "unplaced-bear" }] } },
    };
    expect(getHomeImportPlan(state).total).toBe(0);
  });
});

describe("import apply loop (collectible.removed + collectible.placed)", () => {
  it("moves placed home items onto the interior ground floor", () => {
    const state = baseState(3);
    const next = applyPlan(state, getHomeImportPlan(state));

    // All three left the old home (no placed items remain there)...
    expect(placedCount(next.home.collectibles["Basic Bear"])).toBe(0);

    // ...and landed on the ground floor with fresh coordinates.
    const placed = next.interior.ground.collectibles["Basic Bear"] ?? [];
    expect(placed).toHaveLength(3);
    placed.forEach((item) => expect(item.coordinates).toBeDefined());
  });

  it("leaves items that do not fit in the old home", () => {
    const state = baseState(ROOM_TILES + 1);
    const next = applyPlan(state, getHomeImportPlan(state));

    expect(next.interior.ground.collectibles["Basic Bear"]).toHaveLength(
      ROOM_TILES,
    );
    expect(placedCount(next.home.collectibles["Basic Bear"])).toBe(1);
  });

  it("overflows onto level_one when the ground floor is full", () => {
    const total = ROOM_TILES + 4;
    const state: GameState = {
      ...baseState(total),
      interior: {
        ground: { collectibles: {} },
        expansion: "level-one-start",
        level_one: { collectibles: {} },
      },
    };
    const next = applyPlan(state, getHomeImportPlan(state));

    expect(next.interior.ground.collectibles["Basic Bear"]).toHaveLength(
      ROOM_TILES,
    );
    expect(next.interior.level_one?.collectibles["Basic Bear"]).toHaveLength(4);
    expect(placedCount(next.home.collectibles["Basic Bear"])).toBe(0);
  });
});
