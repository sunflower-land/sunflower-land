import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { bulkHarvest, getCropsToHarvest } from "./bulkHarvest";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { CropName } from "../../types/crops";
import dictionary from "lib/i18n/dictionaries/dictionary.json";

const FARM_WITH_PLOTS: GameState = {
  ...INITIAL_FARM,
  crops: {
    "1": {
      x: -1,
      y: -1,
      createdAt: 0,
      crop: {
        name: "Sunflower" as CropName,
        plantedAt: 0,
        boostedTime: 0,
      },
    },
    "2": {
      x: 1,
      y: 0,
      createdAt: 0,
      crop: {
        name: "Potato" as CropName,
        plantedAt: 0,
        boostedTime: 0,
      },
    },
    "3": {
      x: 0,
      y: 1,
      createdAt: 0,
      crop: {
        name: "Sunflower" as CropName,
        plantedAt: 0,
        boostedTime: 0,
      },
    },
    "4": {
      x: 0,
      y: 2,
      createdAt: 0,
      crop: {
        name: "Cauliflower" as CropName,
        plantedAt: 0,
        boostedTime: 0,
      },
    },
    "5": {
      x: 2,
      y: 2,
      createdAt: 0,
      // No crop - should not be harvested
    },
  },
};

const GAME_STATE: GameState = {
  ...FARM_WITH_PLOTS,
  balance: new Decimal(0),
  inventory: {
    Sunflower: new Decimal(5),
    Potato: new Decimal(3),
    Pumpkin: new Decimal(1),
  },
  bumpkin: TEST_BUMPKIN,
};

describe("bulkHarvest", () => {
  const dateNow = Date.now();

  it("harvests all ready crops", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Sunflower: new Decimal(5),
        Potato: new Decimal(3),
        Pumpkin: new Decimal(1),
      },
    };

    const newState = bulkHarvest({
      state,
      createdAt: dateNow,
      action: {
        type: "crops.bulkHarvested",
      },
    });

    expect(newState.inventory.Sunflower?.toNumber()).toBe(7);
    expect(newState.inventory.Potato?.toNumber()).toBe(4);
    expect(newState.inventory.Cauliflower?.toNumber()).toBe(1);

    expect(newState.crops["1"].crop).toBeUndefined();
    expect(newState.crops["2"].crop).toBeUndefined();
    expect(newState.crops["3"].crop).toBeUndefined();
    expect(newState.crops["4"].crop).toBeUndefined();
    expect(newState.crops["5"].crop).toBeUndefined();
  });

  it("does not harvest crops that are not ready", () => {
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 1,
          y: 1,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: dateNow - 1000,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Potato" as CropName,
            plantedAt: dateNow - 1000,
            boostedTime: 0,
          },
        },
      },
      inventory: {
        Sunflower: new Decimal(5),
        Potato: new Decimal(3),
      },
    };

    expect(() =>
      bulkHarvest({
        state,
        createdAt: dateNow,
        action: {
          type: "crops.bulkHarvested",
        },
      }),
    ).toThrow(dictionary["obsidianShrine.noCrops"]);
  });

  it("throws error if no crops ready for harvest", () => {
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 1,
          y: 1,
          createdAt: 0,
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
        },
      },
    };

    expect(() =>
      bulkHarvest({
        state,
        createdAt: dateNow,
        action: {
          type: "crops.bulkHarvested",
        },
      }),
    ).toThrow(dictionary["obsidianShrine.noCrops"]);
  });

  it("applies boosts correctly for all harvested crops", () => {
    const state = {
      ...GAME_STATE,
      collectibles: {
        "Golden Cauliflower": [
          {
            id: "1234",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
          },
        ],
      },
      inventory: {
        Sunflower: new Decimal(5),
        Potato: new Decimal(3),
      },
    };

    const newState = bulkHarvest({
      state,
      createdAt: dateNow,
      action: {
        type: "crops.bulkHarvested",
      },
    });

    expect(newState.aoe).toBeDefined();
    expect(newState.boostsUsedAt).toBeDefined();
  });

  it("tracks bumpkin activity for harvested crops", () => {
    const newState = bulkHarvest({
      state: GAME_STATE,
      createdAt: dateNow,
      action: {
        type: "crops.bulkHarvested",
      },
    });

    expect(newState.farmActivity["Sunflower Harvested"]).toBe(2);
    expect(newState.farmActivity["Potato Harvested"]).toBe(1);
  });

  it("harvests different crops", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Sunflower: new Decimal(5),
        Potato: new Decimal(3),
        Pumpkin: new Decimal(1),
      },
    };

    const newState = bulkHarvest({
      state,
      createdAt: dateNow,
      action: {
        type: "crops.bulkHarvested",
      },
    });

    expect(newState.inventory.Sunflower?.toNumber()).toBeGreaterThan(5);
    expect(newState.inventory.Potato?.toNumber()).toBeGreaterThan(3);
    expect(newState.inventory.Cauliflower?.toNumber()).toBe(1);
  });

  it("accumulates crop amounts correctly", () => {
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 1,
          y: 1,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName, // Same crop type
            plantedAt: 0,
            boostedTime: 0,
          },
        },
      },
      inventory: {
        Sunflower: new Decimal(5),
      },
    };

    const newState = bulkHarvest({
      state,
      createdAt: dateNow,
      action: {
        type: "crops.bulkHarvested",
      },
    });

    expect(newState.inventory.Sunflower?.toNumber()).toBeGreaterThan(5);

    expect(newState.farmActivity["Sunflower Harvested"]).toBe(2);
  });
});

describe("getPlotsToHarvest", () => {
  const dateNow = Date.now();

  it("returns plots with ready crops", () => {
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 1,
          y: 1,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Potato" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "3": {
          x: 0,
          y: 1,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: dateNow - 1000,
            boostedTime: 0,
          },
        },
        "4": {
          x: 0,
          y: 2,
          createdAt: 0,
        },
      },
    };

    const { readyPlots } = getCropsToHarvest(state, dateNow);

    expect(readyPlots).toHaveProperty("1");
    expect(readyPlots).toHaveProperty("2");
    expect(readyPlots).not.toHaveProperty("3");
    expect(readyPlots).not.toHaveProperty("4");
  });

  it("returns empty object when no crops are ready", () => {
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 1,
          y: 1,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: dateNow - 1000,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
        },
      },
    };

    const { readyPlots } = getCropsToHarvest(state, dateNow);

    expect(readyPlots).toEqual({});
  });

  it("handles plots with no crops", () => {
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 1,
          y: 1,
          createdAt: 0,
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
        },
      },
    };

    const { readyPlots } = getCropsToHarvest(state, dateNow);

    expect(readyPlots).toEqual({});
  });

  it("excludes ready crops on plots affected by tornado", () => {
    const dateNow = Date.now();
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 1,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "3": {
          x: 2,
          y: 0,
          createdAt: 2,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "4": {
          x: 3,
          y: 0,
          createdAt: 3,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
      },
      calendar: {
        dates: [],
        tornado: { startedAt: dateNow - 1000, triggeredAt: dateNow - 500 },
      },
    };

    const { readyPlots, readyCrops } = getCropsToHarvest(state, dateNow);

    // Only "3" and "4" should be in readyPlots; "1" and "2" are destroyed by tornado
    expect(readyPlots).toHaveProperty("3");
    expect(readyPlots).toHaveProperty("4");
    expect(readyPlots).not.toHaveProperty("1");
    expect(readyPlots).not.toHaveProperty("2");
    expect(readyCrops["Sunflower"]).toBe(2);
  });

  it("excludes ready crops on plots affected by tsunami", () => {
    const dateNow = Date.now();
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 1,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "3": {
          x: 2,
          y: 0,
          createdAt: 2,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "4": {
          x: 3,
          y: 0,
          createdAt: 3,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
      },
      calendar: {
        dates: [],
        tsunami: {
          startedAt: dateNow - 1000,
          triggeredAt: dateNow - 500,
        },
      },
    };

    const { readyPlots } = getCropsToHarvest(state, dateNow);

    expect(readyPlots).toHaveProperty("3");
    expect(readyPlots).toHaveProperty("4");
    expect(readyPlots).not.toHaveProperty("1");
    expect(readyPlots).not.toHaveProperty("2");
  });

  it("excludes ready crops on plots affected by greatFreeze", () => {
    const dateNow = Date.now();
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 1,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "3": {
          x: 2,
          y: 0,
          createdAt: 2,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "4": {
          x: 3,
          y: 0,
          createdAt: 3,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
      },
      calendar: {
        dates: [],
        greatFreeze: {
          startedAt: dateNow - 1000,
          triggeredAt: dateNow - 500,
        },
      },
    };

    const { readyPlots } = getCropsToHarvest(state, dateNow);

    expect(readyPlots).toHaveProperty("3");
    expect(readyPlots).toHaveProperty("4");
    expect(readyPlots).not.toHaveProperty("1");
    expect(readyPlots).not.toHaveProperty("2");
  });

  it("includes weather-affected plots in getCropsToHarvest when protected", () => {
    const dateNow = Date.now();
    const state = {
      ...GAME_STATE,
      crops: {
        "1": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 1,
          crop: {
            name: "Sunflower" as CropName,
            plantedAt: 0,
            boostedTime: 0,
          },
        },
      },
      calendar: {
        dates: [],
        tornado: {
          startedAt: dateNow - 1000,
          triggeredAt: dateNow - 500,
          protected: true,
        },
      },
    };

    const { readyPlots } = getCropsToHarvest(state, dateNow);

    // When protected, getAffectedWeather returns undefined, so both plots are included
    expect(readyPlots).toHaveProperty("1");
    expect(readyPlots).toHaveProperty("2");
  });
});
