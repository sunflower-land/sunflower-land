import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { INITIAL_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import type { GameState, InventoryItemName } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import { snapshotFarm } from "./lib/layouts";
import { isOutOfBounds } from "features/game/expansion/placeable/lib/collisionDetection";
import {
  applyArrangement,
  snapshotSurface,
  ArrangementConflictError,
  type Arrangement,
  type ArrangementConflict,
} from "./applyArrangement";

const createdAt = 1_700_000_000_000;

const baseFarm: GameState = {
  ...INITIAL_FARM,
  bumpkin: { ...INITIAL_BUMPKIN, coordinates: undefined, location: undefined },
  inventory: {
    ...INITIAL_FARM.inventory,
    "Basic Land": new Decimal(3),
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
  flowers: { ...INITIAL_FARM.flowers, flowerBeds: {} },
  mushrooms: { spawnedAt: 0, mushrooms: {} },
  home: { collectibles: {} },
  buds: {},
  farmHands: { bumpkins: {} },
  pets: { ...INITIAL_FARM.pets, nfts: {} },
  airdrops: [],
  socialFarming: {
    ...INITIAL_FARM.socialFarming,
    clutter: { spawnedAt: 0, locations: {} },
  },
};

const withInventory = (
  state: GameState,
  owned: Partial<Record<InventoryItemName, number>>,
): GameState => ({
  ...state,
  inventory: {
    ...state.inventory,
    ...Object.fromEntries(
      Object.entries(owned).map(([k, v]) => [k, new Decimal(v as number)]),
    ),
  },
});

const apply = (
  state: GameState,
  arrangement: Arrangement,
  location: PlaceableLocation = "farm",
) =>
  applyArrangement({
    state,
    action: { type: "arrangement.saved", location, arrangement },
    createdAt,
  });

const conflictsOf = (fn: () => unknown): ArrangementConflict[] => {
  try {
    fn();
  } catch (e) {
    if (e instanceof ArrangementConflictError) return e.conflicts;
    throw e;
  }
  throw new Error("expected an ArrangementConflictError");
};

describe("applyArrangement", () => {
  it("is a no-op for an identical arrangement", () => {
    const state: GameState = withInventory(
      {
        ...baseFarm,
        collectibles: {
          "Basic Bear": [{ id: "a", coordinates: { x: 0, y: 0 } }],
        },
        buildings: {
          "Fire Pit": [
            {
              id: "fp",
              coordinates: { x: -3, y: 3 },
              createdAt: 1,
              readyAt: 1,
            },
          ],
        },
        trees: { t1: { x: 2, y: 2, createdAt: 1, wood: { choppedAt: 0 } } },
      },
      { "Basic Bear": 1, "Fire Pit": 1, Tree: 1 },
    );
    const before = cloneDeep(state);

    const result = apply(state, snapshotFarm(state));

    expect(result).toEqual(before);
    expect(state).toEqual(before);
  });

  it("throws for a surface that is not unlocked", () => {
    const noUpstairs: GameState = {
      ...baseFarm,
      interior: { ground: { collectibles: {} } },
    };

    expect(() => apply(noUpstairs, { collectibles: {} }, "level_one")).toThrow(
      /not unlocked/,
    );
  });

  describe("moves", () => {
    it("moves a building without touching its timers or stamping removedAt", () => {
      const state = withInventory(
        {
          ...baseFarm,
          buildings: {
            "Fire Pit": [
              {
                id: "fp",
                coordinates: { x: -3, y: 3 },
                createdAt: 5,
                readyAt: 5,
                crafting: [
                  {
                    name: "Mashed Potato",
                    readyAt: createdAt + 60_000,
                  },
                ],
              },
            ],
          },
        },
        { "Fire Pit": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.buildings["Fire Pit"]![0].coordinates = { x: 0, y: 3 };

      const result = apply(state, arrangement);

      const firePit = result.buildings["Fire Pit"]![0];
      expect(firePit.coordinates).toEqual({ x: 0, y: 3 });
      expect(firePit.createdAt).toBe(5);
      expect(firePit.readyAt).toBe(5);
      expect(firePit.removedAt).toBeUndefined();
      expect(firePit.crafting).toEqual([
        { name: "Mashed Potato", readyAt: createdAt + 60_000 },
      ]);
    });

    it("writes pixel offsets and flips on a collectible move", () => {
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Basic Bear": [{ id: "a", coordinates: { x: 0, y: 0 } }],
          },
        },
        { "Basic Bear": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"]![0] = {
        id: "a",
        coordinates: { x: 1, y: 1, oX: 3, oY: -2 },
        flipped: true,
      };

      const result = apply(state, arrangement);

      expect(result.collectibles["Basic Bear"]![0]).toEqual({
        id: "a",
        coordinates: { x: 1, y: 1, oX: 3, oY: -2 },
        flipped: true,
      });
    });

    it("moves a resource by x/y only", () => {
      const state = withInventory(
        {
          ...baseFarm,
          trees: {
            t1: { x: 2, y: 2, createdAt: 1, wood: { choppedAt: 123 } },
          },
        },
        { Tree: 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.resources.trees.t1 = { x: 0, y: 0, oX: 4, oY: 4 };

      const result = apply(state, arrangement);

      expect(result.trees.t1).toEqual({
        x: 0,
        y: 0,
        createdAt: 1,
        wood: { choppedAt: 123 },
      });
    });

    it("lets two items swap positions", () => {
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Basic Bear": [
              { id: "a", coordinates: { x: 0, y: 0 } },
              { id: "b", coordinates: { x: 1, y: 0 } },
            ],
          },
        },
        { "Basic Bear": 2 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"] = [
        { id: "a", coordinates: { x: 1, y: 0 } },
        { id: "b", coordinates: { x: 0, y: 0 } },
      ];

      const result = apply(state, arrangement);

      expect(result.collectibles["Basic Bear"]).toEqual([
        { id: "a", coordinates: { x: 1, y: 0 } },
        { id: "b", coordinates: { x: 0, y: 0 } },
      ]);
    });
  });

  describe("removals", () => {
    it("runs the real remove reducer: a lifted beehive credits its honey once", () => {
      const state = withInventory(
        {
          ...baseFarm,
          beehives: {
            h1: {
              x: 0,
              y: 0,
              swarm: false,
              honey: {
                updatedAt: createdAt,
                produced: DEFAULT_HONEY_PRODUCTION_TIME,
              },
              flowers: [],
            },
          },
        },
        { Beehive: 1, Honey: 0 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.resources.beehives = {};

      const result = apply(state, arrangement);

      expect(result.inventory.Honey).toEqual(new Decimal(1));
      expect(result.beehives.h1.x).toBeUndefined();
      expect(result.beehives.h1.removedAt).toBe(createdAt);
    });

    it("rejects the whole commit when a removal is blocked, leaving the input untouched", () => {
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Time Warp Totem": [
              { id: "totem", coordinates: { x: 0, y: 0 }, createdAt },
            ],
            "Basic Bear": [{ id: "a", coordinates: { x: 2, y: 2 } }],
          },
        },
        { "Time Warp Totem": 1, "Basic Bear": 1 },
      );
      const before = cloneDeep(state);
      const arrangement = snapshotFarm(state);
      delete arrangement.collectibles["Time Warp Totem"];
      // A valid move in the same commit must not be applied either.
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 1, y: 1 };

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toEqual([
        {
          code: "REMOVAL_BLOCKED",
          name: "Time Warp Totem",
          id: "totem",
          coordinates: { x: 0, y: 0 },
          reason: "This limited time item is in use",
        },
      ]);
      expect(state).toEqual(before);
    });

    it("never removes the Town Center", () => {
      const state = withInventory(
        {
          ...baseFarm,
          buildings: {
            "Town Center": [
              {
                id: "tc",
                coordinates: { x: -1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        { "Town Center": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.buildings = {};

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toEqual([
        {
          code: "NOT_REMOVABLE",
          name: "Town Center",
          id: "tc",
          coordinates: { x: -1, y: 1 },
        },
      ]);
    });

    it("blocks lifting a building that is still under construction", () => {
      const state = withInventory(
        {
          ...baseFarm,
          buildings: {
            "Fire Pit": [
              {
                id: "fp",
                coordinates: { x: -3, y: 3 },
                createdAt,
                readyAt: createdAt + 60_000,
              },
            ],
          },
        },
        { "Fire Pit": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.buildings = {};

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]).toMatchObject({
        code: "REMOVAL_BLOCKED",
        name: "Fire Pit",
        id: "fp",
      });
    });
  });

  describe("placements", () => {
    it("places a chest item as a new instance with the client id and server createdAt", () => {
      const state = withInventory(baseFarm, {
        "Basic Bear": 1,
        "Fire Pit": 1,
      });
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"] = [
        { id: "new-bear", coordinates: { x: 0, y: 0 } },
      ];
      arrangement.buildings["Fire Pit"] = [
        { id: "new-pit", coordinates: { x: -3, y: 3 } },
      ];

      const result = apply(state, arrangement);

      expect(result.collectibles["Basic Bear"]).toEqual([
        { id: "new-bear", coordinates: { x: 0, y: 0 } },
      ]);
      expect(result.buildings["Fire Pit"]).toEqual([
        {
          id: "new-pit",
          coordinates: { x: -3, y: 3 },
          createdAt,
          readyAt: createdAt,
        },
      ]);
    });

    it("re-placing a lifted instance resumes its paused timer", () => {
      const state = withInventory(
        {
          ...baseFarm,
          trees: {
            t1: {
              createdAt: 1,
              removedAt: createdAt - 1000,
              wood: { choppedAt: createdAt - 5000 },
            },
          },
        },
        { Tree: 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.resources.trees.t1 = { x: 0, y: 0 };

      const result = apply(state, arrangement);

      expect(result.trees.t1.x).toBe(0);
      expect(result.trees.t1.removedAt).toBeUndefined();
      // Legacy (non-windowed) pause: the lift's downtime is added back.
      expect(result.trees.t1.wood.choppedAt).toBe(createdAt - 4000);
    });

    it("reports a placement the player cannot afford", () => {
      const state = withInventory(baseFarm, { "Basic Bear": 0 });
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"] = [
        { id: "new-bear", coordinates: { x: 0, y: 0 } },
      ];

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toEqual([
        {
          code: "NOT_OWNED",
          name: "Basic Bear",
          id: "new-bear",
          coordinates: { x: 0, y: 0 },
          reason: "You can't place an item that is not on the inventory",
        },
      ]);
    });

    it("reports an unknown item name", () => {
      const arrangement = snapshotFarm(baseFarm);
      (arrangement.collectibles as Record<string, unknown>)["Not A Thing"] = [
        { id: "x", coordinates: { x: 0, y: 0 } },
      ];

      const conflicts = conflictsOf(() => apply(baseFarm, arrangement));

      expect(conflicts).toEqual([
        {
          code: "UNKNOWN_ITEM",
          name: "Not A Thing",
          id: "x",
          coordinates: { x: 0, y: 0 },
        },
      ]);
    });

    it("never pulls an instance that is placed in another location", () => {
      const state = withInventory(
        {
          ...baseFarm,
          home: {
            collectibles: {
              "Basic Bear": [{ id: "h", coordinates: { x: 0, y: 0 } }],
            },
          },
        },
        { "Basic Bear": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"] = [
        { id: "h", coordinates: { x: 0, y: 0 } },
      ];

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toEqual([
        {
          code: "PLACED_ELSEWHERE",
          name: "Basic Bear",
          id: "h",
          coordinates: { x: 0, y: 0 },
        },
      ]);
    });
  });

  describe("validation of the final state", () => {
    it("reports an item moved off the land", () => {
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Basic Bear": [{ id: "a", coordinates: { x: 0, y: 0 } }],
          },
        },
        { "Basic Bear": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 50, y: 50 };

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toEqual([
        {
          code: "OFF_LAND",
          name: "Basic Bear",
          id: "a",
          coordinates: { x: 50, y: 50 },
        },
      ]);
    });

    it("reports each overlapping pair once", () => {
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Basic Bear": [
              { id: "a", coordinates: { x: 0, y: 0 } },
              { id: "b", coordinates: { x: 1, y: 0 } },
            ],
          },
        },
        { "Basic Bear": 2 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"]![1].coordinates = { x: 0, y: 0 };

      const conflicts = conflictsOf(() => apply(state, arrangement));

      expect(conflicts).toEqual([
        {
          code: "COLLISION",
          name: "Basic Bear",
          id: "b",
          coordinates: { x: 0, y: 0 },
          with: { name: "Basic Bear", id: "a" },
        },
      ]);
    });

    it("lets rugs share a tile with other items", () => {
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Basic Bear": [{ id: "a", coordinates: { x: 0, y: 0 } }],
            Rug: [{ id: "r", coordinates: { x: 1, y: 0 } }],
          },
        },
        { "Basic Bear": 1, Rug: 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles.Rug![0].coordinates = { x: 0, y: 0 };

      const result = apply(state, arrangement);

      expect(result.collectibles.Rug![0].coordinates).toEqual({ x: 0, y: 0 });
    });
  });

  describe("buds, pets, farm hands and the bumpkin", () => {
    const bud = { type: "Plaza", colour: "Red" } as unknown as NonNullable<
      GameState["buds"]
    >[number];

    it("moves and removes buds by id", () => {
      const state: GameState = {
        ...baseFarm,
        buds: {
          1: { ...bud, coordinates: { x: 0, y: 0 }, location: "farm" },
          2: { ...bud, coordinates: { x: 2, y: 2 }, location: "farm" },
        },
      };
      const arrangement = snapshotFarm(state);
      arrangement.buds = { 1: { x: 1, y: 1 } };

      const result = apply(state, arrangement);

      expect(result.buds?.[1]).toEqual({
        ...bud,
        coordinates: { x: 1, y: 1 },
        location: "farm",
      });
      expect(result.buds?.[2].coordinates).toBeUndefined();
      expect(result.buds?.[2].location).toBeUndefined();
    });

    it("reports a bud the player does not own", () => {
      const arrangement = snapshotFarm(baseFarm);
      arrangement.buds = { 99: { x: 1, y: 1 } };

      const conflicts = conflictsOf(() => apply(baseFarm, arrangement));

      expect(conflicts).toEqual([
        {
          code: "NOT_OWNED",
          name: "Bud",
          id: "99",
          coordinates: { x: 1, y: 1 },
          reason: "This NFT does not exist",
        },
      ]);
    });

    it("places a farm hand with its flip", () => {
      const state: GameState = {
        ...baseFarm,
        farmHands: {
          bumpkins: { fh1: { equipped: INITIAL_BUMPKIN.equipped } },
        },
      };
      const arrangement = snapshotFarm(state);
      arrangement.farmHands = { fh1: { x: 0, y: 0, flipped: true } };

      const result = apply(state, arrangement);

      expect(result.farmHands.bumpkins.fh1).toEqual({
        equipped: INITIAL_BUMPKIN.equipped,
        coordinates: { x: 0, y: 0 },
        location: "farm",
        flipped: true,
      });
    });

    it("moves and flips the player's bumpkin", () => {
      const state: GameState = {
        ...baseFarm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          coordinates: { x: 0, y: 0 },
          location: "farm",
        },
      };
      const arrangement = snapshotFarm(state);
      arrangement.bumpkin = { x: 1, y: 1, flipped: true };

      const result = apply(state, arrangement);

      expect(result.bumpkin.coordinates).toEqual({ x: 1, y: 1 });
      expect(result.bumpkin.flipped).toBe(true);
      expect(result.bumpkin.location).toBe("farm");
    });
  });

  describe("indoor surfaces", () => {
    /** Any 1x1 tile the given surface accepts, found by asking the bounds check. */
    const validTile = (state: GameState, location: PlaceableLocation) => {
      for (let x = -6; x <= 6; x++) {
        for (let y = 6; y >= -6; y--) {
          const position = { x, y, width: 1, height: 1 };
          if (!isOutOfBounds({ state, position, location })) return { x, y };
        }
      }
      throw new Error(`no valid tile for ${location}`);
    };

    const homeFarm: GameState = {
      ...baseFarm,
      inventory: { ...baseFarm.inventory, "Basic Bear": new Decimal(2) },
      home: {
        collectibles: {
          "Basic Bear": [{ id: "h1", coordinates: { x: 0, y: 0 } }],
        },
      },
    };

    it("moves an item within the home without touching the farm", () => {
      // Same item name placed on BOTH surfaces, at the same coordinates —
      // indoor and outdoor coordinate spaces overlap numerically, so this is
      // the case that catches a commit reading the wrong bucket.
      const state: GameState = {
        ...homeFarm,
        collectibles: {
          "Basic Bear": [{ id: "f1", coordinates: { x: 0, y: 0 } }],
        },
      };
      const arrangement = snapshotSurface(state, "home");
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 1, y: 1 };

      const result = apply(state, arrangement, "home");

      expect(result.home.collectibles["Basic Bear"]![0].coordinates).toEqual({
        x: 1,
        y: 1,
      });
      expect(result.collectibles["Basic Bear"]![0].coordinates).toEqual({
        x: 0,
        y: 0,
      });
    });

    it("reports an item pushed outside the home bounds", () => {
      const arrangement = snapshotSurface(homeFarm, "home");
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 40, y: 40 };

      const conflicts = conflictsOf(() => apply(homeFarm, arrangement, "home"));

      expect(conflicts).toEqual([
        {
          code: "OFF_LAND",
          name: "Basic Bear",
          id: "h1",
          coordinates: { x: 40, y: 40 },
        },
      ]);
    });

    it("removes an item from the home", () => {
      const arrangement = snapshotSurface(homeFarm, "home");
      arrangement.collectibles = {};

      const result = apply(homeFarm, arrangement, "home");

      expect(
        result.home.collectibles["Basic Bear"]![0].coordinates,
      ).toBeUndefined();
    });

    it("places a chest item into the home", () => {
      const arrangement = snapshotSurface(homeFarm, "home");
      arrangement.collectibles["Basic Bear"]!.push({
        id: "h2",
        coordinates: { x: 2, y: 2 },
      });

      const result = apply(homeFarm, arrangement, "home");

      expect(result.home.collectibles["Basic Bear"]).toHaveLength(2);
      expect(result.home.collectibles["Basic Bear"]![1].coordinates).toEqual({
        x: 2,
        y: 2,
      });
    });

    it("moves the bumpkin within the home and keeps its location", () => {
      const state: GameState = {
        ...homeFarm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          coordinates: { x: 0, y: 1 },
          location: "home",
        },
      };
      const arrangement = snapshotSurface(state, "home");
      arrangement.bumpkin = { x: 1, y: 2 };

      const result = apply(state, arrangement, "home");

      expect(result.bumpkin.coordinates).toEqual({ x: 1, y: 2 });
      expect(result.bumpkin.location).toBe("home");
    });

    it("never carries an item between surfaces", () => {
      // The farm instance is placed, so the home arrangement cannot claim it.
      const state: GameState = {
        ...homeFarm,
        collectibles: {
          "Basic Bear": [{ id: "f1", coordinates: { x: 3, y: 3 } }],
        },
      };
      const arrangement = snapshotSurface(state, "home");
      arrangement.collectibles["Basic Bear"]!.push({
        id: "f1",
        coordinates: { x: 2, y: 2 },
      });

      const conflicts = conflictsOf(() => apply(state, arrangement, "home"));

      expect(conflicts).toEqual([
        expect.objectContaining({ code: "PLACED_ELSEWHERE", id: "f1" }),
      ]);
    });

    it("rejects farm-only buckets in an indoor arrangement", () => {
      const arrangement = snapshotSurface(homeFarm, "home");
      arrangement.buildings = {
        "Fire Pit": [{ id: "fp", coordinates: { x: 0, y: 0 } }],
      };

      expect(() => apply(homeFarm, arrangement, "home")).toThrow(
        /cannot contain buildings/,
      );
    });

    it("rearranges the interior floor", () => {
      const state: GameState = {
        ...baseFarm,
        inventory: { ...baseFarm.inventory, "Basic Bear": new Decimal(1) },
        interior: {
          ground: {
            collectibles: {
              "Basic Bear": [{ id: "i1", coordinates: { x: 0, y: 0 } }],
            },
          },
        },
      };
      const from = validTile(state, "interior");
      const placed: GameState = {
        ...state,
        interior: {
          ground: {
            collectibles: {
              "Basic Bear": [{ id: "i1", coordinates: from }],
            },
          },
        },
      };
      const arrangement = snapshotSurface(placed, "interior");
      arrangement.collectibles["Basic Bear"]![0].coordinates = {
        ...from,
        x: from.x + 1,
      };

      const result = apply(placed, arrangement, "interior");

      expect(
        result.interior.ground.collectibles["Basic Bear"]![0].coordinates,
      ).toEqual({ ...from, x: from.x + 1 });
    });

    it("rearranges the pet house and rejects entities it cannot hold", () => {
      const state: GameState = {
        ...baseFarm,
        inventory: { ...baseFarm.inventory, Barkley: new Decimal(1) },
        petHouse: {
          level: 1,
          pets: { Barkley: [{ id: "p1", coordinates: { x: 0, y: 0 } }] },
        },
      };
      const arrangement = snapshotSurface(state, "petHouse");
      arrangement.collectibles.Barkley![0].coordinates = { x: 1, y: 1 };

      const result = apply(state, arrangement, "petHouse");
      expect(result.petHouse.pets.Barkley![0].coordinates).toEqual({
        x: 1,
        y: 1,
      });

      const withBumpkin = snapshotSurface(state, "petHouse");
      withBumpkin.bumpkin = { x: 0, y: 0 };
      expect(() => apply(state, withBumpkin, "petHouse")).toThrow(
        /cannot contain a bumpkin/,
      );
    });

    it("leaves indoor surfaces out of the farm's post passes", () => {
      // A stale hive on the farm must not be re-derived by a home commit.
      const state: GameState = {
        ...homeFarm,
        beehives: {
          h1: {
            x: -2,
            y: -2,
            swarm: false,
            honey: { updatedAt: 0, produced: 0 },
            flowers: [],
          },
        },
      };
      const arrangement = snapshotSurface(state, "home");
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 1, y: 1 };

      const result = apply(state, arrangement, "home");

      expect(result.beehives.h1.honey.updatedAt).toBe(0);
    });
  });

  describe("post passes", () => {
    // updateBeehives stamps every hive's honey.updatedAt to `createdAt`, which
    // makes it observable without spying on the module.
    const staleHive = {
      x: -2,
      y: -2,
      swarm: false,
      honey: { updatedAt: 0, produced: 0 },
      flowers: [],
    };

    it("recomputes beehives once when a flower bed moves", () => {
      const state = withInventory(
        {
          ...baseFarm,
          beehives: { h1: staleHive },
          flowers: {
            ...baseFarm.flowers,
            flowerBeds: { fb: { createdAt: 1, x: 0, y: 0 } },
          },
        },
        { "Flower Bed": 1, Beehive: 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.resources.flowerBeds.fb = { x: 1, y: 1 };

      const result = apply(state, arrangement);

      expect(result.beehives.h1.honey.updatedAt).toBe(createdAt);
    });

    it("does not recompute beehives when nothing bee-related changed", () => {
      const state = withInventory(
        {
          ...baseFarm,
          beehives: { h1: staleHive },
          collectibles: {
            "Basic Bear": [{ id: "a", coordinates: { x: 0, y: 0 } }],
          },
        },
        { "Basic Bear": 1, Beehive: 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 1, y: 1 };

      const result = apply(state, arrangement);

      expect(result.beehives.h1.honey.updatedAt).toBe(0);
    });

    it("refreshes the Basic Scarecrow AOE after applying", () => {
      const plantedAt = createdAt - 10_000;
      const baseDurationMs = 60_000;
      const state = withInventory(
        {
          ...baseFarm,
          collectibles: {
            "Basic Scarecrow": [{ id: "s", coordinates: { x: 0, y: 0 } }],
            "Basic Bear": [{ id: "a", coordinates: { x: 2, y: 2 } }],
          },
          crops: {
            p1: {
              createdAt: 1,
              x: 1,
              y: 0,
              crop: { name: "Sunflower", plantedAt, baseDurationMs },
            },
          },
          // Stale cell: the plot sits at offset (1, 0) from the scarecrow.
          aoe: { "Basic Scarecrow": { 1: { 0: 123 } } },
        },
        { "Basic Scarecrow": 1, "Basic Bear": 1, "Crop Plot": 1 },
      );
      const arrangement = snapshotFarm(state);
      arrangement.collectibles["Basic Bear"]![0].coordinates = { x: 2, y: 1 };

      const result = apply(state, arrangement);

      expect(result.aoe["Basic Scarecrow"]![1]![0]).toBe(
        plantedAt + baseDurationMs,
      );
    });
  });
});
