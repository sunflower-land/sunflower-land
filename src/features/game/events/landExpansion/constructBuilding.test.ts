import Decimal from "decimal.js-light";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { BUILDINGS, Ingredient } from "features/game/types/buildings";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  constructBuilding,
  CONSTRUCT_BUILDING_ERRORS,
} from "./constructBuilding";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: {},
  buildings: {},
};

const dateNow = Date.now();

describe("Construct building", () => {
  it("does not construct without bumpkin", () => {
    expect(() =>
      constructBuilding({
        state: { ...GAME_STATE, bumpkin: undefined },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 2,
            y: 2,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.NO_BUMPKIN);
  });

  it("does not construct if build level is not reached", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[1],
          },
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  });

  it("does not construct if max building limit is reached", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[20],
          },
          inventory: {
            "Water Well": new Decimal(4),
            "Basic Land": new Decimal(20),
          },
          buildings: {
            "Water Well": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "1",
              },
              {
                coordinates: { x: 3, y: 3 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "2",
              },
              {
                coordinates: { x: 1, y: 3 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "3",
              },
              {
                coordinates: { x: 3, y: 1 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "4",
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  });

  it("does not construct if max building limit is reached in inventory", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[20],
          },
          inventory: {
            "Water Well": new Decimal(4),
            "Basic Land": new Decimal(20),
          },
          buildings: {},
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  });

  it("does not construct if not enough SFL", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[20],
          },
          inventory: {
            Wood: new Decimal(100),
            Stone: new Decimal(100),
            "Basic Land": new Decimal(10),
          },
          balance: new Decimal(0),
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_SFL);
  });

  it("does not construct if not enough ingredients", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[20],
          },
          inventory: {
            Wood: new Decimal(0.1),
            Stone: new Decimal(0.1),
            "Basic Land": new Decimal(10),
          },
          balance: new Decimal(100),
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(`${CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_INGREDIENTS}Wood, Stone`);
  });

  it("constructs building", () => {
    const waterWell = BUILDINGS()["Water Well"][0];
    const initialWood = new Decimal(100);
    const initialStone = new Decimal(101);
    const initialSFL = new Decimal(42);

    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[20],
        },
        inventory: {
          Wood: initialWood,
          Stone: initialStone,
          "Basic Land": new Decimal(10),
        },
        balance: initialSFL,
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.inventory["Water Well"]).toEqual(new Decimal(1));
    expect(state.buildings["Water Well"]?.length).toEqual(1);

    const { ingredients } = waterWell;

    const { amount: woodRequired } = ingredients.find(
      ({ item }) => item === "Wood"
    ) as Ingredient;

    const { amount: stoneRequired } = ingredients.find(
      ({ item }) => item === "Stone"
    ) as Ingredient;

    expect(state.inventory.Wood).toEqual(initialWood.minus(woodRequired));
    expect(state.inventory.Stone).toEqual(initialStone.minus(stoneRequired));
    expect(state.balance).toEqual(initialSFL.minus(waterWell.sfl));
  });

  it("does not affect existing inventory", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          Wood: new Decimal(100),
          Stone: new Decimal(100),
          Radish: new Decimal(50),
          "Basic Land": new Decimal(10),
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Fire Pit",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.inventory["Fire Pit"]).toEqual(new Decimal(1));
    expect(state.inventory["Radish"]).toEqual(new Decimal(50));
  });

  it("adds the building to the buildings data structure correctly", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        buildings: {},
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(100),
          "Basic Land": new Decimal(10),
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Fire Pit",
        coordinates: {
          x: 1,
          y: 2,
        },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Fire Pit"]).toHaveLength(1);
    expect(state.buildings["Fire Pit"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 2 },
      readyAt: dateNow,
      createdAt: dateNow,
    });
  });

  it("constructs multiple Water Wells", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[20],
        },
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(15),
          "Water Well": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Water Well": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: dateNow,
              readyAt: dateNow + 30 * 1000,
              id: "1",
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 1,
          y: 2,
        },
      },
      createdAt: 234567890,
    });
    expect(state.buildings["Water Well"]).toHaveLength(2);
  });

  it("does not affect existing buildings when constructing new Water Well", () => {
    const buildings = {
      "Water Well": [
        {
          coordinates: { x: 1, y: 1 },
          createdAt: dateNow,
          readyAt: dateNow + 30 * 1000,
          id: "1",
        },
      ],
      Workbench: [
        {
          coordinates: { x: 2, y: 2 },
          createdAt: dateNow,
          readyAt: dateNow + 5 * 60 * 1000,
          id: "2",
        },
      ],
    };

    const waterWell = BUILDINGS()["Water Well"][0];
    const createdAt = Date.now();

    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[20],
        },
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(15),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          ...buildings,
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 1,
          y: 2,
        },
      },
      createdAt,
    });

    expect(state.buildings).toEqual({
      "Water Well": [
        {
          coordinates: { x: 1, y: 1 },
          createdAt: dateNow,
          readyAt: dateNow + 30 * 1000,
          id: "1",
        },
        {
          id: "123",
          coordinates: {
            x: 1,
            y: 2,
          },
          createdAt,
          readyAt: createdAt + waterWell.constructionSeconds * 1000,
        },
      ],
      Workbench: [
        {
          coordinates: { x: 2, y: 2 },
          createdAt: dateNow,
          readyAt: dateNow + 5 * 60 * 1000,
          id: "2",
        },
      ],
    });
  });

  it("constructs second building using the correct requirements", () => {
    // Second Hen House
    const building = BUILDINGS()["Hen House"][1];
    const initialWood = new Decimal(200);
    const initialIron = new Decimal(20);
    const initialGold = new Decimal(20);
    const initialEggs = new Decimal(400);
    const initialSFL = new Decimal(1000);

    const state = {
      ...GAME_STATE,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[21],
      },
      buildings: {
        "Hen House": [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
          },
        ],
      },
      inventory: {
        Wood: initialWood,
        Iron: initialIron,
        Gold: initialGold,
        Egg: initialEggs,
        "Hen House": new Decimal(1),
        "Basic Land": new Decimal(20),
      },
      balance: initialSFL,
    };

    const newState = constructBuilding({
      state,
      action: {
        id: "123",
        type: "building.constructed",
        name: "Hen House",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
      createdAt: dateNow,
    });

    expect(newState.inventory["Hen House"]).toEqual(new Decimal(2));
    expect(newState.buildings["Hen House"]?.length).toEqual(2);

    const { ingredients } = building;

    const { amount: woodRequired } = ingredients.find(
      ({ item }) => item === "Wood"
    ) as Ingredient;

    const { amount: ironRequired } = ingredients.find(
      ({ item }) => item === "Iron"
    ) as Ingredient;

    const { amount: goldRequired } = ingredients.find(
      ({ item }) => item === "Gold"
    ) as Ingredient;

    const { amount: eggsRequired } = ingredients.find(
      ({ item }) => item === "Egg"
    ) as Ingredient;

    expect(newState.inventory.Wood).toEqual(initialWood.minus(woodRequired));
    expect(newState.inventory.Iron).toEqual(initialIron.minus(ironRequired));
    expect(newState.inventory.Gold).toEqual(initialGold.minus(goldRequired));
    expect(newState.inventory.Egg).toEqual(initialEggs.minus(eggsRequired));
    expect(newState.balance).toEqual(initialSFL.minus(building.sfl));
  });
});
