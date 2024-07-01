import { TEST_FARM } from "features/game/lib/constants";
import { upgrade } from "./upgradeFarm";
import Decimal from "decimal.js-light";
import { TOTAL_EXPANSION_NODES } from "features/game/expansion/lib/expansionNodes";

describe("upgradeFarm", () => {
  it("requires a player has met the expansions", () => {
    expect(() =>
      upgrade({
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
    const createdAt = Date.now();
    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
        fishing: {
          wharf: {
            castedAt: 10001023,
            caught: { Anchovy: 1 },
          },
          beach: {},
          weather: "Sunny",
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
              amount: 1,
              drilledAt: 1,
            },
            createdAt: 1,
            drilled: 1,
            height: 1,
            width: 1,
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
              createdAt: Date.now(),
              x: -2,
              y: 0,
              height: 1,
              width: 3,
              flower: {
                name: "Red Pansy",
                amount: 1,
                plantedAt: 123,
              },
            },
          },
        },
        beehives: {
          "1234": {
            flowers: [],
            height: 1,
            width: 1,
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
            height: 1,
            minesLeft: 1,
            stone: {
              amount: 1,
              minedAt: Date.now() - 1 * 60 * 60 * 1000,
            },
            width: 1,
            x: 100,
            y: 100,
          },
        },
      },
      createdAt,
    });

    expect(state.collectibles).toEqual({});

    expect(Object.keys(state.buildings)).not.toContain("Hen House");
    expect(state.chickens).toEqual({});
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
    expect(state.flowers.flowerBeds).toEqual({});
    expect(state.beehives).toEqual({});
    expect(state.oilReserves).toEqual({});
    expect(state.crimstones).toEqual({});
  });

  it("does not reset flower codex", () => {
    const createdAt = Date.now();
    const state = upgrade({
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
              height: 1,
              width: 3,
              flower: {
                name: "Red Pansy",
                amount: 1,
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

    expect(state.inventory.House).toEqual(new Decimal(1));
    expect(state.inventory["Fruit Patch"]).toEqual(new Decimal(2));
    expect(state.inventory["Town Center"]).toBeUndefined();

    expect(Object.keys(state.buildings)).toEqual([
      "House",
      "Workbench",
      "Market",
      "Fire Pit",
    ]);
  });

  it("sets island history", () => {
    const createdAt = Date.now();
    const state = upgrade({
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

  it("does not allow a player to upgrade from desert island", () => {
    expect(() =>
      upgrade({
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...TEST_FARM,
          island: {
            type: "desert",
          },
          inventory: {
            "Basic Land": new Decimal(16),
            Gold: new Decimal(1000000000000),
          },
        },
      }),
    ).toThrow("Not implemented");
  });

  it("removes items which have expired on the land", () => {
    const createdAt = Date.now();

    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
          "Time Warp Totem": new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              readyAt: Date.now() - 48 * 60 * 60 * 1000,
              createdAt: Date.now() - 48 * 60 * 60 * 1000,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
      createdAt,
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(0));
  });

  it("it does not remove items that have not yet expired", () => {
    const createdAt = Date.now();

    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
          "Time Warp Totem": new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              // Still active
              readyAt: Date.now() - 1 * 60 * 60 * 1000,
              createdAt: Date.now() - 1 * 60 * 60 * 1000,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
      createdAt,
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(1));
  });

  it("does not remove sunstones", () => {
    const createdAt = Date.now();
    const sunstones = {
      "1234": {
        height: 1,
        minesLeft: 1,
        stone: {
          amount: 1,
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        width: 1,
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
          Sunstone: new Decimal(1),
        },
        sunstones,
      },
      createdAt,
    });

    expect(state.inventory["Sunstone"]).toEqual(new Decimal(1));
    expect(state.sunstones).toEqual({
      ...sunstones,
      "1234": { ...sunstones["1234"], x: -3, y: 7 },
    });
  });

  it("does not give extra sunstones", () => {
    const createdAt = Date.now();

    const state = upgrade({
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

  it("moves the sunstones to a central location", () => {
    const createdAt = Date.now();
    const sunstones = {
      "1234": {
        height: 1,
        minesLeft: 1,
        stone: {
          amount: 1,
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        width: 1,
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
          Sunstone: new Decimal(1),
        },
        sunstones,
      },
      createdAt,
    });

    expect(state.inventory["Sunstone"]).toEqual(new Decimal(1));
    expect(state.sunstones).toEqual({
      "1234": { ...sunstones["1234"], x: -3, y: 7 },
    });
  });

  it("saves how many sunstones you were given", () => {
    const createdAt = Date.now();
    const sunstones = {
      "1234": {
        height: 1,
        minesLeft: 1,
        stone: {
          amount: 1,
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        width: 1,
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
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
        height: 1,
        minesLeft: 1,
        stone: {
          amount: 1,
          minedAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        width: 1,
        x: 100,
        y: 100,
      },
    };

    const state = upgrade({
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
});
