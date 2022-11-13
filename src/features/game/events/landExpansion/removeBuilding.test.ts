import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeBuilding, REMOVE_BUILDING_ERRORS } from "./removeBuilding";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

describe("removeBuilding", () => {
  it("does not remove non-existent building ", () => {
    expect(() =>
      removeBuilding({
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
          type: "building.removed",
          item: "Rusty Shovel",
          building: "Bakery",
          id: "1",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  });

  it("does not remove building with invalid id", () => {
    expect(() =>
      removeBuilding({
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
          type: "building.removed",
          item: "Rusty Shovel",
          building: "Bakery",
          id: "1",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  });

  it("does not remove building with normal shovel", () => {
    expect(() =>
      removeBuilding({
        state: {
          ...GAME_STATE,
          inventory: {
            "Rusty Shovel": new Decimal(1),
          },
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
          type: "building.removed",
          item: "Shovel",
          building: "Fire Pit",
          id: "123",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });

  it("does not remove if shovel is not selected", () => {
    expect(() =>
      removeBuilding({
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
          type: "building.removed",
          building: "Fire Pit",
          id: "123",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });

  it("does not remove if not enough Rusty Shovel in inventory", () => {
    expect(() =>
      removeBuilding({
        state: {
          ...GAME_STATE,
          inventory: {
            "Rusty Shovel": new Decimal(0),
          },
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
          type: "building.removed",
          item: "Rusty Shovel",
          building: "Fire Pit",
          id: "123",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  });

  it("removes a collectible and does not affect collectibles of the same type", () => {
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(1),
        },
        buildings: {
          "Fire Pit": [
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
        type: "building.removed",
        item: "Rusty Shovel",
        building: "Fire Pit",
        id: "123",
      },
    });

    expect(gameState.buildings["Fire Pit"]).toEqual([
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

  it("uses one Rusty Shovel per collectible removed", () => {
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        collectibles: {
          Nugget: [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "building.removed",
        item: "Rusty Shovel",
        building: "Fire Pit",
        id: "123",
      },
    });

    expect(gameState.inventory["Rusty Shovel"]).toEqual(new Decimal(1));
  });
});
