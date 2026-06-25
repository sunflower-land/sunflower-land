import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, PlacedItem } from "features/game/types/game";
import type { Bud } from "features/game/types/buds";
import type { PetNFT } from "features/game/types/pets";
import {
  getHomeImportPlan,
  hasHomeItemsToImport,
  tryApplyImportStep,
  type HomeImportPlan,
} from "./importHomeItems";

// The default TEST_FARM is on the `basic` island, whose interior is a 6x6
// room (36 placeable tiles, x ∈ [3,8], y ∈ [2,7] in layout coords).
const ROOM_TILES = 36;

const bears = (count: number): PlacedItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `bear-${i}`,
    // Coordinates in the OLD home — values are irrelevant, import reassigns them.
    coordinates: { x: i, y: i },
  }));

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
 * placement, dig up + place down together via {@link tryApplyImportStep},
 * skipping (leaving in the old home) anything that can't be placed.
 */
const applyPlan = (state: GameState, plan: HomeImportPlan): GameState =>
  plan.placements.reduce((acc, placement) => {
    const result = tryApplyImportStep(acc, placement);
    return result ? result.state : acc;
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

  it("includes the bumpkin, farm hands, buds and pet NFTs placed in the old home", () => {
    const state: GameState = {
      ...baseState(0),
      bumpkin: {
        ...TEST_FARM.bumpkin!,
        coordinates: { x: 0, y: 0 },
        location: "home",
      },
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped: TEST_FARM.bumpkin!.equipped,
            coordinates: { x: 1, y: 1 },
            location: "home",
          },
        },
      },
      buds: {
        1: { coordinates: { x: 2, y: 2 }, location: "home" } as unknown as Bud,
      },
      pets: {
        nfts: {
          1: {
            coordinates: { x: 3, y: 3 },
            location: "home",
          } as unknown as PetNFT,
        },
      },
    };

    const plan = getHomeImportPlan(state);
    const kinds = plan.placements.map((p) => p.item.kind).sort();
    expect(kinds).toEqual(["bud", "bumpkin", "farmHand", "petNFT"]);
    expect(plan.total).toBe(4);
    expect(plan.unplaced).toHaveLength(0);
  });

  it("ignores bumpkin / buds / pet NFTs that are not in the old home", () => {
    const state: GameState = {
      ...baseState(0),
      bumpkin: {
        ...TEST_FARM.bumpkin!,
        coordinates: { x: 0, y: 0 },
        location: "farm",
      },
      buds: {
        1: { coordinates: { x: 2, y: 2 }, location: "farm" } as unknown as Bud,
      },
    };
    expect(getHomeImportPlan(state).total).toBe(0);
  });
});

describe("hasHomeItemsToImport", () => {
  it("is false when the old home is empty", () => {
    expect(hasHomeItemsToImport(baseState(0))).toBe(false);
  });

  it("is true with a placed home collectible", () => {
    expect(hasHomeItemsToImport(baseState(1))).toBe(true);
  });

  it("is true with only a bud in the old home", () => {
    const state: GameState = {
      ...baseState(0),
      buds: {
        1: { coordinates: { x: 0, y: 0 }, location: "home" } as unknown as Bud,
      },
    };
    expect(hasHomeItemsToImport(state)).toBe(true);
  });
});

describe("import apply loop (dig up + place down)", () => {
  it("moves placed home collectibles onto the interior ground floor", () => {
    const state = baseState(3);
    const next = applyPlan(state, getHomeImportPlan(state));

    // All three left the old home (no placed items remain there)...
    expect(placedCount(next.home.collectibles["Basic Bear"])).toBe(0);

    // ...and landed on the ground floor with fresh coordinates.
    const placed = next.interior.ground.collectibles["Basic Bear"] ?? [];
    expect(placed).toHaveLength(3);
    placed.forEach((item) => expect(item.coordinates).toBeDefined());
  });

  it("leaves collectibles that do not fit in the old home", () => {
    const state = baseState(ROOM_TILES + 1);
    const next = applyPlan(state, getHomeImportPlan(state));

    expect(next.interior.ground.collectibles["Basic Bear"]).toHaveLength(
      ROOM_TILES,
    );
    expect(placedCount(next.home.collectibles["Basic Bear"])).toBe(1);
  });

  it("overflows collectibles onto level_one when the ground floor is full", () => {
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

  it("relocates the bumpkin, farm hand and bud from home to the interior", () => {
    const state: GameState = {
      ...baseState(0),
      bumpkin: {
        ...TEST_FARM.bumpkin!,
        coordinates: { x: 0, y: 0 },
        location: "home",
      },
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped: TEST_FARM.bumpkin!.equipped,
            coordinates: { x: 1, y: 1 },
            location: "home",
          },
        },
      },
      buds: {
        1: { coordinates: { x: 2, y: 2 }, location: "home" } as unknown as Bud,
      },
    };

    const next = applyPlan(state, getHomeImportPlan(state));

    expect(next.bumpkin?.location).toBe("interior");
    expect(next.farmHands.bumpkins["fh-1"].location).toBe("interior");
    expect(next.buds?.[1].location).toBe("interior");
  });
});

describe("tryApplyImportStep", () => {
  it("leaves the item untouched when it cannot be placed (never digs it up)", () => {
    // Target level_one, which isn't unlocked → the place step throws, so the
    // dig-up must be rolled back and the bear left exactly where it was.
    const state = baseState(1);
    const placement = {
      item: {
        kind: "collectible" as const,
        name: "Basic Bear" as const,
        id: "bear-0",
        width: 1,
        height: 1,
      },
      location: "level_one" as const,
      coordinates: { x: 0, y: 0 },
    };

    const result = tryApplyImportStep(state, placement);

    expect(result).toBeNull();
    // Original state is untouched — the bear is still placed in the old home.
    expect(placedCount(state.home.collectibles["Basic Bear"])).toBe(1);
  });

  it("relocates the item and returns the events to dispatch on success", () => {
    const state = baseState(1);
    const placement = {
      item: {
        kind: "collectible" as const,
        name: "Basic Bear" as const,
        id: "bear-0",
        width: 1,
        height: 1,
      },
      location: "interior" as const,
      coordinates: { x: 0, y: 0 },
    };

    const result = tryApplyImportStep(state, placement);

    expect(result).not.toBeNull();
    expect(result!.events.map((e) => e.type)).toEqual([
      "collectible.removed",
      "collectible.placed",
    ]);
    expect(placedCount(result!.state.home.collectibles["Basic Bear"])).toBe(0);
    expect(
      result!.state.interior.ground.collectibles["Basic Bear"],
    ).toHaveLength(1);
  });
});
