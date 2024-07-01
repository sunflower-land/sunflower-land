import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { MOVE_BUILDING_ERRORS, moveBuilding } from "./moveBuilding";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
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
          name: "Bakery",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_BUILDING_ERRORS.NO_BUILDINGS);
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
          name: "Fire Pit",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_BUILDING_ERRORS.BUILDING_NOT_PLACED);
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
        name: "Bakery",
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
