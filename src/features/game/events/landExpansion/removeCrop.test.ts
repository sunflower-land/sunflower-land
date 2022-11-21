import Decimal from "decimal.js-light";

import { TEST_FARM } from "../../lib/constants";
import { GameState, LandExpansionPlot } from "../../types/game";
import { removeCrop, REMOVE_CROP_ERRORS } from "./removeCrop";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    Shovel: new Decimal(1),
  },
};

describe("removeCrop", () => {
  const dateNow = Date.now();
  const { inventory } = GAME_STATE;
  const expansions = [...GAME_STATE.expansions];
  const expansion = expansions[0];
  const { plots } = expansion;
  const plot = (plots as Record<number, LandExpansionPlot>)[0];
  it("does not remove on a non existent expansion", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.removed",
          item: "Shovel",
          index: 0,
          expansionIndex: -1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_EXPANSION);
  });
  it("does not remove on an expansion with no plots", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          expansions: [{ createdAt: 0, readyAt: 0 }],
        },
        action: {
          type: "crop.removed",
          item: "Shovel",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.EXPANSION_NO_PLOTS);
  });
  it("does not remove on plot with negative plot index", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.removed",
          item: "Shovel",
          index: -1,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not remove on non-integer plot", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.removed",
          item: "Shovel",
          index: 1.2,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not remove on non-existent plot", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "crop.removed",
          item: "Shovel",
          index: 200000,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not remove if no crop on plot", () => {
    expect(() =>
      removeCrop({
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
          type: "crop.removed",
          item: "Shovel",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_CROP);
  });
  it("does not remove if the shovel is rusty", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Rusty Shovel": new Decimal(1),
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
          type: "crop.removed",
          item: "Rusty Shovel",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });
  it("does not remove if shovel is not selected", () => {
    expect(() =>
      removeCrop({
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
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.removed",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });
  it("does not remove if no shovel exists in inventory", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            Shovel: new Decimal(0),
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
          type: "crop.removed",
          item: "Shovel",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
  });
  it("does not fertilise if crop is ready to harvest", () => {
    expect(() =>
      removeCrop({
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
          type: "crop.removed",
          item: "Shovel",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.READY_TO_HARVEST);
  });
  it("removes a crop", () => {
    const gameState = removeCrop({
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
                },
              },
            },
          },
        ],
      },
      action: {
        type: "crop.removed",
        item: "Shovel",
        index: 0,
        expansionIndex: 0,
      },
    });

    expect(gameState.inventory.Sunflower).toBeFalsy();
    expect(gameState.inventory["Sunflower Seed"]).toBeFalsy();
    const newPlots = gameState.expansions[0].plots;
    expect((newPlots as Record<number, LandExpansionPlot>)[0].crop).toBeFalsy();
  });
});
