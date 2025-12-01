import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { bulkPlant } from "./bulkPlant";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";

describe("bulkPlant", () => {
  const dateNow = Date.now();
  let initialState: GameState;

  beforeEach(() => {
    const farmWithPlots: GameState = {
      ...INITIAL_FARM,
      crops: {
        "1": {
          x: -1,
          y: -1,
          createdAt: 0,
        },
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
        },
        "3": {
          x: 0,
          y: 1,
          createdAt: 0,
          crop: {
            name: "Sunflower",
            plantedAt: 0,
          },
        },
        "4": {
          x: 0,
          y: 2,
          createdAt: 0,
        },
      },
    };

    initialState = {
      ...farmWithPlots,
      balance: new Decimal(0),
      inventory: {
        "Sunflower Seed": new Decimal(10),
        "Potato Seed": new Decimal(5),
      },
      bumpkin: TEST_BUMPKIN,
    };
  });

  it("plants seeds on all available empty plots", () => {
    const state: GameState = {
      ...initialState,
      inventory: {
        "Sunflower Seed": new Decimal(10),
      },
    };

    const newState = bulkPlant({
      state,
      createdAt: dateNow,
      action: {
        type: "seeds.bulkPlanted",
        seed: "Sunflower Seed",
      },
    });

    // Should plant on 3 empty plots (plots 1, 2, 4)
    expect(newState.inventory["Sunflower Seed"]).toEqual(new Decimal(7));

    // Check that crops were planted
    expect(newState.crops["1"].crop?.name).toBe("Sunflower");
    expect(newState.crops["2"].crop?.name).toBe("Sunflower");
    expect(newState.crops["4"].crop?.name).toBe("Sunflower");

    // Plot 3 should remain unchanged (already has a crop)
    expect(newState.crops["3"].crop?.name).toBe("Sunflower");
  });

  it("plants only as many seeds as available", () => {
    const state = {
      ...initialState,
      inventory: {
        "Sunflower Seed": new Decimal(2),
      },
    };

    const newState = bulkPlant({
      state,
      createdAt: dateNow,
      action: {
        type: "seeds.bulkPlanted",
        seed: "Sunflower Seed",
      },
    });

    // Should only plant 2 seeds (limited by inventory)
    expect(newState.inventory["Sunflower Seed"]).toEqual(new Decimal(0));

    // Only 2 plots should have crops planted
    const plantedPlots = Object.values(newState.crops).filter(
      (plot) => plot.crop?.name === "Sunflower",
    );
    expect(plantedPlots).toHaveLength(3);
  });

  it("does not plant if no seeds available", () => {
    const state = {
      ...initialState,
      inventory: {
        "Sunflower Seed": new Decimal(0),
      },
    };

    expect(() =>
      bulkPlant({
        state,
        createdAt: dateNow,
        action: {
          type: "seeds.bulkPlanted",
          seed: "Sunflower Seed",
        },
      }),
    ).toThrow("Not enough seeds to plant");
  });

  it("does not plant if no empty plots available", () => {
    const state: GameState = {
      ...initialState,
      crops: {
        "1": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Sunflower",
            plantedAt: 0,
          },
        },
        "2": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: {
            name: "Potato",
            plantedAt: 0,
          },
        },
      },
      inventory: {
        "Sunflower Seed": new Decimal(5),
      },
    };

    expect(() =>
      bulkPlant({
        state,
        createdAt: dateNow,
        action: {
          type: "seeds.bulkPlanted",
          seed: "Sunflower Seed",
        },
      }),
    ).toThrow("Not enough seeds to plant");
  });

  it("throws error if no seed selected", () => {
    expect(() =>
      bulkPlant({
        state: initialState,
        createdAt: dateNow,
        action: {
          type: "seeds.bulkPlanted",
          seed: "" as any,
        },
      }),
    ).toThrow("No seed selected");
  });

  it("throws error if not a valid seed", () => {
    expect(() =>
      bulkPlant({
        state: initialState,
        createdAt: dateNow,
        action: {
          type: "seeds.bulkPlanted",
          seed: "Invalid Seed" as any,
        },
      }),
    ).toThrow("Not a seed");
  });

  it("applies boosts correctly for all planted crops", () => {
    const state = {
      ...initialState,
      collectibles: {
        "Basic Scarecrow": [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
          },
        ],
      },
      inventory: {
        "Sunflower Seed": new Decimal(3),
      },
    };

    const newState = bulkPlant({
      state,
      createdAt: dateNow,
      action: {
        type: "seeds.bulkPlanted",
        seed: "Sunflower Seed",
      },
    });

    expect(newState.aoe).toBeDefined();
    expect(newState.boostsUsedAt).toBeDefined();
  });

  it("generates unique crop IDs for each planted crop", () => {
    const state = {
      ...initialState,
      inventory: {
        "Sunflower Seed": new Decimal(3),
      },
    };

    const newState = bulkPlant({
      state,
      createdAt: dateNow,
      action: {
        type: "seeds.bulkPlanted",
        seed: "Sunflower Seed",
      },
    });

    const plantedCrops = Object.values(newState.crops)
      .filter((plot) => plot.crop?.name === "Sunflower")
      .map((plot) => plot.crop?.id);

    const uniqueIds = new Set(plantedCrops);
    expect(uniqueIds.size).toBe(plantedCrops.length);
  });

  it("tracks bumpkin activity for planted crops", () => {
    const seed = "Rhubarb Seed";
    const state = {
      ...initialState,
      inventory: {
        [seed]: new Decimal(2),
      },
    };

    const newState = bulkPlant({
      state,
      createdAt: dateNow,
      action: {
        type: "seeds.bulkPlanted",
        seed,
      },
    });

    expect(newState.farmActivity["Rhubarb Planted"]).toBe(2);
  });

  it("handles different crop types correctly", () => {
    const state: GameState = {
      ...initialState,
      inventory: {
        "Potato Seed": new Decimal(3),
      },
      season: {
        season: "summer",
        startedAt: 0,
      },
    };

    const newState = bulkPlant({
      state,
      createdAt: dateNow,
      action: {
        type: "seeds.bulkPlanted",
        seed: "Potato Seed",
      },
    });

    const plantedCrops = Object.values(newState.crops).filter(
      (plot) => plot.crop?.name === "Potato",
    );

    expect(plantedCrops).toHaveLength(3);
    expect(newState.farmActivity["Potato Planted"]).toBe(3);
  });
});
