import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import {
  Chicken,
  GameState,
  LandExpansionPlot,
} from "features/game/types/game";
import { moveBuilding, MOVE_BUILDING_ERRORS } from "./moveBuilding";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

const makePlotsWithCrops = (plotCount: number) => {
  const plots = {} as Record<number, LandExpansionPlot>;

  [...Array(plotCount).keys()].forEach(
    (key) =>
      (plots[key] = {
        crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
        x: -2,
        y: 0,
        height: 1,
        width: 1,
      })
  );

  return plots;
};

const makePlotsWithoutCrops = (plotCount: number) => {
  const plots = {} as Record<number, LandExpansionPlot>;

  [...Array(plotCount).keys()].forEach(
    (key) =>
      (plots[key] = {
        x: -2,
        y: 0,
        height: 1,
        width: 1,
      })
  );

  return plots;
};

export const makeChickens = (numberOfChickens: number) => {
  const chickens = {} as Record<string, Chicken>;

  Array.from({ length: numberOfChickens }, (_, i) => i.toString()).forEach(
    (key) =>
      (chickens[key] = {
        coordinates: {
          x: 7,
          y: 3,
        },
        multiplier: 1,
      })
  );

  return chickens;
};

describe("moveBuilding", () => {
  it("does not move non-existent building ", () => {
    expect(() =>
      moveBuilding({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "building.moved",
          building: "Bakery",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_BUILDING_ERRORS.INVALID_BUILDING);
  });

  it("does not move building with invalid id", () => {
    expect(() =>
      moveBuilding({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "building.moved",
          building: "Bakery",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_BUILDING_ERRORS.INVALID_BUILDING);
  });

  it("moves a building", () => {
    const gameState = moveBuilding({
      state: {
        ...GAME_STATE,
        buildings: {
          Bakery: [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "456",
              coordinates: { x: 4, y: 4 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "789",
              coordinates: { x: 8, y: 8 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "building.moved",
        building: "Bakery",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.buildings.Bakery).toEqual([
      {
        id: "123",
        coordinates: { x: 2, y: 2 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "456",
        coordinates: { x: 4, y: 4 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "789",
        coordinates: {
          x: 8,
          y: 8,
        },
        createdAt: 0,
        readyAt: 0,
      },
    ]);
  });
});
