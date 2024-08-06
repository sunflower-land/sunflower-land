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
});
