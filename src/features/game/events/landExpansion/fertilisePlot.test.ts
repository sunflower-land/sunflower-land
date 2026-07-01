import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import type { GameState, CropPlot } from "features/game/types/game";
import { fertilisePlot, FERTILISE_CROP_ERRORS } from "./fertilisePlot";
import { getCropReadyAt } from "./harvest";

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

  it("adds to the boosted time in plots when Sproutroot Surprise is used", () => {
    const sunflowerPlantedAt = dateNow - 40 * 1000;
    const gameState = fertilisePlot({
      state: {
        ...GAME_STATE,
        inventory: {
          ...inventory,
          "Sproutroot Surprise": new Decimal(5),
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
        fertiliser: "Sproutroot Surprise",
      },
      createdAt: dateNow,
    });
    expect(gameState.crops[0].crop?.boostedTime).toEqual(10 * 1000);
  });

  // Speed-rate model: a windowed crop (has `baseDurationMs`) is boosted by a live
  // 2× window from `fertilisedAt` (see getCropFertiliserWindows), so fertilising
  // it must NOT mutate the crop — only record the fertiliser. Keyed off
  // `baseDurationMs`, not the flag.
  describe("Rapid Root / Sproutroot Surprise — SPEED_BOOSTS (windowed)", () => {
    const sunflowerMs = CROPS.Sunflower.harvestSeconds * 1000;

    const fertiliseWindowedCrop = (
      fertiliser: "Rapid Root" | "Sproutroot Surprise",
    ) =>
      fertilisePlot({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Rapid Root": new Decimal(5),
            "Sproutroot Surprise": new Decimal(5),
          },
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - sunflowerMs / 2,
                baseDurationMs: sunflowerMs,
              },
            },
          },
        },
        action: { type: "plot.fertilised", plotID: "0", fertiliser },
        createdAt: dateNow,
      });

    it("does NOT mutate a windowed crop — just records the fertiliser at fertilisedAt", () => {
      const plantedAt = dateNow - sunflowerMs / 2;
      const state = fertiliseWindowedCrop("Rapid Root");
      const crop = state.crops["0"].crop;
      // No deduction: plantedAt / baseDurationMs untouched, no boostedTime banked.
      expect(crop?.plantedAt).toEqual(plantedAt);
      expect(crop?.baseDurationMs).toEqual(sunflowerMs);
      expect(crop?.boostedTime).toBeUndefined();
      expect(state.crops["0"].fertiliser).toEqual({
        name: "Rapid Root",
        fertilisedAt: dateNow,
      });
    });

    it("brings the ready time forward by speeding the work accrued AFTER it was applied", () => {
      const state = fertiliseWindowedCrop("Rapid Root");
      const crop = state.crops["0"].crop!;
      const fertiliser = state.crops["0"].fertiliser;

      const readyWith = getCropReadyAt(
        crop,
        CROPS.Sunflower,
        state,
        fertiliser,
      );
      const readyWithout = getCropReadyAt(
        crop,
        CROPS.Sunflower,
        state,
        undefined,
      );

      // Half the work was done at 1×; the remaining half accrues at 2× from
      // fertilisedAt (dateNow): readyAt = dateNow + (sunflowerMs / 2) / 2.
      expect(readyWith).toBe(dateNow + sunflowerMs / 2 / 2);
      expect(readyWith).toBeLessThan(readyWithout);
    });

    it("windows a Sproutroot Surprise crop the same way (time half) without mutation", () => {
      const plantedAt = dateNow - sunflowerMs / 2;
      const state = fertiliseWindowedCrop("Sproutroot Surprise");
      const crop = state.crops["0"].crop!;
      expect(crop.plantedAt).toEqual(plantedAt);
      expect(crop.baseDurationMs).toEqual(sunflowerMs);
      expect(state.crops["0"].fertiliser).toEqual({
        name: "Sproutroot Surprise",
        fertilisedAt: dateNow,
      });
      expect(
        getCropReadyAt(
          crop,
          CROPS.Sunflower,
          state,
          state.crops["0"].fertiliser,
        ),
      ).toBe(dateNow + sunflowerMs / 2 / 2);
    });
  });
});
