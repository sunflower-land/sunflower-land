import { INITIAL_FARM, TEST_FARM } from "features/game/lib/constants";
import type {
  GameState,
  InventoryItemName,
  SavedLayout,
} from "features/game/types/game";
import {
  upgrade,
  getAscensionUpgradeCost,
  ASCENSION_BUMPKIN_LEVEL,
} from "./upgradeFarm";
import Decimal from "decimal.js-light";
import {
  LEVEL_EXPERIENCE,
  ascensionBaseline,
  bandXp,
} from "features/game/lib/level";
import { CONFIG } from "lib/config";
import { TIME_BASED_FEATURE_FLAG_WINDOWS } from "lib/flags";

const SPOOKY_ASCENSION_START =
  TIME_BASED_FEATURE_FLAG_WINDOWS.SPOOKY_ASCENSION.start.getTime();
import { getLand, TOTAL_EXPANSION_NODES } from "features/game/types/expansions";
import {
  getIslandAnchorX,
  getIslandSpawnPositions,
} from "features/game/expansion/lib/island";
import { getExpectedAscensionCrystals } from "features/game/expansion/lib/ascension";

describe("upgradeFarm", () => {
  const farmId = 1;
  it("requires a player has met the expansions", () => {
    expect(() =>
      upgrade({
        farmId,
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...TEST_FARM,
        },
      }),
    ).toThrow("Player has not met the expansion requirements");
  });

  it("requires a player has ingredients", () => {
    expect(() =>
      upgrade({
        farmId,
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(9),
            Gold: new Decimal(1),
          },
        },
      }),
    ).toThrow("Insufficient Gold");
  });

  it("burns the ingredients", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
      },
    });

    expect(state.inventory.Gold).toEqual(new Decimal(5));
  });

  it("resets the expansions", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
      },
    });

    expect(state.inventory["Basic Land"]).toEqual(new Decimal(4));
  });

  it("resets collectibles, buildings, fishing, chickens, buds, flowers, beehives, oil, crimstone", () => {
    const now = Date.now();
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
        fishing: {
          wharf: {
            castedAt: 10001023,
            caught: { Anchovy: 1 },
          },
        },
        mushrooms: {
          mushrooms: {
            1: {
              amount: 1,
              name: "Wild Mushroom",
              x: 1,
              y: 1,
            },
          },
          spawnedAt: 0,
        },
        oilReserves: {
          oil: {
            oil: {
              drilledAt: 1,
            },
            createdAt: 1,
            drilled: 1,
            x: 1,
            y: 1,
          },
        },
        collectibles: {
          "Abandoned Bear": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100001,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100001,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        buds: {
          1: {
            aura: "Basic",
            colour: "Beige",
            ears: "Ears",
            stem: "3 Leaf Clover",
            type: "Beach",
            location: "farm",
            coordinates: { x: 1, y: 1 },
          },
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            0: {
              createdAt: now,
              x: -2,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 123,
              },
            },
          },
        },
        beehives: {
          "1234": {
            flowers: [],
            x: 1,
            y: 1,
            swarm: true,
            honey: {
              updatedAt: 0,
              produced: 500,
            },
          },
        },
        crimstones: {
          crim: {
            createdAt: 1,
            minesLeft: 1,
            stone: { minedAt: now - 1 * 60 * 60 * 1000 },
            x: 100,
            y: 100,
          },
        },
      },
      createdAt: now,
    });

    expect(state.collectibles).toEqual({
      "Abandoned Bear": [
        {
          createdAt: 100001,
          id: "1",
          readyAt: 0,
          removedAt: now,
        },
      ],
    });

    expect(
      Object.values(state.buildings)
        .flat()
        .map((b) => b.coordinates),
    ).not.toContain({ x: expect.any(Number), y: expect.any(Number) });
    expect(state.fishing.wharf).toEqual({});
    // Mushrooms are no longer wiped on upgrade — they relocate to the new
    // island's small island instead (see dedicated test below). spawnedAt
    // carries across and the mushroom is preserved.
    expect(state.mushrooms?.spawnedAt).toEqual(0);
    expect(Object.keys(state.mushrooms?.mushrooms ?? {})).toHaveLength(1);
    expect(state.buds).toEqual({
      1: {
        aura: "Basic",
        colour: "Beige",
        ears: "Ears",
        stem: "3 Leaf Clover",
        type: "Beach",
      },
    });
    expect(state.flowers.flowerBeds).toEqual({
      0: {
        createdAt: now,
        removedAt: now,
        flower: {
          name: "Red Pansy",
          plantedAt: 123,
        },
      },
    });
    expect(state.beehives).toEqual({
      "1234": {
        flowers: [],
        removedAt: now,
        swarm: true,
        honey: {
          updatedAt: 0,
          produced: 0,
        },
      },
    });
    expect(state.oilReserves).toEqual({
      oil: {
        oil: {
          drilledAt: 1,
        },
        createdAt: 1,
        drilled: 1,
        removedAt: now,
      },
    });
    expect(state.crimstones).toEqual({
      crim: {
        createdAt: 1,
        minesLeft: 1,
        stone: { minedAt: now - 1 * 60 * 60 * 1000 },
        removedAt: now,
      },
    });
  });

  it("relocates existing mushrooms onto the new island's small island", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
        mushrooms: {
          spawnedAt: 1234,
          mushrooms: {
            // On the main land
            1: { amount: 1, name: "Wild Mushroom", x: 1, y: 1 },
            // Stranded on the previous island
            2: { amount: 2, name: "Magic Mushroom", x: -9, y: 5 },
          },
        },
      },
    });

    // Basic land upgrades to the spring island, which starts with 4 expansions.
    const islandTileKeys = new Set(
      getIslandSpawnPositions(4).map((t) => `${t.x},${t.y}`),
    );

    const mushrooms = state.mushrooms?.mushrooms ?? {};
    const entries = Object.values(mushrooms);

    // No mushrooms are lost on upgrade
    expect(entries).toHaveLength(2);

    // spawnedAt carries across the upgrade
    expect(state.mushrooms?.spawnedAt).toEqual(1234);

    // Names & amounts are preserved
    expect(mushrooms["1"]).toMatchObject({ name: "Wild Mushroom", amount: 1 });
    expect(mushrooms["2"]).toMatchObject({ name: "Magic Mushroom", amount: 2 });

    // Every mushroom now sits on a distinct island spawn tile
    const positions = entries.map((m) => `${m.x},${m.y}`);
    positions.forEach((position) => {
      expect(islandTileKeys.has(position)).toBe(true);
    });
    expect(new Set(positions).size).toEqual(positions.length);
  });

  it("relocates existing clutter onto the new island's small island", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          clutter: {
            spawnedAt: 4321,
            locations: {
              // Stranded on the previous island
              a: { type: "Dung", x: -9, y: 5 },
              b: { type: "Weed", x: -9, y: 4 },
            },
          },
        },
      },
    });

    // Basic land upgrades to the spring island, which starts with 4 expansions.
    const islandTileKeys = new Set(
      getIslandSpawnPositions(4).map((t) => `${t.x},${t.y}`),
    );

    const clutter = state.socialFarming.clutter;
    const locations = clutter?.locations ?? {};
    const entries = Object.values(locations);

    // No clutter is lost on upgrade
    expect(entries).toHaveLength(2);

    // spawnedAt carries across the upgrade
    expect(clutter?.spawnedAt).toEqual(4321);

    // Types & ids are preserved
    expect(locations["a"]?.type).toEqual("Dung");
    expect(locations["b"]?.type).toEqual("Weed");

    // Every clutter now sits on a distinct island spawn tile
    const positions = entries.map((c) => `${c.x},${c.y}`);
    positions.forEach((position) => {
      expect(islandTileKeys.has(position)).toBe(true);
    });
    expect(new Set(positions).size).toEqual(positions.length);
  });

  it("anchors relocated mushrooms & clutter to the new island count, not the source count (desert → volcano)", () => {
    // The island tracks the land's left edge, which only shifts at certain
    // expansion counts: a 25-expansion source farm anchors its island at x=-19,
    // while the fresh 5-expansion volcano island anchors at x=-13. Items must
    // follow the *new* count, so anything seeded on the source island's tiles
    // must be pulled onto the volcano island's tiles.
    const sourceTiles = getIslandSpawnPositions(25); // x=-19 band
    const newTiles = getIslandSpawnPositions(5); // x=-13 band
    const sourceTileKeys = new Set(sourceTiles.map((t) => `${t.x},${t.y}`));
    const newTileKeys = new Set(newTiles.map((t) => `${t.x},${t.y}`));

    // Sanity: the two islands genuinely sit on different tiles.
    expect([...sourceTileKeys].some((k) => newTileKeys.has(k))).toBe(false);

    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
        },
        mushrooms: {
          spawnedAt: 1234,
          mushrooms: {
            // Sitting on the source (25-expansion) island's tiles
            1: { amount: 1, name: "Wild Mushroom", ...sourceTiles[0] },
            2: { amount: 2, name: "Magic Mushroom", ...sourceTiles[1] },
          },
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          clutter: {
            spawnedAt: 4321,
            locations: {
              a: { type: "Dung", ...sourceTiles[2] },
            },
          },
        },
      },
    });

    const mushrooms = Object.values(state.mushrooms?.mushrooms ?? {});
    const clutter = Object.values(state.socialFarming.clutter?.locations ?? {});

    // Nothing lost
    expect(mushrooms).toHaveLength(2);
    expect(clutter).toHaveLength(1);

    // Every item now sits on the new volcano island, and none lingers on the
    // source island's tiles.
    [...mushrooms, ...clutter].forEach((item) => {
      const key = `${item.x},${item.y}`;
      expect(newTileKeys.has(key)).toBe(true);
      expect(sourceTileKeys.has(key)).toBe(false);
    });
  });

  it("does not reset flower codex", () => {
    const createdAt = Date.now();
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
        flowers: {
          discovered: {
            "Blue Balloon Flower": ["Apple"],
          },
          flowerBeds: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 123,
              },
            },
          },
        },
      },
      createdAt,
    });

    expect(state.flowers.discovered).toEqual({
      "Blue Balloon Flower": ["Apple"],
    });
  });

  it("upgrades to spring island", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
          "Fire Pit": new Decimal(1),
          "Crop Plot": new Decimal(31),
          Tree: new Decimal(9),
          "Stone Rock": new Decimal(7),
          "Iron Rock": new Decimal(4),
          "Gold Rock": new Decimal(2),
        },
      },
    });

    expect(state.inventory.House).toEqual(new Decimal(1));
    expect(state.inventory["Fruit Patch"]).toEqual(new Decimal(2));
    expect(state.inventory["Town Center"]).toBeUndefined();

    expect(state.buildings.House?.[0].coordinates).toEqual({ x: -1, y: 5 });
    expect(state.buildings.Workbench?.[0].coordinates).toEqual({ x: 6, y: 6 });
    expect(state.buildings.Market?.[0].coordinates).toEqual({ x: 6, y: 3 });
    expect(state.buildings["Fire Pit"]?.[0].coordinates).toEqual({
      x: 6,
      y: 0,
    });

    expect(state.crops).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: -2,
        y: 0,
      },
      "2": {
        createdAt: expect.any(Number),
        x: -1,
        y: 0,
      },
      "3": {
        createdAt: expect.any(Number),
        x: 0,
        y: 0,
      },
      "4": {
        createdAt: expect.any(Number),
        x: -2,
        y: -1,
      },
      "5": {
        createdAt: expect.any(Number),
        x: -1,
        y: -1,
      },
      "6": {
        createdAt: expect.any(Number),
        x: 0,
        y: -1,
      },
      "7": {
        createdAt: expect.any(Number),
        x: -2,
        y: 1,
      },
      "8": {
        createdAt: expect.any(Number),
        x: -1,
        y: 1,
      },
      "9": {
        createdAt: expect.any(Number),
        x: 0,
        y: 1,
      },
      "10": {
        createdAt: expect.any(Number),
        x: 1,
        y: 1,
      },
      "11": {
        createdAt: expect.any(Number),
        x: 1,
        y: 0,
      },
      "12": {
        createdAt: expect.any(Number),
        x: 1,
        y: -1,
      },
      "13": {
        createdAt: expect.any(Number),
        x: 2,
        y: 1,
      },
      "14": {
        createdAt: expect.any(Number),
        x: 2,
        y: 0,
      },
      "15": {
        createdAt: expect.any(Number),
        x: 2,
        y: -1,
      },
      "16": {
        createdAt: expect.any(Number),
        x: 3,
        y: 1,
      },
      "17": {
        createdAt: expect.any(Number),
        x: 3,
        y: 0,
      },
      "18": {
        createdAt: expect.any(Number),
        x: 3,
        y: -1,
      },
    });

    expect(state.fruitPatches).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: 0,
        y: 9,
      },
      "2": {
        createdAt: expect.any(Number),
        x: -2,
        y: 9,
      },
    });

    expect(state.trees).toEqual({
      "1": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 3,
        y: 6,
      },
      "2": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 3,
        y: 4,
      },
      "3": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 6,
        y: 9,
      },
    });

    expect(state.gold).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: 3,
        y: 9,
        name: "Gold Rock",
        multiplier: 1,
        tier: 1,
      },
    });

    expect(state.iron).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: 5,
        y: 8,
        name: "Iron Rock",
        multiplier: 1,
        tier: 1,
      },
    });

    expect(state.stones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: -3,
        y: 5,
      },
      "2": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: -2,
        y: 3,
      },
    });
  });

  it("upgrades to desert island", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(16),
          Crimstone: new Decimal(20),
          "Fire Pit": new Decimal(1),
          "Crop Plot": new Decimal(45),
          "Fruit Patch": new Decimal(11),
          Tree: new Decimal(18),
          "Stone Rock": new Decimal(15),
          "Iron Rock": new Decimal(9),
          "Gold Rock": new Decimal(6),
          "Crimstone Rock": new Decimal(2),
          "Sunstone Rock": new Decimal(2),
          Beehive: new Decimal(3),
          "Flower Bed": new Decimal(3),
        },
      },
    });

    expect(state.inventory.Manor).toEqual(new Decimal(1));
    expect(state.inventory["Town Center"]).toBeUndefined();

    expect(state.buildings.Manor?.[0].coordinates).toEqual({ x: -1, y: 5 });
    expect(state.buildings.Workbench?.[0].coordinates).toEqual({ x: 6, y: 6 });
    expect(state.buildings.Market?.[0].coordinates).toEqual({ x: 6, y: 3 });
    expect(state.buildings["Fire Pit"]?.[0].coordinates).toEqual({
      x: 6,
      y: 0,
    });

    expect(state.crops).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: -2,
        y: 0,
      },
      "2": {
        createdAt: expect.any(Number),
        x: -1,
        y: 0,
      },
      "3": {
        createdAt: expect.any(Number),
        x: 0,
        y: 0,
      },
      "4": {
        createdAt: expect.any(Number),
        x: -2,
        y: -1,
      },
      "5": {
        createdAt: expect.any(Number),
        x: -1,
        y: -1,
      },
      "6": {
        createdAt: expect.any(Number),
        x: 0,
        y: -1,
      },
      "7": {
        createdAt: expect.any(Number),
        x: -2,
        y: 1,
      },
      "8": {
        createdAt: expect.any(Number),
        x: -1,
        y: 1,
      },
      "9": {
        createdAt: expect.any(Number),
        x: 0,
        y: 1,
      },
      "10": {
        createdAt: expect.any(Number),
        x: 1,
        y: 1,
      },
      "11": {
        createdAt: expect.any(Number),
        x: 1,
        y: 0,
      },
      "12": {
        createdAt: expect.any(Number),
        x: 1,
        y: -1,
      },
      "13": {
        createdAt: expect.any(Number),
        x: 2,
        y: 1,
      },
      "14": {
        createdAt: expect.any(Number),
        x: 2,
        y: 0,
      },
      "15": {
        createdAt: expect.any(Number),
        x: 2,
        y: -1,
      },
      "16": {
        createdAt: expect.any(Number),
        x: 3,
        y: 1,
      },
      "17": {
        createdAt: expect.any(Number),
        x: 3,
        y: 0,
      },
      "18": {
        createdAt: expect.any(Number),
        x: 3,
        y: -1,
      },
    });

    expect(state.fruitPatches).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: 0,
        y: 9,
      },
      "2": {
        createdAt: expect.any(Number),
        x: -2,
        y: 9,
      },
    });

    expect(state.trees).toEqual({
      "1": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 4,
        y: 6,
      },
      "2": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 4,
        y: 4,
      },
      "3": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 6,
        y: 9,
      },
    });

    expect(state.gold).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: 3,
        y: 9,
        name: "Gold Rock",
        multiplier: 1,
        tier: 1,
      },
    });

    expect(state.iron).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: 5,
        y: 8,
        name: "Iron Rock",
        multiplier: 1,
        tier: 1,
      },
    });

    expect(state.stones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: -3,
        y: 5,
      },
      "2": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: -2,
        y: 3,
      },
    });
  });

  it("upgrades to volcano island", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Fire Pit": new Decimal(1),
          "Crop Plot": new Decimal(65),
          "Fruit Patch": new Decimal(15),
          Tree: new Decimal(23),
          "Stone Rock": new Decimal(20),
          "Iron Rock": new Decimal(12),
          "Gold Rock": new Decimal(7),
          "Crimstone Rock": new Decimal(4),
          "Sunstone Rock": new Decimal(6),
          Beehive: new Decimal(3),
          "Flower Bed": new Decimal(3),
        },
      },
    });
    expect(state.buildings.Manor).toBeUndefined();

    expect(state.inventory.Mansion).toEqual(new Decimal(1));
    expect(state.buildings.Mansion?.[0].coordinates).toEqual({ x: -1, y: 5 });
    expect(state.buildings.Workbench?.[0].coordinates).toEqual({ x: 6, y: 6 });
    expect(state.buildings.Market?.[0].coordinates).toEqual({ x: 6, y: 3 });
    expect(state.buildings["Fire Pit"]?.[0].coordinates).toEqual({
      x: 6,
      y: 0,
    });

    expect(state.crops).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: -1,
        y: -1,
      },
      "2": {
        createdAt: expect.any(Number),
        x: 0,
        y: -1,
      },
      "3": {
        createdAt: expect.any(Number),
        x: 1,
        y: -1,
      },
      "4": {
        createdAt: expect.any(Number),
        x: -1,
        y: -2,
      },
      "5": {
        createdAt: expect.any(Number),
        x: 0,
        y: -2,
      },
      "6": {
        createdAt: expect.any(Number),
        x: 1,
        y: -2,
      },
      "7": {
        createdAt: expect.any(Number),
        x: -1,
        y: 0,
      },
      "8": {
        createdAt: expect.any(Number),
        x: 0,
        y: 0,
      },
      "9": {
        createdAt: expect.any(Number),
        x: 1,
        y: 0,
      },
      "10": {
        createdAt: expect.any(Number),
        x: 2,
        y: 0,
      },
      "11": {
        createdAt: expect.any(Number),
        x: 2,
        y: -1,
      },
      "12": {
        createdAt: expect.any(Number),
        x: 2,
        y: -2,
      },
      "13": {
        createdAt: expect.any(Number),
        x: 3,
        y: 0,
      },
      "14": {
        createdAt: expect.any(Number),
        x: 3,
        y: -1,
      },
      "15": {
        createdAt: expect.any(Number),
        x: 3,
        y: -2,
      },
      "16": {
        createdAt: expect.any(Number),
        x: 4,
        y: 0,
      },
      "17": {
        createdAt: expect.any(Number),
        x: 4,
        y: -1,
      },
      "18": {
        createdAt: expect.any(Number),
        x: 4,
        y: -2,
      },
    });

    expect(state.fruitPatches).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: 0,
        y: 9,
      },
      "2": {
        createdAt: expect.any(Number),
        x: -2,
        y: 9,
      },
    });

    expect(state.trees).toEqual({
      "1": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 5,
        y: 9,
      },
      "2": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 3,
        y: 9,
      },
      "3": {
        createdAt: expect.any(Number),
        wood: expect.any(Object),
        x: 3,
        y: 7,
      },
    });

    expect(state.gold).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: 2,
        y: 9,
        name: "Gold Rock",
        multiplier: 1,
        tier: 1,
      },
    });

    expect(state.iron).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: 5,
        y: 7,
        name: "Iron Rock",
        multiplier: 1,
        tier: 1,
      },
    });

    expect(state.stones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: -3,
        y: 5,
      },
      "2": {
        createdAt: expect.any(Number),
        stone: expect.any(Object),
        x: -2,
        y: 3,
      },
    });

    expect(state.oilReserves).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: -8,
        y: 8,
        drilled: 0,
        oil: expect.any(Object),
      },
    });
  });

  it("upgrades to swamp island preserving the player's arrangement", () => {
    const createdAt = Date.now();
    // A realistic maxed volcano farm: Mansion already placed, plus a collectible
    // and a tree at custom positions the player chose.
    const mansion = {
      id: "1",
      coordinates: { x: 0, y: 0 },
      createdAt,
      readyAt: createdAt,
    };
    const statue = {
      id: "1",
      coordinates: { x: 3, y: 3 },
      createdAt,
      readyAt: createdAt,
    };
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: {
          type: "volcano",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          // volcano->swamp ascension cost (a=1 base): 30 Crimstone / 50 Oil / 3 Obsidian
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
          Mansion: new Decimal(1),
          "Sunflower Statue": new Decimal(1),
        },
        buildings: { Mansion: [mansion] },
        collectibles: { "Sunflower Statue": [statue] },
        trees: {
          "1": { createdAt, wood: {}, x: 5, y: 5 },
        } as unknown as GameState["trees"],
      },
      createdAt,
    });

    // Transitions onto the swamp ascension island
    expect(state.island.type).toEqual("swamp");
    expect(state.island.ascensionLevel).toEqual(1);
    expect(state.island.upgradedAt).toEqual(createdAt);
    expect(state.island.previousExpansions).toEqual(30);
    expect(state.inventory["Basic Land"]).toEqual(new Decimal(30));

    // Burns the a=1 ascension cost (base: 30 Crimstone / 50 Oil / 3 Obsidian / 5000 coins)
    expect(state.inventory.Crimstone).toEqual(new Decimal(70));
    expect(state.inventory.Oil).toEqual(new Decimal(50));
    expect(state.inventory.Obsidian).toEqual(new Decimal(7));
    expect(state.coins).toEqual(5000);

    // Keeps the player's arrangement in place — nothing is wiped or re-laid out
    expect(state.buildings.Mansion?.[0].coordinates).toEqual({ x: 0, y: 0 });
    expect(state.collectibles["Sunflower Statue"]?.[0].coordinates).toEqual({
      x: 3,
      y: 3,
    });
    expect(state.trees["1"]).toMatchObject({ x: 5, y: 5 });

    // Saves the arrangement as the protected, auto-managed Ascension Layout
    const ascensionLayout = state.layouts?.find((layout) => layout.auto);
    expect(ascensionLayout?.name).toEqual("Ascension Layout");
    expect(ascensionLayout?.resources.ascensionCrystals).toEqual({});
    expect(ascensionLayout?.buildings.Mansion?.[0].coordinates).toEqual({
      x: 0,
      y: 0,
    });

    // Drops the ascension reward chest (Ascension Crystals) on the side island,
    // rather than granting the crystal straight to inventory.
    expect(state.inventory["Ascension Crystal"]).toBeUndefined();
    const chest = state.airdrops?.find(
      (airdrop) => airdrop.id === "missing-resources-ascension-1",
    );
    // Expected crystals at swamp a1 (basicLand 30): 3 (A0) + 1 (upgrade node) = 4
    expect(chest?.items["Ascension Crystal"]).toEqual(4);
    expect(chest?.coordinates).toBeDefined();
  });

  it("delivers node shortfall to the chest and finds a free tile even when the initial rows are full", () => {
    const createdAt = Date.now();
    const anchorX = getIslandAnchorX(30);
    // Occupy every tile in the first two side-island rows (the old fixed set).
    const priorAirdrops = [7, 8].flatMap((y) =>
      [1, 0, 2].map((dx) => ({
        id: `prior-${dx}-${y}`,
        createdAt,
        coordinates: { x: anchorX + dx, y },
        items: {},
        wearables: {},
        sfl: 0,
        coins: 0,
      })),
    );
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
        },
        // Under-provisioned: nothing placed, so the swamp floor is all shortfall.
        collectibles: {},
        buildings: {},
        trees: {},
        stones: {},
        gold: {},
        iron: {},
        crimstones: {},
        sunstones: {},
        oilReserves: {},
        crops: {},
        fruitPatches: {},
        beehives: {},
        lavaPits: {},
        ascensionCrystals: {},
        flowers: { ...INITIAL_FARM.flowers, flowerBeds: {} },
        airdrops: priorAirdrops,
      },
      createdAt,
    });

    const chest = state.airdrops?.find(
      (airdrop) => airdrop.id === "missing-resources-ascension-1",
    );
    // Swamp floor has 3 Lava Pits; the player owns none, so they arrive via the chest.
    expect(chest?.items["Lava Pit"]).toEqual(3);
    // The floor is NOT topped up into inventory anymore.
    expect(state.inventory["Lava Pit"]).toBeUndefined();
    // The chest lands on a genuinely free tile beyond the (full) initial rows.
    const occupied = new Set(
      priorAirdrops.map((a) => `${a.coordinates.x},${a.coordinates.y}`),
    );
    expect(chest?.coordinates).toBeDefined();
    expect(
      occupied.has(`${chest!.coordinates!.x},${chest!.coordinates!.y}`),
    ).toBe(false);
  });

  it("delivers the sunstone shortfall via the chest", () => {
    const createdAt = Date.now();
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
          // Maxed volcano owns the volcano floor of 6 sunstone rocks.
          "Sunstone Rock": new Decimal(6),
        },
        sunstones: {},
      },
      createdAt,
    });

    const chest = state.airdrops?.find(
      (airdrop) => airdrop.id === "missing-resources-ascension-1",
    );
    // Swamp floor wants 13 sunstone rocks; a maxed volcano owns 6, so the chest
    // tops up the remaining 7 (no longer hard-excluded).
    expect(chest?.items["Sunstone Rock"]).toEqual(7);
  });

  it("does not re-grant sunstone rocks the player mined to depletion", () => {
    const createdAt = Date.now();
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
          // Was granted the full 13, but mined 3 rocks to depletion (each rock
          // holds 10 mines) — depletion removes them from inventory, leaving 10.
          "Sunstone Rock": new Decimal(10),
        },
        sunstones: {},
        farmActivity: {
          ...INITIAL_FARM.farmActivity,
          "Sunstone Mined": 30,
        },
      },
      createdAt,
    });

    const chest = state.airdrops?.find(
      (airdrop) => airdrop.id === "missing-resources-ascension-1",
    );
    // owned = 10 inventory + 3 depleted = 13 = floor, so no sunstone shortfall.
    expect(chest?.items["Sunstone Rock"]).toBeUndefined();
  });

  it("delivers the basic-upgrade back-pay via a chest while still laying out the new island", () => {
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        island: { type: "desert" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Crop Plot": new Decimal(65),
          "Fruit Patch": new Decimal(15),
          Tree: new Decimal(23),
          "Stone Rock": new Decimal(20),
          "Iron Rock": new Decimal(12),
          "Gold Rock": new Decimal(7),
          "Crimstone Rock": new Decimal(4),
          "Sunstone Rock": new Decimal(6),
          Beehive: new Decimal(3),
          "Flower Bed": new Decimal(3),
        },
      },
    });

    // The starting island is still laid out from inventory (placeInitialLand runs
    // before the back-pay) — the volcano floor's Oil Reserve is placed.
    expect(Object.keys(state.oilReserves)).toHaveLength(1);

    // The upgrade's Ascension Crystals are folded into the reward chest keyed on
    // the target island, not granted straight to inventory.
    const chest = state.airdrops?.find(
      (airdrop) => airdrop.id === "missing-resources-upgrade-volcano",
    );
    expect(chest?.items["Ascension Crystal"]).toBeGreaterThan(0);
    expect(state.inventory["Ascension Crystal"]).toBeUndefined();
  });

  it("does not re-grant crystals already pending in an un-collected chest", () => {
    const createdAt = SPOOKY_ASCENSION_START;
    const readyXp = ascensionBaseline(1) + bandXp(1);
    // On swamp (A1) with an un-collected volcano→swamp chest holding the 4
    // crystals the player was already owed.
    const priorChest = {
      id: "missing-resources-ascension-1",
      createdAt,
      coordinates: { x: -30, y: 7 },
      items: { "Ascension Crystal": 4 },
      wearables: {},
      sfl: 0,
      coins: 0,
    };
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        username: "elias",
        coins: 100000,
        bumpkin: { ...INITIAL_FARM.bumpkin, experience: readyXp },
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(42),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
        },
        airdrops: [priorChest],
      },
      createdAt,
    });

    const chests = (state.airdrops ?? []).filter((a) =>
      a.id.startsWith("missing-resources"),
    );
    const totalCrystals = chests.reduce(
      (sum, a) => sum + (a.items["Ascension Crystal"] ?? 0),
      0,
    );
    // Cumulative entitlement at spooky (a2, Basic Land reset to 30) — NOT doubled.
    const expected = getExpectedAscensionCrystals({
      islandType: "spooky",
      ascensionLevel: 2,
      basicLand: 30,
    });
    expect(totalCrystals).toEqual(expected);
    // The new chest only tops up the difference beyond the pending 4.
    const newChest = chests.find(
      (a) => a.id === "missing-resources-ascension-2",
    );
    expect(newChest?.items["Ascension Crystal"]).toEqual(expected - 4);
  });

  it("counts placed crystals once when sizing the reward chest", () => {
    const createdAt = Date.now();
    // Earned 3 A0 crystals, all placed on volcano. Inventory is the total owned
    // (placing does not decrement it); the 3 nodes are a subset of that total,
    // so they must not be counted a second time.
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
          "Ascension Crystal": new Decimal(3),
        },
        ascensionCrystals: {
          c1: { createdAt, x: 1, y: 1, stone: { minedAt: 0 }, minesLeft: 1 },
          c2: { createdAt, x: 3, y: 1, stone: { minedAt: 0 }, minesLeft: 1 },
          c3: { createdAt, x: 5, y: 1, stone: { minedAt: 0 }, minesLeft: 1 },
        } as GameState["ascensionCrystals"],
      },
      createdAt,
    });

    const chest = state.airdrops?.find(
      (a) => a.id === "missing-resources-ascension-1",
    );
    // Expected at swamp a1 (Basic Land 30) = 4; owned = 3 (inventory already
    // includes the 3 placed) → chest tops up exactly 1, not 0.
    expect(chest?.items["Ascension Crystal"]).toEqual(1);
  });

  it("does not duplicate owned nodes into the reward chest (no over-grant)", () => {
    const createdAt = Date.now();
    const floor = {
      "Crop Plot": 65,
      Tree: 23,
      "Stone Rock": 20,
      "Iron Rock": 13,
      "Gold Rock": 8,
      "Fruit Patch": 15,
      "Crimstone Rock": 5,
      "Sunstone Rock": 13,
      "Oil Reserve": 4,
      "Lava Pit": 3,
      Beehive: 3,
      "Flower Bed": 3,
    };
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
          ...Object.fromEntries(
            Object.entries(floor).map(([k, v]) => [k, new Decimal(v)]),
          ),
        },
        // Lava Pits actually PLACED (the reviewer's example) while inventory
        // counts them — proves placement does not make them "uncounted".
        lavaPits: {
          l1: { createdAt, x: -1, y: 1, stone: { minedAt: 0 }, minesLeft: 3 },
          l2: { createdAt, x: 1, y: 1, stone: { minedAt: 0 }, minesLeft: 3 },
          l3: { createdAt, x: 3, y: 1, stone: { minedAt: 0 }, minesLeft: 3 },
        } as GameState["lavaPits"],
      },
      createdAt,
    });

    const chest = state.airdrops?.find(
      (a) => a.id === "missing-resources-ascension-1",
    );
    // Every floor node is already owned (inventory includes placed) → none are
    // re-granted in the chest.
    Object.keys(floor).forEach((node) =>
      expect(chest?.items[node as InventoryItemName]).toBeUndefined(),
    );
  });

  it("ignores non-reward airdrops when sizing the crystal chest", () => {
    const createdAt = Date.now();
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
        },
        // A promo/event airdrop that happens to contain crystals — NOT a reward
        // chest, so it must not count toward what the player is owed here.
        airdrops: [
          {
            id: "promo-gift",
            createdAt,
            coordinates: { x: -30, y: 7 },
            items: { "Ascension Crystal": 10 },
            wearables: {},
            sfl: 0,
            coins: 0,
          },
        ],
      },
      createdAt,
    });

    const chest = state.airdrops?.find(
      (a) => a.id === "missing-resources-ascension-1",
    );
    // Full expected (4) is still delivered — the promo's crystals don't count.
    expect(chest?.items["Ascension Crystal"]).toEqual(4);
  });

  it("requires the minimum Bumpkin level to ascend to swamp island", () => {
    expect(() =>
      upgrade({
        farmId,
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...INITIAL_FARM,
          coins: 10000,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            // One XP short of the required ascension level
            experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL] - 1,
          },
          island: {
            type: "volcano",
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Basic Land": new Decimal(30),
            Crimstone: new Decimal(100),
            Oil: new Decimal(100),
            Obsidian: new Decimal(10),
          },
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Player has not met the level requirements");
  });

  describe("swamp->spooky (A2) temporary lock", () => {
    // Readies the bumpkin for the swamp band so the temporary gate — not the level
    // gate — is what's under test.
    const readyXp = ascensionBaseline(1) + bandXp(1);
    const swampState = {
      ...INITIAL_FARM,
      coins: 10000,
      bumpkin: {
        ...INITIAL_FARM.bumpkin,
        experience: readyXp,
      },
      island: {
        type: "swamp" as const,
        ascensionLevel: 1,
      },
      inventory: {
        ...INITIAL_FARM.inventory,
        // Beta Pass so the SWAMP_ASCENSION beta gate passes on mainnet and the
        // temporary A2 lock is the check under test.
        "Beta Pass": new Decimal(1),
        // Meets the expansion requirement but holds no ascension-cost items, so a
        // player past the temporary gate lands on the cost check.
        "Basic Land": new Decimal(42),
      },
    };

    let previousNetwork: (typeof CONFIG)["NETWORK"];
    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
    });
    afterEach(() => {
      CONFIG.NETWORK = previousNetwork;
    });

    it("blocks swamp->spooky before the unlock date on mainnet", () => {
      CONFIG.NETWORK = "mainnet";

      expect(() =>
        upgrade({
          farmId,
          action: { type: "farm.upgraded" },
          state: swampState,
          createdAt: SPOOKY_ASCENSION_START - 1,
        }),
      ).toThrow("Ascension to the next island is not yet available");
    });

    it("allows swamp->spooky once the unlock date passes on mainnet", () => {
      CONFIG.NETWORK = "mainnet";

      expect(() =>
        upgrade({
          farmId,
          action: { type: "farm.upgraded" },
          state: swampState,
          createdAt: SPOOKY_ASCENSION_START,
        }),
      ).toThrow("Insufficient Crimstone");
    });

    it("lets testnet bypass the lock before the unlock date", () => {
      CONFIG.NETWORK = "amoy";

      expect(() =>
        upgrade({
          farmId,
          action: { type: "farm.upgraded" },
          state: swampState,
          createdAt: SPOOKY_ASCENSION_START - 1,
        }),
      ).toThrow("Insufficient Crimstone");
    });
  });

  it("preserves crop growth timers across the first ascension (no instant growth)", () => {
    const createdAt = Date.now();
    const plantedAt = createdAt - 60 * 1000;
    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        coins: 10000,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
        },
        island: { type: "volcano" },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
        },
        crops: {
          "99": {
            createdAt,
            x: 4,
            y: 4,
            crop: { id: "99", name: "Sunflower", plantedAt },
          },
        } as GameState["crops"],
      },
      createdAt,
    });

    // The same plot instance survives untouched — its planted crop keeps its timer.
    expect(state.crops["99"]).toMatchObject({ x: 4, y: 4 });
    expect(state.crops["99"]?.crop?.plantedAt).toEqual(plantedAt);
  });

  it("reuses the saved Ascension Layout on later ascensions", () => {
    const createdAt = SPOOKY_ASCENSION_START;
    const readyXp = ascensionBaseline(1) + bandXp(1);
    const emptyLayoutResources: SavedLayout["resources"] = {
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
      flowerBeds: {},
      lavaPits: {},
    };
    // The layout captured at volcano->swamp places the statue at { x: 7, y: 7 }.
    const autoLayout: SavedLayout = {
      name: "Ascension Layout",
      auto: true,
      createdAt,
      updatedAt: createdAt,
      collectibles: {
        "Sunflower Statue": [{ id: "1", coordinates: { x: 7, y: 7 } }],
      },
      buildings: {},
      resources: emptyLayoutResources,
    };

    const state = upgrade({
      farmId,
      action: { type: "farm.upgraded" },
      state: {
        ...INITIAL_FARM,
        // Team username so SWAMP_ASCENSION passes on mainnet.
        username: "elias",
        coins: 100000,
        bumpkin: { ...INITIAL_FARM.bumpkin, experience: readyXp },
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(42),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(10),
          "Sunflower Statue": new Decimal(1),
        },
        // Current arrangement differs from the saved layout — the statue is elsewhere.
        collectibles: {
          "Sunflower Statue": [
            {
              id: "1",
              coordinates: { x: 1, y: 1 },
              createdAt,
              readyAt: createdAt,
            },
          ],
        },
        layouts: [autoLayout],
      },
      createdAt,
    });

    expect(state.island.type).toEqual("spooky");
    expect(state.island.ascensionLevel).toEqual(2);
    // Reset to the saved layout: the statue moved back to { x: 7, y: 7 }.
    expect(state.collectibles["Sunflower Statue"]?.[0].coordinates).toEqual({
      x: 7,
      y: 7,
    });
    // A reward chest is dropped for this ascension too.
    expect(
      state.airdrops?.some(
        (airdrop) => airdrop.id === "missing-resources-ascension-2",
      ),
    ).toBe(true);
  });

  it("scales the ascension upgrade cost with level", () => {
    // a = 1 -> base
    expect(getAscensionUpgradeCost(1)).toEqual({
      items: {
        Crimstone: new Decimal(30),
        Oil: new Decimal(50),
        Obsidian: new Decimal(3),
      },
      coins: 5000,
    });
    // a = 2 -> floor(base x 1.4)
    expect(getAscensionUpgradeCost(2)).toEqual({
      items: {
        Crimstone: new Decimal(42),
        Oil: new Decimal(70),
        Obsidian: new Decimal(4),
      },
      coins: 7000,
    });
    // a = 3 -> floor(base x 1.96)
    expect(getAscensionUpgradeCost(3)).toEqual({
      items: {
        Crimstone: new Decimal(58),
        Oil: new Decimal(98),
        Obsidian: new Decimal(5),
      },
      coins: 9800,
    });
  });

  it("sets island history", () => {
    const createdAt = Date.now();
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
        },
      },
      createdAt,
    });

    expect(state.island.upgradedAt).toEqual(createdAt);
    expect(state.island.previousExpansions).toEqual(16);
  });

  it("does not give extra sunstones", () => {
    const createdAt = Date.now();

    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Crimstone: new Decimal(20),
        },
        island: {
          type: "spring",
        },
      },
      createdAt,
    });

    expect(state.inventory["Sunstone Rock"]).toBeUndefined();
  });

  it("saves how many sunstones you were given", () => {
    const createdAt = Date.now();
    const sunstones = {
      "1234": {
        minesLeft: 1,
        stone: {
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Crimstone: new Decimal(20),
          Sunstone: new Decimal(1),
        },
        island: {
          type: "spring",
          previousExpansions: 16,
          upgradedAt: 0,
        },
        sunstones,
      },
      createdAt,
    });

    expect(state.island.sunstones).toEqual(
      TOTAL_EXPANSION_NODES["spring"][16]["Sunstone Rock"],
    );
  });

  it("does not overwrite how many sunstones you were given", () => {
    const createdAt = Date.now();
    const sunstones = {
      "1234": {
        minesLeft: 1,
        stone: {
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Crimstone: new Decimal(20),
          Sunstone: new Decimal(1),
        },
        island: {
          type: "spring",
          previousExpansions: 16,
          upgradedAt: 0,
          sunstones: 100,
        },
        sunstones,
      },
      createdAt,
    });

    expect(state.island.sunstones).toEqual(100);
  });

  it("clamps the sunstone carry to the cap row for legacy farms above the cap", () => {
    const createdAt = Date.now();
    const sunstones = {
      "1234": {
        minesLeft: 1,
        stone: {
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(17),
          Crimstone: new Decimal(20),
          Sunstone: new Decimal(1),
        },
        island: {
          type: "spring",
          previousExpansions: 17,
          upgradedAt: 0,
        },
        sunstones,
      },
      createdAt,
    });

    // Spring rows 17-20 were retired; the carry must clamp to the cap row
    // (spring[16] = 2 sunstones), not silently fall back to 0.
    expect(state.island.sunstones).toEqual(
      TOTAL_EXPANSION_NODES["spring"][16]["Sunstone Rock"],
    );
  });

  it("allows a player to upgrade from desert island", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          "Basic Land": new Decimal(25),
          Oil: new Decimal(1000000000000),
        },
      },
    });

    expect(state.inventory.Mansion).toEqual(new Decimal(1));
    expect(state.inventory.Manor).toBeUndefined();
    expect(state.island.type).toEqual("volcano");
  });

  it("does not remove buds from home on upgrade", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
        },
        island: {
          type: "desert",
        },
        buds: {
          "1": {
            type: "Beach",
            colour: "Beige",
            stem: "3 Leaf Clover",
            aura: "Basic",
            ears: "Ears",
            location: "home",
            coordinates: { x: 0, y: 0 },
          },
        },
      },
    });

    expect(state.buds).toEqual({
      "1": {
        type: "Beach",
        colour: "Beige",
        stem: "3 Leaf Clover",
        aura: "Basic",
        ears: "Ears",
        location: "home",
        coordinates: { x: 0, y: 0 },
      },
    });
  });

  it("removes buds from farm on upgrade", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
        },
        island: {
          type: "desert",
        },
        buds: {
          "1": {
            type: "Beach",
            colour: "Beige",
            stem: "3 Leaf Clover",
            aura: "Basic",
            ears: "Ears",
            location: "farm",
            coordinates: { x: 0, y: 0 },
          },
        },
      },
    });

    expect(state.buds).toEqual({
      "1": {
        type: "Beach",
        colour: "Beige",
        stem: "3 Leaf Clover",
        aura: "Basic",
        ears: "Ears",
        coordinates: undefined,
        location: undefined,
      },
    });
  });
  it("resets the biome upon upgrade", () => {
    const state = upgrade({
      farmId,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
        },
        island: {
          type: "desert",
          biome: "Spring Biome",
        },
      },
      action: {
        type: "farm.upgraded",
      },
    });

    expect(state.island.biome).toBeUndefined();
  });

  it("Does not remove temporary collectibles on upgrade", () => {
    const now = Date.now();

    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
          "Fire Pit": new Decimal(1),
          "Crop Plot": new Decimal(31),
          Tree: new Decimal(9),
          "Stone Rock": new Decimal(7),
          "Iron Rock": new Decimal(4),
          "Gold Rock": new Decimal(2),
          "Super Totem": new Decimal(2),
        },
        collectibles: {
          "Super Totem": [
            {
              id: "1",
              readyAt: now,
              createdAt: now,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.collectibles["Super Totem"]).toEqual([
      {
        id: "1",
        readyAt: now,
        createdAt: now,
        coordinates: { x: 0, y: 0 },
      },
    ]);
    expect(state.inventory["Super Totem"]).toEqual(new Decimal(2));
  });

  it("preserves upgraded trees when upgrading from desert to volcano", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          Tree: new Decimal(11),
          "Ancient Tree": new Decimal(3),
        },
        farmActivity: {
          "Ancient Tree Upgrade": 3,
        },
      },
    });

    expect(state.island.type).toEqual("volcano");
    expect(state.inventory.Tree).toEqual(new Decimal(11));
    expect(state.inventory["Ancient Tree"]).toEqual(new Decimal(3));
    expect(state.farmActivity["Ancient Tree Upgrade"]).toEqual(3);
  });

  it("counts upgraded trees correctly when expanding after desert to volcano upgrade", () => {
    const upgradedState = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          Tree: new Decimal(11),
          "Ancient Tree": new Decimal(3),
        },
        farmActivity: {
          "Ancient Tree Upgrade": 3,
        },
      },
    });

    const land = getLand({
      game: {
        ...upgradedState,
        inventory: {
          ...upgradedState.inventory,
          "Basic Land": new Decimal(5),
        },
      },
    });

    expect(land).toBeDefined();
    expect(land?.trees.length).toBe(0);
  });

  it("counts sacred trees correctly when expanding after desert to volcano upgrade", () => {
    const upgradedState = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          Tree: new Decimal(7),
          "Sacred Tree": new Decimal(1),
        },
        farmActivity: {
          "Ancient Tree Upgrade": 4,
          "Sacred Tree Upgrade": 1,
        },
      },
    });

    expect(upgradedState.inventory.Tree).toEqual(new Decimal(7));
    expect(upgradedState.inventory["Sacred Tree"]).toEqual(new Decimal(1));

    const land = getLand({
      game: {
        ...upgradedState,
        inventory: {
          ...upgradedState.inventory,
          "Basic Land": new Decimal(5),
        },
      },
    });

    expect(land).toBeDefined();
    expect(land?.trees.length).toBe(0);
  });

  it("preserves upgraded stones when upgrading from desert to volcano", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Stone Rock": new Decimal(16),
          "Fused Stone Rock": new Decimal(1),
        },
        farmActivity: {
          "Fused Stone Rock Upgrade": 1,
        },
      },
    });

    expect(state.island.type).toEqual("volcano");
    expect(state.inventory["Stone Rock"]).toEqual(new Decimal(16));
    expect(state.inventory["Fused Stone Rock"]).toEqual(new Decimal(1));
    expect(state.farmActivity["Fused Stone Rock Upgrade"]).toEqual(1);
  });

  it("counts upgraded stones correctly when expanding after desert to volcano upgrade", () => {
    const upgradedState = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Stone Rock": new Decimal(16),
          "Fused Stone Rock": new Decimal(1),
        },
        farmActivity: {
          "Fused Stone Rock Upgrade": 1,
        },
      },
    });

    const land = getLand({
      game: {
        ...upgradedState,
        inventory: {
          ...upgradedState.inventory,
          "Basic Land": new Decimal(5),
        },
      },
    });

    expect(land).toBeDefined();
    expect(land?.stones.length).toBe(0);
  });

  it("preserves upgraded iron when upgrading from desert to volcano", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Iron Rock": new Decimal(8),
          "Refined Iron Rock": new Decimal(1),
        },
        farmActivity: {
          "Refined Iron Rock Upgrade": 1,
        },
      },
    });

    expect(state.island.type).toEqual("volcano");
    expect(state.inventory["Iron Rock"]).toEqual(new Decimal(8));
    expect(state.inventory["Refined Iron Rock"]).toEqual(new Decimal(1));
    expect(state.farmActivity["Refined Iron Rock Upgrade"]).toEqual(1);
  });

  it("counts upgraded iron correctly when expanding after desert to volcano upgrade", () => {
    const upgradedState = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Iron Rock": new Decimal(8),
          "Refined Iron Rock": new Decimal(1),
        },
        farmActivity: {
          "Refined Iron Rock Upgrade": 1,
        },
      },
    });

    const land = getLand({
      game: {
        ...upgradedState,
        inventory: {
          ...upgradedState.inventory,
          "Basic Land": new Decimal(5),
        },
      },
    });

    expect(land).toBeDefined();
    expect(land?.iron?.length ?? 0).toBe(0);
  });

  it("preserves upgraded gold when upgrading from desert to volcano", () => {
    const state = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Gold Rock": new Decimal(3),
          "Pure Gold Rock": new Decimal(1),
        },
        farmActivity: {
          "Pure Gold Rock Upgrade": 1,
        },
      },
    });

    expect(state.island.type).toEqual("volcano");
    expect(state.inventory["Gold Rock"]).toEqual(new Decimal(3));
    expect(state.inventory["Pure Gold Rock"]).toEqual(new Decimal(1));
    expect(state.farmActivity["Pure Gold Rock Upgrade"]).toEqual(1);
  });

  it("counts upgraded gold correctly when expanding after desert to volcano upgrade", () => {
    const upgradedState = upgrade({
      farmId,
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Basic Land": new Decimal(25),
          Oil: new Decimal(200),
          "Gold Rock": new Decimal(3),
          "Pure Gold Rock": new Decimal(1),
        },
        farmActivity: {
          "Pure Gold Rock Upgrade": 1,
        },
      },
    });

    const land = getLand({
      game: {
        ...upgradedState,
        inventory: {
          ...upgradedState.inventory,
          "Basic Land": new Decimal(5),
        },
      },
    });

    expect(land).toBeDefined();
    expect(land?.gold?.length ?? 0).toBe(0);
  });
});
