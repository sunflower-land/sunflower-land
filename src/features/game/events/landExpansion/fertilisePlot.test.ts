import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import { GameState, CropPlot } from "features/game/types/game";
import { fertilisePlot, FERTILISE_CROP_ERRORS } from "./fertilisePlot";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rapid Root": new Decimal(1),
  },
  bumpkin: TEST_BUMPKIN,
};

describe("fertiliseCrop", () => {
  const dateNow = Date.now();
  const { inventory, crops } = GAME_STATE;
  const plot = {
    ...(crops as Record<number, CropPlot>)[0],
    x: 1,
    y: 0,
    createdAt: dateNow,
  };

  it("does not fertilise on non-existent plot", () => {
    expect(() =>
      fertilisePlot({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "plot.fertilised",
          plotID: "200000",

          fertiliser: "Rapid Root",
        },
      }),
    ).toThrow(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  });

  it("does not fertilise if crop already grown", () => {
    expect(() =>
      fertilisePlot({
        state: {
          ...GAME_STATE,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 120 * 1000,
              },
            },
          },
        },
        action: {
          type: "plot.fertilised",
          plotID: "0",

          fertiliser: "Rapid Root",
        },
      }),
    ).toThrow(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
  });
  it("does not fertilise if crop already fertilized", () => {
    expect(() =>
      fertilisePlot({
        state: {
          ...GAME_STATE,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 40 * 1000,
              },
              fertiliser: {
                name: "Rapid Root",
                fertilisedAt: dateNow,
              },
            },
          },
        },
        action: {
          type: "plot.fertilised",
          plotID: "0",

          fertiliser: "Sprout Mix",
        },
      }),
    ).toThrow(FERTILISE_CROP_ERRORS.CROP_ALREADY_FERTILISED);
  });
  it("does not fertilise if not enough fertiliser", () => {
    expect(() =>
      fertilisePlot({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Rapid Root": new Decimal(0),
          },
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 40 * 1000,
              },
            },
          },
        },
        action: {
          type: "plot.fertilised",
          plotID: "0",

          fertiliser: "Rapid Root",
        },
      }),
    ).toThrow(FERTILISE_CROP_ERRORS.NOT_ENOUGH_FERTILISER);
  });

  it("fertilises a crop with Rapid Root", () => {
    const sunflowerPlantedAt = dateNow - 40 * 1000;
    const gameState = fertilisePlot({
      state: {
        ...GAME_STATE,
        inventory: {
          ...inventory,
          "Rapid Root": new Decimal(5),
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: sunflowerPlantedAt,
            },
          },
        },
      },
      action: {
        type: "plot.fertilised",
        plotID: "0",

        fertiliser: "Rapid Root",
      },
      createdAt: dateNow,
    });

    const cropTime = CROPS["Sunflower"].harvestSeconds * 1000;
    const harvestTime = sunflowerPlantedAt + cropTime;

    expect(gameState.crops["0"].crop?.plantedAt).toEqual(
      sunflowerPlantedAt - (harvestTime - dateNow) / 2,
    );
    expect(gameState.inventory["Rapid Root"]).toEqual(new Decimal(4));
  });

  it("fertilises a crop with Sprout Mix", () => {
    const sunflowerPlantedAt = dateNow - 40 * 1000;
    const gameState = fertilisePlot({
      state: {
        ...GAME_STATE,
        inventory: {
          ...inventory,
          "Sprout Mix": new Decimal(5),
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: sunflowerPlantedAt,
            },
          },
        },
      },
      action: {
        type: "plot.fertilised",
        plotID: "0",

        fertiliser: "Sprout Mix",
      },
      createdAt: dateNow,
    });

    const cropTime = CROPS["Sunflower"].harvestSeconds * 1000;
    const harvestTime = sunflowerPlantedAt + cropTime;

    expect(gameState.crops["0"].fertiliser).toEqual({
      name: "Sprout Mix",
      fertilisedAt: expect.any(Number),
    });
    expect(gameState.inventory["Sprout Mix"]).toEqual(new Decimal(4));
  });

  it("moves the aoe readyAt time to the boosted time for basic scarecrow", () => {
    const sunflowerPlantedAt = dateNow - 40 * 1000;
    const sunflowerBaseHarvestTime = CROPS.Sunflower.harvestSeconds * 1000;
    const gameState = fertilisePlot({
      state: {
        ...GAME_STATE,
        inventory: {
          ...inventory,
          "Rapid Root": new Decimal(5),
        },
        crops: {
          0: {
            crop: {
              name: "Sunflower",
              plantedAt: sunflowerPlantedAt,
            },
            x: 1,
            y: 0,
            createdAt: dateNow,
          },
        },
        collectibles: {
          "Basic Scarecrow": [
            {
              id: "1",
              readyAt: 1,
              createdAt: 1,
              coordinates: { x: 1, y: 1 },
            },
          ],
        },
        aoe: {
          "Basic Scarecrow": {
            0: {
              "-1": sunflowerPlantedAt + sunflowerBaseHarvestTime,
            },
          },
        },
      },
      action: {
        type: "plot.fertilised",
        plotID: "0",

        fertiliser: "Rapid Root",
      },
      createdAt: dateNow,
    });

    expect(gameState.aoe["Basic Scarecrow"]?.[0]?.[-1]).toEqual(
      dateNow + 10 * 1000,
    );
  });
  it("adds to the boosted time in plots when rapid root is used", () => {
    const sunflowerPlantedAt = dateNow - 40 * 1000;
    const gameState = fertilisePlot({
      state: {
        ...GAME_STATE,
        inventory: {
          ...inventory,
          "Rapid Root": new Decimal(5),
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: sunflowerPlantedAt,
              boostedTime: 0,
            },
          },
        },
      },
      action: {
        type: "plot.fertilised",
        plotID: "0",

        fertiliser: "Rapid Root",
      },
      createdAt: dateNow,
    });
    expect(gameState.crops[0].crop?.boostedTime).toEqual(10 * 1000);
  });
});
