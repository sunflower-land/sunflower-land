import Decimal from "decimal.js-light";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { BUILDINGS } from "features/game/types/buildings";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  constructBuilding,
  CONSTRUCT_BUILDING_ERRORS,
} from "./constructBuilding";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";

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
