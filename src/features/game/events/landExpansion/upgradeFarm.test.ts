import { INITIAL_FARM, TEST_FARM } from "features/game/lib/constants";
import { upgrade } from "./upgradeFarm";
import Decimal from "decimal.js-light";
import { TOTAL_EXPANSION_NODES } from "features/game/expansion/lib/expansionNodes";
import { getLand } from "features/game/types/expansions";

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

  it("resets collectibles, buildings, fishing, chickens, mushrooms, buds, flowers, beehives, oil, crimstone", () => {
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
    expect(state.mushrooms).toEqual({
      mushrooms: {},
      spawnedAt: 0,
    });
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

  it("does not allow a player to upgrade from volcano island", () => {
    expect(() =>
      upgrade({
        farmId,
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...INITIAL_FARM,
          island: {
            type: "volcano",
          },
          inventory: {
            "Basic Land": new Decimal(16),
            Oil: new Decimal(1000000000000),
          },
        },
      }),
    ).toThrow("Not implemented");
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
      id: farmId,
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
      id: farmId,
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
      id: farmId,
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
      id: farmId,
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
      id: farmId,
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
