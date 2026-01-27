import Decimal from "decimal.js-light";

import { TEST_FARM } from "../../lib/constants";
import { GameState, CropPlot } from "../../types/game";
import { removeCrop, REMOVE_CROP_ERRORS } from "./removeCrop";

const dateNow = Date.now();

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
  crops: {
    "0": {
      createdAt: dateNow,
      x: 0,
      y: -2,
      crop: {
        name: "Sunflower",
        plantedAt: dateNow - 40 * 1000, // 40 seconds ago, not ready to harvest
        amount: 1,
      },
    },
  },
  farmActivity: {
    "Sunflower Planted": 5,
  },
};

describe("removeCrop", () => {
  const { inventory } = GAME_STATE;
  const plot = (GAME_STATE.crops as Record<string, CropPlot>)["0"];

  it("does not remove on non-existent plot", () => {
    expect(() =>
      removeCrop({
        state: GAME_STATE,
        action: {
          type: "crop.removed",
          item: "Rusty Shovel",
          index: "non-existent-id",
        },
      }),
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_PLOT);
  });
  it("does not remove if no crop on plot", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          crops: {
            "0": {
              createdAt: dateNow,
              x: 0,
              y: -2,
            },
          },
        },
        action: {
          type: "crop.removed",
          item: "Rusty Shovel",
          index: "0",
        },
      }),
    ).toThrow(REMOVE_CROP_ERRORS.EMPTY_CROP);
  });

  it("does not remove if regular Shovel is used instead of Rusty Shovel", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            Shovel: new Decimal(1),
          },
        },
        action: {
          type: "crop.removed",
          item: "Shovel",
          index: "0",
        },
      }),
    ).toThrow(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });

  it("does not remove if shovel is not selected", () => {
    expect(() =>
      removeCrop({
        state: GAME_STATE,
        action: {
          type: "crop.removed",
          index: "0",
        },
      }),
    ).toThrow(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });

  it("does not remove if no Rusty Shovel exists in inventory", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Rusty Shovel": new Decimal(0),
          },
        },
        action: {
          type: "crop.removed",
          item: "Rusty Shovel",
          index: "0",
        },
      }),
    ).toThrow(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
  });

  it("does not remove if crop is ready to harvest", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          crops: {
            "0": {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 120 * 1000, // 120 seconds ago, ready to harvest
                amount: 1,
              },
            },
          },
        },
        action: {
          type: "crop.removed",
          item: "Rusty Shovel",
          index: "0",
        },
      }),
    ).toThrow(REMOVE_CROP_ERRORS.READY_TO_HARVEST);
  });

  it("removes a crop", () => {
    const gameState = removeCrop({
      state: GAME_STATE,
      action: {
        type: "crop.removed",
        item: "Rusty Shovel",
        index: "0",
      },
    });

    expect(gameState.crops["0"].crop).toBeFalsy();
  });

  it("consumes Rusty Shovel from inventory", () => {
    const gameState = removeCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
      },
      action: {
        type: "crop.removed",
        item: "Rusty Shovel",
        index: "0",
      },
    });

    expect(gameState.inventory["Rusty Shovel"]?.toNumber()).toBe(1);
  });

  it("does not decrement planted activity (to prevent wings PRNG exploit)", () => {
    const gameState = removeCrop({
      state: GAME_STATE,
      action: {
        type: "crop.removed",
        item: "Rusty Shovel",
        index: "0",
      },
    });

    // Planted activity should remain unchanged to ensure PRNG counter is monotonically increasing
    expect(gameState.farmActivity["Sunflower Planted"]).toBe(5);
  });

  it("tracks Crop Removed activity", () => {
    const gameState = removeCrop({
      state: {
        ...GAME_STATE,
        farmActivity: {},
      },
      action: {
        type: "crop.removed",
        item: "Rusty Shovel",
        index: "0",
      },
    });

    expect(gameState.farmActivity["Crop Removed"]).toBe(1);
  });
});
