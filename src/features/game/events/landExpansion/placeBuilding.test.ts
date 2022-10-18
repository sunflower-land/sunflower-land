import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { BuildingName } from "../../types/buildings";
import { GameState } from "../../types/game";
import { placeBuilding } from "./placeBuilding";

const date = Date.now();
const GAME_STATE: GameState = INITIAL_FARM;
describe("Place building", () => {
  it("Requires a building is not already placed", () => {
    expect(() =>
      placeBuilding({
        state: {
          ...GAME_STATE,
          inventory: {
            "Fire Pit": new Decimal(1),
          },
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: 1,
                  y: 1,
                },
                createdAt: date,
                id: "234",
                readyAt: date + 10 * 1000,
              },
            ],
          },
        },

        action: {
          type: "building.placed",
          name: "Fire Pit",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow("This building is already placed");
  });

  it("Requires a building is on the inventory to be placed", () => {
    expect(() =>
      placeBuilding({
        state: {
          ...GAME_STATE,
          inventory: {},
          buildings: {},
        },

        action: {
          type: "building.placed",
          name: "Fire Pit",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow("You can't place a building that is not on the inventory");
  });

  it("Places a building", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Fire Pit": new Decimal(1),
        },
        buildings: {},
      },

      action: {
        type: "building.placed",
        name: "Fire Pit",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.buildings["Fire Pit"]).toHaveLength(1);
  });

  it("Places multiple Workbenchs", () => {
    const state = placeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          Workbench: new Decimal(2),
        },
        buildings: {
          Workbench: [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: date,
              readyAt: date,
            },
          ],
        },
      },
      createdAt: date,
      action: {
        type: "building.placed",
        name: "Workbench",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.buildings["Workbench"]).toHaveLength(2);
    expect(state.buildings["Workbench"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 1 },
      readyAt: date,
      createdAt: date,
    });
    expect(state.buildings["Workbench"]?.[1]).toEqual({
      coordinates: { x: 0, y: 0 },
      readyAt: date + 5 * 60 * 1000,
      createdAt: date,
    });
  });

  it("Cannot place a crop", () => {
    expect(() =>
      placeBuilding({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(2),
            Carrot: new Decimal(10),
          },
          buildings: {},
        },

        action: {
          type: "building.placed",
          name: "Carrot" as BuildingName,
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow("You cannot place this item");
  });
});
