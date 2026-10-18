import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { produce } from "immer";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  GameState,
  InventoryItemName,
  SavedLayout,
} from "features/game/types/game";
import { applyFarmLayout, snapshotFarm } from "./layouts";

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
};

/** baseFarm with the given items owned (inventory). */
const withInventory = (owned: Partial<Record<InventoryItemName, number>>) => ({
  ...baseFarm,
  inventory: {
    ...baseFarm.inventory,
    ...Object.fromEntries(
      Object.entries(owned).map(([k, v]) => [k, new Decimal(v as number)]),
    ),
  },
});

/** A game state carrying the layout snapshotted from it, so tests can
 * "clone, mutate, apply" against the saved arrangement. */
type TestState = GameState & { __layout?: SavedLayout };

/** Snapshot `state` into a SavedLayout, as the save effect would. */
const makeLayout = (state: GameState): SavedLayout => ({
  id: "layout-1",
  name: "L",
  createdAt,
  updatedAt: createdAt,
  ...snapshotFarm(state),
});

/** Attach a layout snapshot of `state` for a later apply. */
const withSavedLayout = (state: GameState): TestState => ({
  ...state,
  __layout: makeLayout(state),
});

/** Apply the attached layout over `state` via the shared lib. */
const applyLayout = ({
  state,
}: {
  state: TestState;
  action?: unknown;
  createdAt?: number;
}): GameState =>
  produce(state, (draft) => {
    applyFarmLayout(draft, state.__layout!, createdAt);
  }) as GameState;

// Tests the shared layouts lib (snapshotFarm + applyFarmLayout) directly —
// the layout effects persist to the `layouts` collection around this core.
describe("layouts lib (applyFarmLayout)", () => {
  it("places an owned collectible at its saved position and flip", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 1 }),
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

  it("places a removed-but-owned collectible (the core fix)", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 1 }),
      collectibles: {
        "Wicker Man": [{ id: "a", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    const moved = cloneDeep(saved);
    delete moved.collectibles["Wicker Man"]![0].coordinates;
    moved.collectibles["Wicker Man"]![0].removedAt = createdAt;

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
    });
    expect(result.collectibles["Wicker Man"]![0].removedAt).toBeUndefined();
  });

  it("creates new instances from inventory when none are placed yet", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 2 }),
      collectibles: {
        "Wicker Man": [
          { id: "x", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "y", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"] = [];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const placed = result.collectibles["Wicker Man"]!.filter(
      (c) => !!c.coordinates,
    );
    expect(placed).toHaveLength(2);
    placed.forEach((c) => expect(c.id.startsWith("L")).toBe(true));
    expect(placed.map((c) => c.coordinates)).toContainEqual({ x: 0, y: 0 });
    expect(placed.map((c) => c.coordinates)).toContainEqual({ x: 1, y: 0 });
  });

  it("caps placement at inventory availability (noInventory)", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 1 }),
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

    let counts:
      | { applied: number; skipped: number; noInventory: number }
      | undefined;
    produce(moved, (draft) => {
      counts = applyFarmLayout(draft, moved.__layout!, createdAt);
    });

    expect(counts).toEqual({ applied: 1, skipped: 0, noInventory: 1 });
  });

  it("matches by name, not by saved id (shared layouts)", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 1 }),
      collectibles: {
        "Wicker Man": [
          { id: "from-another-player", coordinates: { x: 0, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"] = [
      { id: "mine", coordinates: { x: 2, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]).toHaveLength(1);
    expect(result.collectibles["Wicker Man"]![0].id).toEqual("mine");
    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("fills positions in order and unplaces extras", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 3 }),
      collectibles: {
        "Wicker Man": [{ id: "a", coordinates: { x: -1, y: 0 }, createdAt }],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"] = [
      { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
      { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
      { id: "c", coordinates: { x: 2, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const placed = result.collectibles["Wicker Man"]!.filter(
      (c) => !!c.coordinates,
    );
    expect(placed).toHaveLength(1);
    expect(placed[0].coordinates).toEqual({ x: -1, y: 0 });
  });

  it("swaps two items without a false self-collision", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 2 }),
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

    const coords = result.collectibles["Wicker Man"]!.map((c) => c.coordinates);
    expect(coords).toContainEqual({ x: 0, y: 0 });
    expect(coords).toContainEqual({ x: 1, y: 0 });
  });

  it("clears items absent from the layout and places the full layout (exact restore)", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 2, "Golden Bonsai": 1 }),
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    // A non-layout item sits on a layout target. Applying is an exact restore:
    // it is lifted back to inventory, so it neither survives nor blocks.
    moved.collectibles["Golden Bonsai"] = [
      { id: "c", coordinates: { x: 0, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const byId = Object.fromEntries(
      result.collectibles["Wicker Man"]!.map((c) => [c.id, c.coordinates]),
    );
    expect(byId["a"]).toEqual({ x: 0, y: 0 });
    expect(byId["b"]).toEqual({ x: 1, y: 0 });
    // The non-layout Golden Bonsai is lifted (returned to inventory).
    expect(
      result.collectibles["Golden Bonsai"]![0].coordinates,
    ).toBeUndefined();
  });

  it("reports applied / skipped / noInventory counts", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 2 }),
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    // b's saved position is now off-land.
    moved.__layout!.collectibles["Wicker Man"]![1].coordinates = {
      x: 50,
      y: 50,
    };

    let counts:
      | { applied: number; skipped: number; noInventory: number }
      | undefined;
    produce(moved, (draft) => {
      counts = applyFarmLayout(draft, moved.__layout!, createdAt);
    });

    expect(counts).toEqual({ applied: 1, skipped: 1, noInventory: 0 });
  });

  it("places a removed-but-owned resource", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Crop Plot": 1 }),
      crops: { c1: { x: 2, y: 0, createdAt } },
    });

    const moved = cloneDeep(saved);
    delete moved.crops.c1.x;
    delete moved.crops.c1.y;
    moved.crops.c1.removedAt = createdAt;

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.crops.c1.x).toEqual(2);
    expect(result.crops.c1.y).toEqual(0);
    expect(result.crops.c1.removedAt).toBeUndefined();
  });

  it("creates new crop plots from inventory", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Crop Plot": 2 }),
      crops: {
        c1: { x: 0, y: 0, createdAt },
        c2: { x: 1, y: 0, createdAt },
      },
    });

    const moved = cloneDeep(saved);
    moved.crops = {};

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const placed = Object.values(result.crops).filter((c) => c.x !== undefined);
    expect(placed).toHaveLength(2);
  });

  it("creates new tree nodes from inventory (tiered family)", () => {
    const saved = withSavedLayout({
      ...withInventory({ Tree: 2 }),
      trees: {
        t1: { x: -3, y: 0, wood: { choppedAt: 0 }, createdAt },
        t2: { x: -1, y: 0, wood: { choppedAt: 0 }, createdAt },
      },
    });

    const moved = cloneDeep(saved);
    moved.trees = {};

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const placed = Object.values(result.trees).filter((t) => t.x !== undefined);
    expect(placed).toHaveLength(2);
    placed.forEach((t) => {
      expect(t.name).toEqual("Tree");
      expect(t.wood).toBeDefined();
    });
  });

  it("carries oX/oY render offsets through to the placed position", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 1 }),
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

  it("places buildings", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Fire Pit": 1 }),
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

  const EQUIPPED = {
    background: "Farm Background" as const,
    body: "Beige Farmer Potion" as const,
    hair: "Basic Hair" as const,
    shoes: "Black Farmer Boots" as const,
    pants: "Farmer Pants" as const,
    shirt: "Yellow Farmer Shirt" as const,
    tool: "Farmer Pitchfork" as const,
  };
  const BUD = {
    aura: "Basic" as const,
    colour: "Beige" as const,
    ears: "Ears" as const,
    stem: "3 Leaf Clover" as const,
    type: "Beach" as const,
  };
  const petNFT = (coordinates: { x: number; y: number }) => ({
    id: 1,
    name: "Pet #1" as const,
    requests: { food: [], fedAt: createdAt },
    energy: 100,
    experience: 0,
    pettedAt: createdAt,
    coordinates,
    location: "farm" as const,
  });

  it("places owned buds, pet NFTs, farmhands and the bumpkin (with flip)", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      buds: { 1: { ...BUD, coordinates: { x: 2, y: 2 }, location: "farm" } },
      pets: { nfts: { 1: petNFT({ x: -1, y: 1 }) } },
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped: EQUIPPED,
            coordinates: { x: 1, y: 0 },
            flipped: true,
            location: "farm",
          },
        },
      },
      bumpkin: {
        ...baseFarm.bumpkin,
        coordinates: { x: 2, y: 0 },
        location: "farm",
        flipped: true,
      },
    });

    const moved = cloneDeep(saved);
    moved.buds![1].coordinates = { x: -3, y: 0 };
    moved.pets!.nfts![1].coordinates = { x: 1, y: 2 };
    moved.farmHands.bumpkins["fh-1"].coordinates = { x: -2, y: 0 };
    moved.farmHands.bumpkins["fh-1"].flipped = false;
    moved.bumpkin.coordinates = { x: -1, y: 2 };
    moved.bumpkin.flipped = false;

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.buds![1].coordinates).toEqual({ x: 2, y: 2 });
    expect(result.pets!.nfts![1].coordinates).toEqual({ x: -1, y: 1 });
    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 1,
      y: 0,
    });
    expect(result.farmHands.bumpkins["fh-1"].flipped).toEqual(true);
    expect(result.bumpkin.coordinates).toEqual({ x: 2, y: 0 });
    expect(result.bumpkin.flipped).toEqual(true);
  });

  it("places farmhands by count, ignoring the saved id", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      farmHands: {
        bumpkins: {
          a: {
            equipped: EQUIPPED,
            coordinates: { x: 0, y: 0 },
            location: "farm",
          },
          b: {
            equipped: EQUIPPED,
            coordinates: { x: 1, y: 0 },
            location: "farm",
          },
        },
      },
    });

    const moved = cloneDeep(saved);
    moved.farmHands = {
      bumpkins: {
        mine: {
          equipped: EQUIPPED,
          coordinates: { x: 2, y: 0 },
          location: "farm",
        },
      },
    };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.farmHands.bumpkins["mine"].coordinates).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("skips buds/pets the player does not own (shared layouts)", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      buds: { 1: { ...BUD, coordinates: { x: 2, y: 2 }, location: "farm" } },
    });

    const moved = cloneDeep(saved);
    moved.buds = {};

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.buds).toEqual({});
  });

  it("leaves a blocked item at its original spot (best-effort restore)", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 1 }),
      collectibles: {
        "Wicker Man": [{ id: "w", coordinates: { x: 0, y: 0 }, createdAt }],
      },
    });

    const moved = cloneDeep(saved);
    // Layout wants Wicker Man off-land at (50, 0) (blocked by the land bounds — a
    // block exact restore can't clear); it currently sits at (0, 0), which stays
    // free, so the best-effort restore leaves it there.
    moved.__layout!.collectibles["Wicker Man"]![0].coordinates = {
      x: 50,
      y: 0,
    };
    moved.collectibles["Wicker Man"] = [
      { id: "w", coordinates: { x: 0, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.collectibles["Wicker Man"]![0].coordinates).toEqual({
      x: 0,
      y: 0,
    });
  });

  it("unplaces a blocked item when its original tile is taken by the layout", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 2 }),
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "b", coordinates: { x: 2, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    // Layout: a -> (50, 0) [off-land, blocked by bounds], b -> (0, 0) [a's
    // original tile]. b claims a's original, so a has nowhere to fall back to.
    moved.__layout!.collectibles["Wicker Man"] = [
      { id: "a", coordinates: { x: 50, y: 0 } },
      { id: "b", coordinates: { x: 0, y: 0 } },
    ];
    moved.collectibles["Wicker Man"] = [
      { id: "a", coordinates: { x: 0, y: 0 }, createdAt },
      { id: "b", coordinates: { x: 2, y: 0 }, createdAt },
    ];

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const byId = Object.fromEntries(
      result.collectibles["Wicker Man"]!.map((c) => [c.id, c.coordinates]),
    );
    expect(byId["b"]).toEqual({ x: 0, y: 0 });
    expect(byId["a"]).toBeUndefined();
  });

  it("restores each owned collectible to its own saved spot (hybrid by id)", () => {
    // ids sort opposite to positions, so pure-availability would swap them.
    const saved = withSavedLayout({
      ...withInventory({ "Wicker Man": 2 }),
      collectibles: {
        "Wicker Man": [
          { id: "z", coordinates: { x: 0, y: 0 }, createdAt },
          { id: "a", coordinates: { x: 1, y: 0 }, createdAt },
        ],
      },
    });

    const moved = cloneDeep(saved);
    moved.collectibles["Wicker Man"]![0].coordinates = { x: 2, y: 0 }; // z
    moved.collectibles["Wicker Man"]![1].coordinates = { x: -1, y: 0 }; // a

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    const byId = Object.fromEntries(
      result.collectibles["Wicker Man"]!.map((c) => [c.id, c.coordinates]),
    );
    expect(byId["z"]).toEqual({ x: 0, y: 0 });
    expect(byId["a"]).toEqual({ x: 1, y: 0 });
  });

  it("restores each owned resource node to its own saved spot (hybrid by id)", () => {
    const saved = withSavedLayout({
      ...withInventory({ "Crop Plot": 2 }),
      crops: {
        z: { x: 0, y: 0, createdAt },
        a: { x: 1, y: 0, createdAt },
      },
    });

    const moved = cloneDeep(saved);
    moved.crops.z = { x: 2, y: 0, createdAt };
    moved.crops.a = { x: -1, y: 0, createdAt };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.crops.z).toMatchObject({ x: 0, y: 0 });
    expect(result.crops.a).toMatchObject({ x: 1, y: 0 });
  });

  it("restores each owned farmhand to its own saved spot (hybrid by id)", () => {
    const saved = withSavedLayout({
      ...baseFarm,
      farmHands: {
        bumpkins: {
          z: {
            equipped: EQUIPPED,
            coordinates: { x: 0, y: 0 },
            location: "farm",
          },
          a: {
            equipped: EQUIPPED,
            coordinates: { x: 1, y: 0 },
            location: "farm",
          },
        },
      },
    });

    const moved = cloneDeep(saved);
    moved.farmHands.bumpkins.z.coordinates = { x: 2, y: 0 };
    moved.farmHands.bumpkins.a.coordinates = { x: -1, y: 0 };

    const result = applyLayout({
      state: moved,
      action: { type: "layout.applied", layoutId: 0 },
    });

    expect(result.farmHands.bumpkins.z.coordinates).toEqual({ x: 0, y: 0 });
    expect(result.farmHands.bumpkins.a.coordinates).toEqual({ x: 1, y: 0 });
  });
});
