import Decimal from "decimal.js-light";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { placeBuilding } from "./placeBuilding";
import { RECIPES } from "features/game/lib/crafting";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: {},
  buildings: {},
};

const dateNow = Date.now();

describe("Place building", () => {
  it("places a building", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[20],
        },
        inventory: {
          "Water Well": new Decimal(1),
        },
        buildings: {},
      },

      action: {
        id: "123",
        type: "building.placed",
        name: "Water Well",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.buildings["Water Well"]).toHaveLength(1);
  });

  it("places multiple buildings", () => {
    const state = {
      ...GAME_STATE,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[20],
      },
      inventory: {
        "Water Well": new Decimal(2),
      },
      buildings: {
        "Water Well": [
          {
            id: "123",
            coordinates: { x: 1, y: 1 },
            createdAt: dateNow,
            readyAt: dateNow,
          },
        ],
      },
    };

    const newState = placeBuilding({
      state,
      createdAt: dateNow,
      action: {
        id: "456",
        type: "building.placed",
        name: "Water Well",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(newState.buildings["Water Well"]).toHaveLength(2);
    expect(newState.buildings["Water Well"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 1 },
      readyAt: dateNow,
      createdAt: dateNow,
    });
    expect(newState.buildings["Water Well"]?.[1]).toEqual({
      id: expect.any(String),
      coordinates: { x: 0, y: 0 },
      readyAt: dateNow,
      createdAt: dateNow,
    });
  });

  it("adjusts the new readyAt for cooking buildings", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Fire Pit": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              crafting: [
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 10000,
                  amount: 1,
                  timeRemaining: 60000,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 70000,
                  amount: 1,
                  timeRemaining: 120000,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 130000,
                  amount: 1,
                  timeRemaining: 180000,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 190000,
                  amount: 1,
                  timeRemaining: 240000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Fire Pit",
        id: "123",
        coordinates: { x: 1, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting?.[0].readyAt).toEqual(
      dateNow + 60000,
    );
    expect(state.buildings["Fire Pit"]?.[0].crafting?.[1].readyAt).toEqual(
      dateNow + 120000,
    );
    expect(state.buildings["Fire Pit"]?.[0].crafting?.[2].readyAt).toEqual(
      dateNow + 180000,
    );
    expect(state.buildings["Fire Pit"]?.[0].crafting?.[3].readyAt).toEqual(
      dateNow + 240000,
    );
    expect(state.buildings["Fire Pit"]?.[0].coordinates).toEqual({
      x: 1,
      y: 1,
    });
  });

  it("adjusts the new readyAt for composters", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Premium Composter": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Premium Composter": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
              producing: {
                items: {
                  "Rapid Root": 10,
                  "Red Wiggler": 1,
                },
                startedAt: dateNow - 180000,
                readyAt: dateNow - 180000 + 12 * 60 * 60 * 1000,
              },
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Premium Composter",
        id: "123",
        coordinates: { x: 1, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(
      state.buildings["Premium Composter"]?.[0].producing?.startedAt,
    ).toEqual(dateNow - 60000);
    expect(
      state.buildings["Premium Composter"]?.[0].producing?.readyAt,
    ).toEqual(dateNow - 60000 + 12 * 60 * 60 * 1000);
  });

  it("adjusts the new readyAt for crop machines", () => {
    const startTime = dateNow - 20000000;
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crop Machine": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              queue: [
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: startTime,
                  readyAt: startTime + 60000000,
                  pausedTimeRemaining: 50000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: startTime + 60000000,
                  readyAt: startTime + 120000000,
                  pausedTimeRemaining: 110000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: startTime + 120000000,
                  readyAt: startTime + 180000000,
                  pausedTimeRemaining: 170000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 30000000,
                  totalGrowTime: 60000000,
                  startTime: startTime + 180000000,
                  growsUntil: startTime + 210000000,
                  pausedTimeRemaining: 200000000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Crop Machine",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Crop Machine"]?.[0].queue?.[0].readyAt).toEqual(
      dateNow + 50000000,
    );
    expect(state.buildings["Crop Machine"]?.[0].queue?.[1].readyAt).toEqual(
      dateNow + 110000000,
    );
    expect(state.buildings["Crop Machine"]?.[0].queue?.[2].readyAt).toEqual(
      dateNow + 170000000,
    );
    expect(state.buildings["Crop Machine"]?.[0].queue?.[3].growsUntil).toEqual(
      dateNow + 200000000,
    );
  });

  it("adjusts the new readyAt for greenhouse", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          Greenhouse: new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          Greenhouse: [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        greenhouse: {
          oil: 100,
          pots: {
            "123": {
              plant: {
                name: "Olive",
                plantedAt: dateNow - 180000,
              },
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Greenhouse",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.greenhouse.pots["123"].plant?.plantedAt).toEqual(
      dateNow - 60000,
    );
  });

  it("adjusts the new readyAt for henhouse", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Land": new Decimal(10),
          "Hen House": new Decimal(1),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            "123": {
              type: "Chicken",
              id: "123",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.henHouse.animals["123"].asleepAt).toEqual(dateNow - 60000);
    expect(state.henHouse.animals["123"].awakeAt).toEqual(
      dateNow - 60000 + 24 * 60 * 60 * 1000,
    );
  });

  it("adjusts the new lovedAt for henhouse", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Land": new Decimal(10),
          "Hen House": new Decimal(1),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            "123": {
              type: "Chicken",
              id: "123",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: dateNow - 160000,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.henHouse.animals["123"].lovedAt).toEqual(
      dateNow - (160000 - 120000),
    );
  });

  it("adjusts the new readyAt for crafting box", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Crafting Box": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Crafting Box": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        craftingBox: {
          item: {
            collectible: "Doll",
          },
          startedAt: dateNow - 180000,
          readyAt: dateNow - 180000 + (RECIPES["Doll"]?.time ?? 0),
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "building.placed",
        name: "Crafting Box",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.craftingBox.startedAt).toEqual(dateNow - 60000);
    expect(state.craftingBox.readyAt).toEqual(
      dateNow - 60000 + (RECIPES["Doll"]?.time ?? 0),
    );
  });

  it("does not adjust the new readyAt for second instance of building", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Hen House": new Decimal(2),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              readyAt: 0,
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
            },
            {
              id: "456",
              readyAt: 0,
              createdAt: 0,
              removedAt: dateNow - 2 * 24 * 60 * 60 * 1000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            123: {
              id: "123",
              type: "Chicken",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
            456: {
              id: "456",
              type: "Chicken",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
            789: {
              id: "789",
              type: "Chicken",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "456",
        coordinates: { x: 0, y: 3 },
      },
      createdAt: dateNow,
    });

    expect(state.henHouse.animals["123"].asleepAt).toEqual(dateNow - 180000);
    expect(state.henHouse.animals["456"].asleepAt).toEqual(dateNow - 180000);
    expect(state.henHouse.animals["789"].asleepAt).toEqual(dateNow - 180000);
  });
});
