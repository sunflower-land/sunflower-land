import Decimal from "decimal.js-light";
import { INITIAL_EXPANSIONS, TEST_FARM } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import {
  Chicken,
  GameState,
  LandExpansionPlot,
} from "features/game/types/game";
import { removeBuilding, REMOVE_BUILDING_ERRORS } from "./removeBuilding";

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
  const chickens = {} as Record<number, Chicken>;

  [...Array(numberOfChickens).keys()].forEach(
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
          building: "Bakery",
          id: "1",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
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
          building: "Fire Pit",
          id: "123",
        },
      })
    ).toThrow(REMOVE_BUILDING_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  });

  it("removes a building and does not affect buildings of the same type", () => {
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

  it("uses one Rusty Shovel per building removed", () => {
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
        building: "Fire Pit",
        id: "123",
      },
    });

    expect(gameState.inventory["Rusty Shovel"]).toEqual(new Decimal(1));
  });

  it("removes the two unsupported crops from the last expansion when the only water well is removed", () => {
    // 17 plots in total
    // 15 plots can be supported without a well
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        expansions: [
          ...INITIAL_EXPANSIONS,
          {
            createdAt: 0,
            readyAt: 0,
            plots: {
              ...INITIAL_EXPANSIONS[0].plots,
              8: {
                x: 0,
                y: 1,
                height: 1,
                width: 1,
                crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
              },
              9: {
                x: 0,
                y: 1,
                height: 1,
                width: 1,
                crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
              },
            },
          },
        ],
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        buildings: {
          "Water Well": [
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
        building: "Water Well",
        id: "123",
      },
    });

    const { expansions } = gameState;

    expect(expansions[expansions.length - 1].plots?.["8"].crop).toBeUndefined();
    expect(expansions[expansions.length - 1].plots?.["9"].crop).toBeUndefined();
  });

  it("removes one unsupported crop from each of the last three expansions when the only water well is removed", () => {
    // 18 plots in total
    // 15 plots can be supported without a well
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        expansions: [
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(6) },
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(1) },
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(1) },
        ],
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        buildings: {
          "Water Well": [
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
        building: "Water Well",
        id: "123",
      },
    });

    const { expansions } = gameState;

    expect(expansions[expansions.length - 1].plots?.["0"].crop).toBeUndefined();
    expect(expansions[expansions.length - 2].plots?.["0"].crop).toBeUndefined();
    expect(expansions[expansions.length - 3].plots?.["5"].crop).toBeUndefined();
  });

  it("removes 6 crops when 8 plots are unsupported but only 6 of those are planted", () => {
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        expansions: [
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
          {
            createdAt: 0,
            readyAt: 0,
            plots: {
              ...makePlotsWithCrops(1),
              2: { x: -2, y: 0, height: 1, width: 1 },
              3: { x: -2, y: 0, height: 1, width: 1 },
            },
          },
        ],
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        buildings: {
          "Water Well": [
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
        building: "Water Well",
        id: "123",
      },
    });

    const { expansions } = gameState;

    expect(expansions[expansions.length - 1].plots?.["0"].crop).toBeUndefined();
    expect(expansions[expansions.length - 2].plots?.["9"].crop).toBeUndefined();
    expect(expansions[expansions.length - 2].plots?.["8"].crop).toBeUndefined();
    expect(expansions[expansions.length - 2].plots?.["7"].crop).toBeUndefined();
    expect(expansions[expansions.length - 2].plots?.["6"].crop).toBeUndefined();
    expect(expansions[expansions.length - 2].plots?.["5"].crop).toBeUndefined();
    expect(
      expansions[expansions.length - 2].plots?.["4"].crop
    ).not.toBeUndefined();
    expect(
      expansions[expansions.length - 2].plots?.["3"].crop
    ).not.toBeUndefined();
    expect(
      expansions[expansions.length - 2].plots?.["2"].crop
    ).not.toBeUndefined();
    expect(
      expansions[expansions.length - 2].plots?.["1"].crop
    ).not.toBeUndefined();
  });

  it("does not remove any crops when unsupported plots have no crops", () => {
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        expansions: [
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
          {
            createdAt: 0,
            readyAt: 0,
            plots: {
              ...makePlotsWithCrops(5),
              5: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              6: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              7: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              8: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              9: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
            },
          },
          {
            createdAt: 0,
            readyAt: 0,
            plots: makePlotsWithoutCrops(3),
          },
        ],
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        buildings: {
          "Water Well": [
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
        building: "Water Well",
        id: "123",
      },
    });

    const { expansions } = gameState;

    expect(expansions[0].plots?.["0"].crop).not.toBeUndefined();
    expect(expansions[1].plots?.["4"].crop).not.toBeUndefined();
  });

  it("removes the 8 crops from the last expansion when only 15 out of 23 plots are supported", () => {
    const gameState = removeBuilding({
      state: {
        ...GAME_STATE,
        expansions: [
          {
            createdAt: 0,
            readyAt: 0,
            plots: makePlotsWithoutCrops(3),
          },
          {
            createdAt: 0,
            readyAt: 0,
            plots: {
              ...makePlotsWithCrops(5),
              5: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              6: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              7: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              8: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
              9: {
                x: -2,
                y: 0,
                height: 1,
                width: 1,
              },
            },
          },
          { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
        ],
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        buildings: {
          "Water Well": [
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
        building: "Water Well",
        id: "123",
      },
    });

    const { expansions } = gameState;

    expect(expansions[expansions.length - 1].plots?.["2"].crop).toBeUndefined();
    expect(expansions[expansions.length - 1].plots?.["9"].crop).toBeUndefined();
  });

  it("removes all 10 chickens when only hen house is removed", () => {
    const result = removeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(1),
        },
        chickens: makeChickens(10),
        buildings: {
          "Hen House": [
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
        building: "Hen House",
        id: "123",
      },
    });

    expect(getKeys(result.chickens).length).toBe(0);
  });

  it("removes 5 chickens when one of two hen houses are removed", () => {
    const result = removeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(1),
        },
        chickens: makeChickens(15),
        buildings: {
          "Hen House": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "345",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "building.removed",
        building: "Hen House",
        id: "123",
      },
    });

    expect(getKeys(result.chickens).length).toBe(10);
  });

  it("removes 15 chickens if a chicken coop is placed and one of two hen houses are removed", () => {
    const result = removeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(1),
        },
        chickens: makeChickens(30),
        collectibles: {
          "Chicken Coop": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "345",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "building.removed",
        building: "Hen House",
        id: "123",
      },
    });

    expect(getKeys(result.chickens).length).toBe(15);
  });

  it("removes all chicken if a chicken coop is placed the only hen house is removed", () => {
    const result = removeBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(1),
        },
        chickens: makeChickens(30),
        collectibles: {
          "Chicken Coop": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
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
        building: "Hen House",
        id: "123",
      },
    });

    expect(getKeys(result.chickens).length).toBe(0);
  });
});
