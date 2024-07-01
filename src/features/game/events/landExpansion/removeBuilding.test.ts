import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { Chicken, GameState } from "features/game/types/game";
import {
  areUnsupportedChickensBrewing,
  getUnsupportedChickens,
  removeBuilding,
  REMOVE_BUILDING_ERRORS,
} from "./removeBuilding";
import { hasRemoveRestriction } from "features/game/types/removeables";
import { BuildingName } from "features/game/types/buildings";

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

  it("does not remove a building that has a removal restriction", () => {
    const buildingName: BuildingName = "Crop Machine";
    const id = "123";
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        "Rusty Shovel": new Decimal(0),
      },
      buildings: {
        "Crop Machine": [
          {
            id: "123",
            coordinates: { x: 1, y: 1 },
            createdAt: 0,
            readyAt: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 1,
                seeds: 1,
                totalGrowTime: 60,
                growTimeRemaining: 60,
              },
            ],
          },
        ],
      },
    };

    const [_, error] = hasRemoveRestriction(buildingName, id, state);

    expect(() =>
      removeBuilding({
        state,
        action: {
          type: "building.removed",
          name: buildingName,
          id,
        },
      }),
    ).toThrow(error);
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
        name: "Fire Pit",
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
        name: "Fire Pit",
        id: "123",
      },
    });

    expect(gameState.inventory["Rusty Shovel"]).toEqual(new Decimal(1));
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

  it("cannot remove hen house if unsupported chickens are brewing", () => {
    const gameState = {
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
    };
    gameState.chickens["2"].fedAt = 1;
    expect(() =>
      removeBuilding({
        state: gameState,
        action: {
          type: "building.removed",
          name: "Hen House",
          id: "123",
        },
      }),
    ).toThrow(REMOVE_BUILDING_ERRORS.HEN_HOUSE_REMOVE_BREWING_CHICKEN);
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
        name: "Hen House",
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
        name: "Hen House",
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
        name: "Hen House",
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
        name: "Hen House",
        id: "123",
      },
    });

    expect(getKeys(result.chickens).length).toBe(0);
  });
});

describe("getUnsupportedChickens", () => {
  it("get last 5 unsupported chickens if players have 15 placed chickens and only have 1 hen house", () => {
    const gameState = {
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
        ],
      },
    };

    const result = getUnsupportedChickens(gameState);

    const lastChickensIndexes = Array.from({ length: 5 }, (_, i) =>
      (i + 10).toString(),
    );
    const lastChickensInState = {} as Record<string, Chicken>;
    lastChickensIndexes.forEach(
      (key) =>
        (lastChickensInState[key] = {
          coordinates: {
            x: 7,
            y: 3,
          },
          multiplier: 1,
        }),
    );
    expect(result).toEqual(lastChickensInState);
  });
  it("get all 8 unsupported chickens if players have 8 placed chickens and have 0 hen houses", () => {
    const gameState = {
      ...GAME_STATE,
      inventory: {
        "Rusty Shovel": new Decimal(1),
      },
      chickens: makeChickens(8),
      buildings: {},
    };

    const result = getUnsupportedChickens(gameState);
    expect(result).toEqual(gameState.chickens);
  });
  it("get no unsupported chickens if all chickens are supported", () => {
    const gameState = {
      ...GAME_STATE,
      inventory: {
        "Rusty Shovel": new Decimal(1),
      },
      chickens: makeChickens(9),
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
    };

    const result = getUnsupportedChickens(gameState);
    expect(result).toEqual({});
  });
});

describe("areUnsupportedChickensBrewing", () => {
  it("return false if supported chickens are brewing", () => {
    const gameState = {
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
        ],
      },
    };
    gameState.chickens["0"].fedAt = 100;

    const result = areUnsupportedChickensBrewing(gameState);
    expect(result).toBeFalsy();
  });
  it("return true if some unsupported chickens are brewing", () => {
    const gameState = {
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
        ],
      },
    };
    gameState.chickens["11"].fedAt = 100;

    const result = areUnsupportedChickensBrewing(gameState);
    expect(result).toBeTruthy();
  });
  it("return false if no unsupported chickens are brewing", () => {
    const gameState = {
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
        ],
      },
    };

    const result = areUnsupportedChickensBrewing(gameState);
    expect(result).toBeFalsy();
  });
});
