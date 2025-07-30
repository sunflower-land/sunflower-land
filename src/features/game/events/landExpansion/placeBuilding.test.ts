import Decimal from "decimal.js-light";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { placeBuilding } from "./placeBuilding";

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
});
