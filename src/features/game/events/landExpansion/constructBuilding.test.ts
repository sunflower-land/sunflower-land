import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { BUILDINGS } from "features/game/types/buildings";
import { INITIAL_FARM, TEST_FARM } from "../../lib/constants";
import type { GameState } from "../../types/game";
import {
  constructBuilding,
  CONSTRUCT_BUILDING_ERRORS,
} from "./constructBuilding";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { getBoostedAnimalCapacity } from "./buyAnimal";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(5),
  },
};

const date = Date.now();

describe("Construct building", () => {
  const dateNow = Date.now();

  it("ensures level requirements for Kitchen are met", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: { ...TEST_BUMPKIN, experience: 0 },
          inventory: {
            ...GAME_STATE.inventory,
            "Basic Land": new Decimal(2),
          },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Kitchen",
          coordinates: {
            x: 2,
            y: 2,
          },
        },
        createdAt: dateNow,
      }),
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.BUMPKIN_LEVEL_NOT_MET);
  });

  it("does not craft Water Well if there is insufficient ingredients", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          coins: 1000,
          bumpkin: {
            ...TEST_BUMPKIN,
            experience: LEVEL_EXPERIENCE[5],
          },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Water Well",
          coordinates: {
            x: 2,
            y: 1,
          },
        },
        createdAt: dateNow,
      }),
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("does not craft Fire Pit when bumpkin level does not satisfy unlock (Infinity)", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          inventory: {
            Wood: new Decimal(100),
            Stone: new Decimal(100),
            "Basic Land": new Decimal(5),
          },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Fire Pit",
          coordinates: {
            x: 2,
            y: 2,
          },
        },
        createdAt: dateNow,
      }),
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.BUMPKIN_LEVEL_NOT_MET);
  });

  it("does not craft item with insufficient coins", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          trees: {},
          stones: {},
          inventory: {
            Wood: new Decimal(100),
            Stone: new Decimal(100),
            "Basic Land": new Decimal(6),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: 20000000 },
          coins: 0,
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Kitchen",
          coordinates: {
            x: 2,
            y: 1,
          },
        },
        createdAt: dateNow,
      }),
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_COINS);
  });

  it("crafts item with sufficient coins", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          trees: {},
          stones: {},
          inventory: {
            Wood: new Decimal(100),
            Stone: new Decimal(100),
            "Basic Land": new Decimal(5),
          },
          bumpkin: {
            ...TEST_BUMPKIN,
            experience: 10000000,
          },
          coins: 100,
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Kitchen",
          coordinates: {
            x: 2,
            y: 1,
          },
        },
        createdAt: dateNow,
      }),
    ).not.toThrow();
  });

  it("constructs into the chest when no coordinates are given", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        trees: {},
        stones: {},
        inventory: {
          Wood: new Decimal(100),
          Stone: new Decimal(100),
          "Basic Land": new Decimal(5),
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000000,
        },
        coins: 100,
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Kitchen",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Kitchen).toEqual(new Decimal(1));
    expect(state.buildings.Kitchen).toEqual([
      expect.objectContaining({ id: "123", createdAt: dateNow }),
    ]);
    expect(state.buildings.Kitchen![0].coordinates).toBeUndefined();
  });

  it("adds the building to the inventory", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        trees: {},
        stones: {},
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000000,
        },
        coins: 1000,
        inventory: {
          Wood: new Decimal(30),
          Stone: new Decimal(100),
          "Basic Land": new Decimal(5),
        },
      },
      action: {
        type: "building.constructed",
        name: "Kitchen",
        id: "123",
        coordinates: {
          x: 2,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Kitchen"]).toEqual(new Decimal(1));
  });

  it("does not affect existing inventory", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000000,
        },
        buildings: {},
        trees: {},
        stones: {},
        coins: 1000,
        inventory: {
          Wood: new Decimal(100),
          Stone: new Decimal(100),
          Radish: new Decimal(50),
          "Basic Land": new Decimal(5),
        },
      },
      action: {
        type: "building.constructed",
        name: "Kitchen",
        id: "123",
        coordinates: {
          x: 2,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Kitchen"]).toEqual(new Decimal(1));
    expect(state.inventory["Radish"]).toEqual(new Decimal(50));
  });

  it("adds the building to the buildings data structure", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000000,
        },
        buildings: {},
        coins: 1000,
        inventory: {
          Wood: new Decimal(30),
          Stone: new Decimal(100),
          "Basic Land": new Decimal(5),
        },
      },
      action: {
        type: "building.constructed",
        name: "Kitchen",
        id: "123",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: date,
    });

    expect(state.buildings["Kitchen"]).toHaveLength(1);
    expect(state.buildings["Kitchen"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 1 },
      readyAt: expect.any(Number),
      createdAt: date,
    });
  });

  it("burns coins on construct building", () => {
    const building = BUILDINGS.Kitchen;
    const coins = 10000;

    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        coins,
        inventory: {
          Wood: new Decimal(30),
          Stone: new Decimal(100),
          "Basic Land": new Decimal(5),
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          experience: 10000000,
        },
      },
      action: {
        type: "building.constructed",
        id: "123",
        name: "Kitchen",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: dateNow,
    });
    expect(state.coins).toEqual(coins - building.coins);
  });

  it("burns ingredients on construct building", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        coins: 1000,
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(15),
          "Basic Land": new Decimal(5),
        },
        bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[5] },
      },
      action: {
        type: "building.constructed",
        id: "123",
        name: "Water Well",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Wood"]).toEqual(new Decimal(15));
    expect(state.inventory["Stone"]).toEqual(new Decimal(15));
  });

  it("does not construct when the building is already placed", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Wood: new Decimal(20),
            Stone: new Decimal(15),
            "Basic Land": new Decimal(5),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[8] },
          buildings: {
            ...GAME_STATE.buildings,
            "Water Well": [
              {
                coordinates: { x: 3, y: 3 },
                createdAt: Date.now(),
                readyAt: Date.now(),
                id: "existing-well",
              },
            ],
          },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Water Well",
          coordinates: {
            x: 1,
            y: 1,
          },
        },
        createdAt: 0,
      }),
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.BUILDING_ALREADY_BUILT);
  });

  it("does not affect other buildings when constructing a Water Well", () => {
    const buildings = {
      Workbench: [
        {
          coordinates: { x: 4, y: 2 },
          createdAt: date,
          readyAt: date + 5 * 60 * 1000,
          id: "2",
        },
      ],
    };

    const createdAt = Date.now();

    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        trees: {},
        stones: {},
        coins: 1000,
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(15),
          "Basic Land": new Decimal(5),
        },
        bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[8] },
        buildings,
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 2,
          y: 1,
        },
      },
      createdAt,
    });

    expect(state.buildings["Water Well"]).toHaveLength(1);
    expect(state.buildings["Water Well"]?.[0]).toMatchObject({
      id: "123",
      coordinates: { x: 2, y: 1 },
      createdAt,
    });
    expect(state.buildings.Workbench).toEqual(buildings.Workbench);
  });

  describe("BumpkinActivity", () => {
    it("Increments 1 to Kitchen Constructed", () => {
      const state = constructBuilding({
        state: {
          ...GAME_STATE,
          coins: 1000,
          buildings: {},
          inventory: {
            Wood: new Decimal(30),
            Stone: new Decimal(15),
            "Basic Land": new Decimal(5),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: 100000 },
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Kitchen",
          coordinates: {
            x: 1,
            y: 1,
          },
        },
        createdAt: date,
      });
      expect(state.farmActivity["Building Constructed"]).toEqual(1);
    });
  });

  it("requires desert island to build the crop machine", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          coins: 8000,
          inventory: {
            Wood: new Decimal(1250),
            Iron: new Decimal(125),
            Crimstone: new Decimal(50),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Crop Machine",
          coordinates: {
            x: 1,
            y: 1,
          },
        },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have the required island expansion");

    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          trees: {},
          stones: {},
          coins: 8000,
          inventory: {
            Wood: new Decimal(1250),
            Iron: new Decimal(125),
            Crimstone: new Decimal(50),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
          island: {
            type: "desert",
          },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name: "Crop Machine",
          coordinates: {
            x: 1,
            y: 1,
          },
        },
        createdAt: dateNow,
      }),
    ).not.toThrow();
  });

  it("constructs a barn", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        coins: 8000,
        inventory: {
          Wood: new Decimal(151),
          Iron: new Decimal(11),
          Gold: new Decimal(11),
          "Basic Land": new Decimal(5),
        },
        bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        island: {
          type: "desert",
        },
      },
      action: {
        type: "building.constructed",
        id: "123",
        name: "Barn",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Barn"]).toHaveLength(1);
    expect(state.inventory.Wood).toEqual(new Decimal(1));
    expect(state.inventory.Iron).toEqual(new Decimal(1));
    expect(state.inventory.Gold).toEqual(new Decimal(1));
  });

  it.each(["Barn", "Hen House"] as const)(
    "seeds a new account's %s with its starter herd on construction",
    (name) => {
      const buildingKey = makeAnimalBuildingKey(name);

      // A new account ships with empty animal buildings; the herd arrives when
      // the player builds the building.
      expect(INITIAL_FARM[buildingKey].animals).toEqual({});

      const state = constructBuilding({
        state: {
          ...INITIAL_FARM,
          buildings: {},
          coins: 8000,
          inventory: {
            Wood: new Decimal(1000),
            Iron: new Decimal(100),
            Gold: new Decimal(100),
            "Basic Land": new Decimal(5),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name,
          coordinates: { x: 1, y: 1 },
        },
        createdAt: dateNow,
      });

      const animals = Object.values(state[buildingKey].animals);

      expect(animals).toHaveLength(3);
      expect(animals.every((animal) => animal.createdAt === dateNow)).toBe(
        true,
      );
    },
  );

  it.each(["Barn", "Hen House"] as const)(
    "does not re-seed a %s that already has its starter herd",
    (name) => {
      // Hen House and Barn are seeded by INITIAL_FARM at account creation, so
      // an existing player's herd is already in state before the building is
      // ever built. The empty-record guard must leave it alone - otherwise
      // constructing the building would hand them a second herd.
      const buildingKey = makeAnimalBuildingKey(name);
      const before = GAME_STATE[buildingKey].animals;

      expect(Object.keys(before)).toHaveLength(3);

      const state = constructBuilding({
        state: {
          ...GAME_STATE,
          buildings: {},
          coins: 8000,
          inventory: {
            Wood: new Decimal(1000),
            Iron: new Decimal(100),
            Gold: new Decimal(100),
            "Basic Land": new Decimal(5),
          },
          bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        },
        action: {
          type: "building.constructed",
          id: "123",
          name,
          coordinates: { x: 1, y: 1 },
        },
        createdAt: dateNow,
      });

      expect(state[buildingKey].animals).toEqual(before);
    },
  );

  it("gives the player 5 Kernel Blend when a barn is constructed", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        coins: 8000,
        inventory: {
          Wood: new Decimal(151),
          Iron: new Decimal(11),
          Gold: new Decimal(11),
          "Basic Land": new Decimal(5),
        },
        bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        island: {
          type: "desert",
        },
      },
      action: {
        type: "building.constructed",
        id: "123",
        name: "Barn",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(5));
  });

  it("gives the player 5 Kernel Blend when a hen house is constructed", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        coins: 8000,
        inventory: {
          Wood: new Decimal(151),
          Iron: new Decimal(11),
          Gold: new Decimal(11),
          "Basic Land": new Decimal(5),
        },
        bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        island: {
          type: "desert",
        },
      },
      action: {
        type: "building.constructed",
        id: "123",
        name: "Hen House",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(5));
  });

  it("tracks the bumpkin activity", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        buildings: {},
        coins: 8000,
        inventory: {
          Wood: new Decimal(151),
          Iron: new Decimal(11),
          Gold: new Decimal(11),
          "Basic Land": new Decimal(5),
        },
        bumpkin: { ...TEST_BUMPKIN, experience: LEVEL_EXPERIENCE[64] },
        island: {
          type: "desert",
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Barn",
        coordinates: {
          x: 1,
          y: 1,
        },
      },
      createdAt: dateNow,
    });

    expect(state.farmActivity["Coins Spent"]).toBe(200);
  });
});

describe("constructBuilding: Pigpen gating", () => {
  const dateNow = Date.now();

  const farm: GameState = {
    ...GAME_STATE,
    bumpkin: { ...TEST_BUMPKIN, experience: 1_000_000 },
    coins: 100_000,
    island: { ...GAME_STATE.island, type: "spring" },
    inventory: {
      ...GAME_STATE.inventory,
      Wood: new Decimal(1000),
      Iron: new Decimal(100),
      Gold: new Decimal(100),
      Mud: new Decimal(100),
    },
  };

  const build = (state: GameState) =>
    constructBuilding({
      state,
      action: {
        type: "building.constructed",
        name: "Pigpen",
        id: "1",
        coordinates: { x: 0, y: 0 },
      },
      createdAt: dateNow,
    });

  // The Pigpen is testnet-only, and jest runs on amoy, so the flag is on for
  // every test below without any inventory item granting it.
  it("builds a Pigpen on testnet", () => {
    expect(build(farm).buildings.Pigpen).toHaveLength(1);
  });

  it("requires Spring Island", () => {
    // The spec houses Pigs on Spring Island, so the Pigpen cannot be raised on
    // the starting island even by a player who is otherwise eligible.
    expect(() =>
      build({ ...farm, island: { ...farm.island, type: "basic" } }),
    ).toThrow("You do not have the required island expansion");
  });

  it("requires Mud to construct", () => {
    expect(() =>
      build({
        ...farm,
        inventory: { ...farm.inventory, Mud: new Decimal(0) },
      }),
    ).toThrow("Insufficient ingredient: Mud");
  });

  it("seeds the empty pigpen with one Pig on construction", () => {
    // game.pigpen ships EMPTY so no existing farm is handed free Pigs when the
    // field lands; the starter herd arrives when the player actually builds it.
    expect(farm.pigpen.animals).toEqual({});

    const pigs = Object.values(build(farm).pigpen.animals);

    expect(pigs).toHaveLength(1);
    expect(pigs.every((pig) => pig.type === "Pig")).toBe(true);
    expect(pigs.every((pig) => pig.createdAt === dateNow)).toBe(true);
  });

  it("leaves room to buy Pigs in a level-1 Pigpen", () => {
    // The invariant the herd size exists to satisfy: a Pigpen holds 3 at level
    // 1, so a 3-Pig starter herd would fill it on construction and make every
    // Pig purchase throw. Asserted against the capacity rather than a literal
    // so it still holds if either number is retuned.
    const state = build(farm);
    const { capacity } = getBoostedAnimalCapacity("pigpen", state);

    expect(Object.keys(state.pigpen.animals).length).toBeLessThan(capacity);
  });

  it("does not disturb an existing herd when the building is constructed", () => {
    // The seed is guarded on an empty record, so a herd can never be wiped or
    // duplicated by a (re)construction.
    const existing = { ...farm.pigpen.animals };
    const state = build({
      ...farm,
      pigpen: {
        level: 1,
        animals: {
          "9": {
            id: "9",
            type: "Pig",
            state: "idle",
            createdAt: 1,
            experience: 500,
            asleepAt: 0,
            awakeAt: 0,
            lovedAt: 0,
            item: "Petting Hand",
          },
        },
      },
    });

    expect(existing).toEqual({});
    expect(Object.keys(state.pigpen.animals)).toEqual(["9"]);
    expect(state.pigpen.animals["9"].experience).toEqual(500);
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    const originalNetwork = CONFIG.NETWORK;

    beforeEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    it("throws without the PIGPEN feature flag", () => {
      expect(() => build(farm)).toThrow(
        CONSTRUCT_BUILDING_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is not unlocked by a Beta Pass", () => {
      // PIGPEN is a testnet flag, which has no Beta Pass escape hatch - unlike
      // betaFeatureFlag, which this gate used to use.
      expect(() =>
        build({
          ...farm,
          inventory: { ...farm.inventory, "Beta Pass": new Decimal(1) },
        }),
      ).toThrow(CONSTRUCT_BUILDING_ERRORS.NO_FEATURE_ACCESS);
    });
  });
});
