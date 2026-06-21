import { INITIAL_FARM, TEST_FARM } from "features/game/lib/constants";
import {
  upgrade,
  getAscensionUpgradeCost,
  ASCENSION_BUMPKIN_LEVEL,
} from "./upgradeFarm";
import Decimal from "decimal.js-light";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { getLand, TOTAL_EXPANSION_NODES } from "features/game/types/expansions";
import { getIslandSpawnPositions } from "features/game/expansion/lib/island";

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

  it("upgrades to swamp island", () => {
    const createdAt = Date.now();
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
          // No node pre-seed: swampUpgrade's arrival floor must cover the
          // INITIAL_SWAMP_LAND_COORDINATES placements for a realistic account.
        },
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

    // Keeps the Mansion as the home, laid out per the swamp layout
    expect(state.buildings.Manor).toBeUndefined();
    expect(state.inventory.Mansion).toEqual(new Decimal(1));
    expect(state.buildings.Mansion?.[0].coordinates).toEqual({ x: 0, y: 15 });

    // Lays out the swamp starting nodes, incl. the swamp-specific types
    expect(Object.keys(state.crops)).toHaveLength(65);
    expect(Object.keys(state.fruitPatches)).toHaveLength(15);
    expect(Object.keys(state.gold)).toHaveLength(8);
    expect(Object.keys(state.crimstones)).toHaveLength(5);
    expect(Object.keys(state.beehives)).toHaveLength(3);
    expect(Object.keys(state.flowers.flowerBeds)).toHaveLength(3);
    expect(Object.keys(state.lavaPits)).toHaveLength(3);
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
