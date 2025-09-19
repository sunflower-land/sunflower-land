import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { Chicken, GameState } from "features/game/types/game";
import { removeBuilding, REMOVE_BUILDING_ERRORS } from "./removeBuilding";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
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
      }),
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
          name: "Bakery",
          id: "1",
        },
      }),
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
          name: "Bakery",
          id: "1",
        },
      }),
    ).toThrow(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  });

  it("does not remove a building if it's under construction", () => {
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
                readyAt: Date.now() + 60 * 1000,
              },
            ],
          },
        },
        action: {
          type: "building.removed",
          name: "Fire Pit",
          id: "123",
        },
      }),
    ).toThrow(REMOVE_BUILDING_ERRORS.BUILDING_UNDER_CONSTRUCTION);
  });

  it("removes a building and does not affect buildings of the same type", () => {
    const dateNow = Date.now();
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
        name: "Fire Pit",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(gameState.buildings["Fire Pit"]).toEqual([
      {
        id: "123",
        createdAt: 0,
        readyAt: 0,
        removedAt: dateNow,
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

  // it("cannot remove the only water well if there are two unsupported crops from the last expansion", () => {
  //   // 17 plots in total
  //   // 15 plots can be supported without a well
  //   expect(() =>
  //     removeBuilding({
  //       state: {
  //         ...GAME_STATE,
  //         crops: {
  //           ...GAME_STATE.crops,
  //           8: {
  //             x: 0,
  //             y: 1,
  //             height: 1,
  //             width: 1,
  //             crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
  //           },
  //           9: {
  //             x: 0,
  //             y: 1,
  //             height: 1,
  //             width: 1,
  //             crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
  //           },
  //         },
  //         inventory: {
  //           "Rusty Shovel": new Decimal(2),
  //         },
  //         buildings: {
  //           "Water Well": [
  //             {
  //               id: "123",
  //               createdAt: 0,
  //               coordinates: { x: 1, y: 1 },
  //               readyAt: 0,
  //             },
  //           ],
  //         },
  //       },
  //       action: {
  //         type: "building.removed",
  //         name: "Water Well",
  //         id: "123",
  //       },
  //     })
  //   ).toThrow(REMOVE_BUILDING_ERRORS.WATER_WELL_REMOVE_CROPS);
  // });

  // it("cannot remove the only water well if there are one unsupported crop from each of the last three expansions", () => {
  //   // 18 plots in total
  //   // 15 plots can be supported without a well
  //   expect(() =>
  //     removeBuilding({
  //       state: {
  //         ...GAME_STATE,
  //         expansions: [
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(6) },
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(1) },
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(1) },
  //         ],
  //         inventory: {
  //           "Rusty Shovel": new Decimal(2),
  //         },
  //         buildings: {
  //           "Water Well": [
  //             {
  //               id: "123",
  //               createdAt: 0,
  //               coordinates: { x: 1, y: 1 },
  //               readyAt: 0,
  //             },
  //           ],
  //         },
  //       },
  //       action: {
  //         type: "building.removed",
  //         name: "Water Well",
  //         id: "123",
  //       },
  //     })
  //   ).toThrow(REMOVE_BUILDING_ERRORS.WATER_WELL_REMOVE_CROPS);
  // });

  // it("cannot remove the only water well if all 8 unsupported plots have crops planted from the last expansion", () => {
  //   expect(() =>
  //     removeBuilding({
  //       state: {
  //         ...GAME_STATE,
  //         expansions: [
  //           {
  //             createdAt: 0,
  //             readyAt: 0,
  //             plots: makePlotsWithoutCrops(3),
  //           },
  //           {
  //             createdAt: 0,
  //             readyAt: 0,
  //             plots: {
  //               ...makePlotsWithCrops(5),
  //               5: {
  //                 x: -2,
  //                 y: 0,
  //                 height: 1,
  //                 width: 1,
  //               },
  //               6: {
  //                 x: -2,
  //                 y: 0,
  //                 height: 1,
  //                 width: 1,
  //               },
  //               7: {
  //                 x: -2,
  //                 y: 0,
  //                 height: 1,
  //                 width: 1,
  //               },
  //               8: {
  //                 x: -2,
  //                 y: 0,
  //                 height: 1,
  //                 width: 1,
  //               },
  //               9: {
  //                 x: -2,
  //                 y: 0,
  //                 height: 1,
  //                 width: 1,
  //               },
  //             },
  //           },
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
  //         ],
  //         inventory: {
  //           "Rusty Shovel": new Decimal(2),
  //         },
  //         buildings: {
  //           "Water Well": [
  //             {
  //               id: "123",
  //               createdAt: 0,
  //               coordinates: { x: 1, y: 1 },
  //               readyAt: 0,
  //             },
  //           ],
  //         },
  //       },
  //       action: {
  //         type: "building.removed",
  //         name: "Water Well",
  //         id: "123",
  //       },
  //     })
  //   ).toThrow(REMOVE_BUILDING_ERRORS.WATER_WELL_REMOVE_CROPS);
  // });

  // it("cannot remove water well if there are 6 crops when 8 plots are unsupported and only 6 of those are planted", () => {
  //   expect(() =>
  //     removeBuilding({
  //       state: {
  //         ...GAME_STATE,
  //         expansions: [
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
  //           { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
  //           {
  //             createdAt: 0,
  //             readyAt: 0,
  //             plots: {
  //               ...makePlotsWithCrops(1),
  //               2: { x: -2, y: 0, height: 1, width: 1 },
  //               3: { x: -2, y: 0, height: 1, width: 1 },
  //             },
  //           },
  //         ],
  //         inventory: {
  //           "Rusty Shovel": new Decimal(2),
  //         },
  //         buildings: {
  //           "Water Well": [
  //             {
  //               id: "123",
  //               createdAt: 0,
  //               coordinates: { x: 1, y: 1 },
  //               readyAt: 0,
  //             },
  //           ],
  //         },
  //       },
  //       action: {
  //         type: "building.removed",
  //         name: "Water Well",
  //         id: "123",
  //       },
  //     })
  //   ).toThrow(REMOVE_BUILDING_ERRORS.WATER_WELL_REMOVE_CROPS);
  // });

  // it("does not remove any crops when unsupported plots have no crops even if crops are planted in supported plots", () => {
  //   const gameState = removeBuilding({
  //     state: {
  //       ...GAME_STATE,
  //       expansions: [
  //         { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
  //         {
  //           createdAt: 0,
  //           readyAt: 0,
  //           plots: {
  //             ...makePlotsWithCrops(5),
  //             5: {
  //               x: -2,
  //               y: 0,
  //               height: 1,
  //               width: 1,
  //             },
  //             6: {
  //               x: -2,
  //               y: 0,
  //               height: 1,
  //               width: 1,
  //             },
  //             7: {
  //               x: -2,
  //               y: 0,
  //               height: 1,
  //               width: 1,
  //             },
  //             8: {
  //               x: -2,
  //               y: 0,
  //               height: 1,
  //               width: 1,
  //             },
  //             9: {
  //               x: -2,
  //               y: 0,
  //               height: 1,
  //               width: 1,
  //             },
  //           },
  //         },
  //         {
  //           createdAt: 0,
  //           readyAt: 0,
  //           plots: makePlotsWithoutCrops(3),
  //         },
  //       ],
  //       inventory: {
  //         "Rusty Shovel": new Decimal(2),
  //       },
  //       buildings: {
  //         "Water Well": [
  //           {
  //             id: "123",
  //             createdAt: 0,
  //             coordinates: { x: 1, y: 1 },
  //             readyAt: 0,
  //           },
  //         ],
  //       },
  //     },
  //     action: {
  //       type: "building.removed",
  //       name: "Water Well",
  //       id: "123",
  //     },
  //   });

  //   const { expansions } = gameState;

  //   expect(expansions[0].plots?.["0"].crop).not.toBeUndefined();
  //   expect(expansions[1].plots?.["4"].crop).not.toBeUndefined();
  // });

  it("stores the time remaining for cooking buildings", () => {
    const dateNow = Date.now();
    const state = removeBuilding({
      state: {
        ...GAME_STATE,
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              coordinates: { x: 1, y: 1 },
              crafting: [
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 60000,
                  amount: 1,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 120000,
                  amount: 1,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 180000,
                  amount: 1,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 240000,
                  amount: 1,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "building.removed",
        name: "Fire Pit",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(
      state.buildings["Fire Pit"]?.[0].crafting?.[0].timeRemaining,
    ).toEqual(60000);
    expect(
      state.buildings["Fire Pit"]?.[0].crafting?.[1].timeRemaining,
    ).toEqual(120000);
    expect(
      state.buildings["Fire Pit"]?.[0].crafting?.[2].timeRemaining,
    ).toEqual(180000);
    expect(
      state.buildings["Fire Pit"]?.[0].crafting?.[3].timeRemaining,
    ).toEqual(240000);
  });

  it("saves the remaining time for each pack in the crop machine", () => {
    const dateNow = Date.now();
    const state = removeBuilding({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              coordinates: { x: 1, y: 1 },
              queue: [
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: dateNow - 10000000,
                  readyAt: dateNow - 10000000 + 60000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: dateNow - 10000000 + 60000000,
                  readyAt: dateNow - 10000000 + 120000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: dateNow - 10000000 + 120000000,
                  readyAt: dateNow - 10000000 + 180000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 30000000,
                  totalGrowTime: 60000000,
                  startTime: dateNow - 10000000 + 180000000,
                  growsUntil: dateNow - 10000000 + 210000000,
                },
              ],
            },
          ],
        },
      },

      action: {
        type: "building.removed",
        name: "Crop Machine",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(
      state.buildings["Crop Machine"]?.[0].queue?.[0].pausedTimeRemaining,
    ).toEqual(50000000);
    expect(
      state.buildings["Crop Machine"]?.[0].queue?.[1].pausedTimeRemaining,
    ).toEqual(110000000);
    expect(
      state.buildings["Crop Machine"]?.[0].queue?.[2].pausedTimeRemaining,
    ).toEqual(170000000);
    expect(
      state.buildings["Crop Machine"]?.[0].queue?.[3].pausedTimeRemaining,
    ).toEqual(200000000);
  });
});
