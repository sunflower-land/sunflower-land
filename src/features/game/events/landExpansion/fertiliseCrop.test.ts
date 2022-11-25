import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import { GameState, LandExpansionPlot } from "features/game/types/game";
import { TEST_FARM } from "../../lib/constants";
import { fertiliseCrop, FERTILISE_CROP_ERRORS } from "./fertiliseCrop";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rapid Growth": new Decimal(1),
  },
};

describe("fertiliseCrop", () => {
  const dateNow = Date.now();
  const { inventory } = GAME_STATE;
  const expansions = [...GAME_STATE.expansions];
  const expansion = expansions[0];
  const { plots } = expansion;
  const plot = (plots as Record<number, LandExpansionPlot>)[0];
  it("does not fertilise on a non existent expansion", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 0,
          expansionIndex: -1,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.EMPTY_EXPANSION);
  });
  it("does not fertilise on a an expansion with no plots", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
          expansions: [{ createdAt: 0, readyAt: 0 }],
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 0,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.EXPANSION_NO_PLOTS);
  });
  it("does not fertilise on plot with negative plot index", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.fertilised",
          plotIndex: -1,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not fertilise on non-integer plot", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 1.2,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not fertilise on non-existent plot", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 200000,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not fertilise if no crop on plot", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
          expansions: [
            {
              ...expansion,
              plots: {
                0: {
                  x: 1,
                  y: 1,
                  height: 1,
                  width: 1,
                },
              },
            },
          ],
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 0,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.EMPTY_CROP);
  });
  it("does not fertilise if crop already grown", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
          expansions: [
            {
              ...expansion,
              plots: {
                0: {
                  ...plot,
                  crop: {
                    name: "Sunflower",
                    plantedAt: dateNow - 120 * 1000,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 0,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
  });
  it("does not fertilise if crop already fertilized", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
          expansions: [
            {
              ...expansion,
              plots: {
                0: {
                  ...plot,
                  crop: {
                    name: "Sunflower",
                    plantedAt: dateNow - 40 * 1000,
                    fertilisers: [
                      {
                        name: "Rapid Growth",
                        fertilisedAt: dateNow,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 0,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.CROP_ALREADY_FERTILISED);
  });
  it("does not fertilise if not enough fertilisers", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Rapid Growth": new Decimal(0),
          },
          expansions: [
            {
              ...expansion,
              plots: {
                0: {
                  ...plot,
                  crop: {
                    name: "Sunflower",
                    plantedAt: dateNow - 40 * 1000,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.fertilised",
          plotIndex: 0,
          expansionIndex: 0,
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow(FERTILISE_CROP_ERRORS.NOT_ENOUGH_FERTILISER);
  });
  it("fertilises a crop with Rapid Growth", () => {
    const initialRapidGrowthStock = 5;
    const sunflowerPlantedAt = dateNow - 40 * 1000;
    const fertilisedAt = dateNow;
    const gameState = fertiliseCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          ...inventory,
          "Rapid Growth": new Decimal(initialRapidGrowthStock),
        },
        expansions: [
          {
            ...expansion,
            plots: {
              0: {
                ...plot,
                crop: {
                  name: "Sunflower",
                  plantedAt: sunflowerPlantedAt,
                },
              },
            },
          },
        ],
      },
      action: {
        type: "crop.fertilised",
        plotIndex: 0,
        expansionIndex: 0,
        fertiliser: "Rapid Growth",
      },
      createdAt: fertilisedAt,
    });

    const newPlots = gameState.expansions[0].plots;
    expect(newPlots).toBeDefined();
    expect((newPlots as Record<number, LandExpansionPlot>)[0].crop).toEqual({
      name: "Sunflower",
      plantedAt:
        sunflowerPlantedAt - (CROPS()["Sunflower"].harvestSeconds * 1000) / 2,
      fertilisers: [
        {
          name: "Rapid Growth",
          fertilisedAt,
        },
      ],
    });
    expect(gameState.inventory["Rapid Growth"]).toEqual(
      new Decimal(initialRapidGrowthStock - 1)
    );
  });
});
