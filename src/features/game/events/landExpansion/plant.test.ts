import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import { INITIAL_FARM } from "../../lib/constants";
import type { GameState, CropPlot } from "../../types/game";
import { getCropPlotTime, getCropTime, plant } from "./plant";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { CONFIG } from "lib/config";
import { CROP_PLOT_BOOST_SPEED } from "features/game/lib/boostWindows";

const FARM_WITH_PLOTS: GameState = {
  ...INITIAL_FARM,
  crops: {
    "1": {
      x: 0,
      y: 0,
      createdAt: 0,
    },
    "3": {
      x: 0,
      y: 0,
      createdAt: 0,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
      },
    },
  },
};
const GAME_STATE: GameState = {
  ...FARM_WITH_PLOTS,
  balance: new Decimal(0),
  inventory: {},
};

const firstId = Object.keys(GAME_STATE.crops)[0];

describe("plant", () => {
  const dateNow = Date.now();

  it("does not plant on non-existent plot", () => {
    expect(() =>
      plant({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "-1",
          item: "Sunflower Seed",
        },
      }),
    ).toThrow("Plot does not exist");
  });

  it("does not plant on non-existent plot", () => {
    expect(() =>
      plant({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "200000",

          item: "Sunflower Seed",
        },
      }),
    ).toThrow("Plot does not exist");
  });

  it("does not plant if plot is not placed", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          crops: {
            0: { ...GAME_STATE.crops[0], x: undefined, y: undefined },
          },
        },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",
          item: "Sunflower Seed",
        },
      }),
    ).toThrow("Plot is not placed");
  });

  it("does not plant if crop already exists", () => {
    const plot = GAME_STATE.crops[firstId];

    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,

          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",

          item: "Sunflower Seed",
        },
      }),
    ).toThrow("Crop is already planted");
  });

  it("does not plant an invalid item", () => {
    expect(() =>
      plant({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: Object.keys(GAME_STATE.crops)[0],

          item: "Pickaxe",
        },
      }),
    ).toThrow("Not a seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plant({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: Object.keys(GAME_STATE.crops)[0],

          item: "Sunflower Seed",
        },
      }),
    ).toThrow("Not enough seeds");
  });

  it("does not plant an out of season seed", () => {
    const seedsAmount = new Decimal(5);

    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cauliflower Seed": seedsAmount,
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
        },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: Object.keys(GAME_STATE.crops)[0],

          item: "Cauliflower Seed",
        },
      }),
    ).toThrow("This seed is not available in this season");
  });

  it("plants a seed", () => {
    const seedsAmount = new Decimal(5);

    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunflower Seed": seedsAmount,
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Sunflower Seed",
      },
    });

    const crops = state.crops;

    expect(state.inventory["Sunflower Seed"]).toEqual(seedsAmount.minus(1));
    expect(crops).toBeDefined();
    expect(crops[firstId]).toEqual(
      expect.objectContaining({
        crop: expect.objectContaining({
          name: "Sunflower",
          plantedAt: expect.any(Number),
        }),
      }),
    );
  });

  it("plants a seed", () => {
    const seedsAmount = new Decimal(5);

    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunflower Seed": seedsAmount,
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Sunflower Seed",
      },
    });

    const crops = state.crops;

    expect(state.inventory["Sunflower Seed"]).toEqual(seedsAmount.minus(1));
    expect(crops).toBeDefined();
    expect(crops[firstId]).toEqual(
      expect.objectContaining({
        crop: expect.objectContaining({
          name: "Sunflower",
          plantedAt: expect.any(Number),
        }),
      }),
    );
  });

  it("plants a normal cauliflower", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Cauliflower Seed",
      },
    });

    const crops = state.crops;

    expect(crops).toBeDefined();
    expect(crops[firstId].crop).toEqual(
      expect.objectContaining({
        name: "Cauliflower",
        plantedAt: expect.any(Number),
      }),
    );
  });

  it("plants an eggplant seed", () => {
    const seedsAmount = new Decimal(5);

    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN, experience: 700 },
        inventory: {
          "Eggplant Seed": seedsAmount,
        },
        season: {
          season: "summer",
          startedAt: 0,
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],
        item: "Eggplant Seed",
      },
    });

    const crops = state.crops;

    expect(state.inventory["Eggplant Seed"]).toEqual(seedsAmount.minus(1));
    expect(crops).toBeDefined();
    expect(crops[firstId]).toEqual(
      expect.objectContaining({
        crop: expect.objectContaining({
          name: "Eggplant",
          plantedAt: expect.any(Number),
        }),
      }),
    );
  });

  it("plants a normal parsnip", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Parsnip Seed": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Parsnip Seed",
      },
    });

    const crops = state.crops;

    expect(crops).toBeDefined();

    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    // Time should be now (+ a couple ms)
    expect(plantedAt + 10).toBeGreaterThan(dateNow);
  });

  it("plants a normal soybean", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Soybean Seed": new Decimal(1),
        },
        season: {
          season: "spring",
          startedAt: 0,
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],
        item: "Soybean Seed",
      },
    });

    const crops = state.crops;

    expect(crops).toBeDefined();

    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    // Time should be now (+ a couple ms)
    expect(plantedAt + 10).toBeGreaterThan(dateNow);
  });

  it("reduces parsnip harvest time in half if Mysterious Parsnip is placed and ready", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Mysterious Parsnip": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        collectibles: {
          "Mysterious Parsnip": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              // ready at < now
              readyAt: dateNow - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Parsnip Seed",
      },
    });

    // Should be twice as fast! (Planted in the past)
    const parnsipTime = CROPS.Parsnip.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(parnsipTime * 0.5);
  });

  it("reduces harvest time by 10% if Seed Specialist (legacy) is on inventory", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Seed Specialist": new Decimal(1),
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Sunflower Seed",
      },
    });

    const sunflowerTime = CROPS.Sunflower.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(sunflowerTime * 0.9);
  });

  it("grows faster with a Nancy placed and ready", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Carrot Seed": new Decimal(1),
          Nancy: new Decimal(1),
        },
        collectibles: {
          Nancy: [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              // ready at < now
              readyAt: dateNow - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Carrot Seed",
      },
    });

    // Should be twice as fast! (Planted in the psat)
    const carrotTime = CROPS.Carrot.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(carrotTime * 0.85);
  });

  it("grows faster if Lunar calendar is placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Lunar Calendar": new Decimal(1),
        },
        collectibles: {
          "Lunar Calendar": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Sunflower Seed",
      },
    });

    const sunflowerTime = CROPS.Sunflower.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(sunflowerTime * 0.9);
  });

  it("grows stores the baseDurationMs on the crop", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Lunar Calendar": new Decimal(1),
        },
        collectibles: {
          "Lunar Calendar": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Sunflower Seed",
      },
    });

    const sunflowerTime = CROPS.Sunflower.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const baseDurationMs = crops[firstId].crop?.baseDurationMs || 0;

    expect(baseDurationMs).toBe(sunflowerTime * 0.9);
  });

  it("grows cabbage twice as fast with Cabbage Girl placed.", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Cabbage Seed": new Decimal(1),
          "Cabbage Girl": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        collectibles: {
          "Cabbage Girl": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],
        item: "Cabbage Seed",
      },
    });

    const cabbageTime = CROPS.Cabbage.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(cabbageTime * 0.5);
  });

  it("applies a bud speed boost", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        crops: {
          0: {
            createdAt: Date.now(),
            x: 0,
            y: -2,
          },
        },
        buds: {
          1: {
            aura: "No Aura",
            colour: "Green",
            type: "Saphiro",
            ears: "Ears",
            stem: "Egg Head",
            coordinates: {
              x: 0,
              y: 0,
            },
          },
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Parsnip Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.plantedAt).toEqual(
      dateNow,
    );
    expect((plots as Record<number, CropPlot>)[0].crop?.baseDurationMs).toEqual(
      0.9 * CROPS.Parsnip.harvestSeconds * 1000,
    );
  });
  it("grows turnip twice as fast with Giant Turnip placed.", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Turnip Seed": new Decimal(1),
          "Giant Turnip": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        collectibles: {
          "Giant Turnip": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],
        item: "Turnip Seed",
      },
    });

    const turnipTime = CROPS.Turnip.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(turnipTime * 0.5);
  });

  describe("getCropTime", () => {
    const plot = GAME_STATE.crops[firstId];
    describe("getPlantedAt", () => {
      it("returns normal planted at if time wrap is expired", () => {
        const now = Date.now();

        const { time } = getCropPlotTime({
          crop: "Sunflower",
          game: {
            ...FARM_WITH_PLOTS,
            collectibles: {
              "Time Warp Totem": [
                {
                  id: "123",
                  createdAt: now - 2 * 60 * 60 * 1000 - 1,
                  coordinates: { x: 1, y: 1 },
                  readyAt: now - 2 * 60 * 60 * 1000 - 1,
                },
              ],
            },
          },
          plot,
          createdAt: dateNow,
        });

        expect(time).toEqual(60);
      });

      it("does not bake the Time Warp Totem into the plot time under SPEED_BOOSTS", () => {
        const now = Date.now();

        const { time } = getCropPlotTime({
          crop: "Sunflower",
          game: {
            ...FARM_WITH_PLOTS,
            collectibles: {
              "Time Warp Totem": [
                {
                  id: "123",
                  createdAt: now,
                  coordinates: { x: 1, y: 1 },
                  readyAt: now - 5 * 60 * 1000,
                },
              ],
            },
          },

          plot,
          createdAt: dateNow,
        });

        // Windowed (2×) for plot crops, so the base time is unchanged here.
        expect(time).toEqual(60);
      });
      it("does not bake the Super Totem into the plot time under SPEED_BOOSTS", () => {
        const now = Date.now();

        const { time } = getCropPlotTime({
          crop: "Sunflower",
          game: {
            ...FARM_WITH_PLOTS,
            collectibles: {
              "Super Totem": [
                {
                  id: "123",
                  createdAt: now,
                  coordinates: { x: 1, y: 1 },
                  readyAt: now - 5 * 60 * 1000,
                },
              ],
            },
          },

          plot,
          createdAt: dateNow,
        });

        expect(time).toEqual(60);
      });

      it("does not stack Super Totem and Time Warp Totem (both windowed, base time unchanged)", () => {
        const now = Date.now();

        const { time } = getCropPlotTime({
          crop: "Sunflower",
          game: {
            ...FARM_WITH_PLOTS,
            collectibles: {
              "Time Warp Totem": [
                {
                  id: "123",
                  createdAt: now,
                  coordinates: { x: 1, y: 1 },
                  readyAt: now - 5 * 60 * 1000,
                },
              ],
              "Super Totem": [
                {
                  id: "123",
                  createdAt: now,
                  coordinates: { x: 1, y: 1 },
                  readyAt: now - 5 * 60 * 1000,
                },
              ],
            },
          },

          plot,
          createdAt: dateNow,
        });

        // Both windowed → not baked; the no-stacking is enforced over the grow
        // (see harvest tests), not in the plant-time multiplier.
        expect(time).toEqual(60);
      });
    });

    it("plants a normal carrot", () => {
      const { time } = getCropPlotTime({
        crop: "Carrot",
        game: FARM_WITH_PLOTS,

        plot,
        createdAt: dateNow,
      });

      expect(time).toEqual(60 * 60);
    });

    it("does not bake Rapid Root into the plot time under SPEED_BOOSTS", () => {
      const { time } = getCropPlotTime({
        crop: "Carrot",
        game: FARM_WITH_PLOTS,

        plot: {
          ...plot,
          fertiliser: { fertilisedAt: 100, name: "Rapid Root" },
        },
        createdAt: dateNow,
      });

      // Windowed (2×) via getCropFertiliserWindows, so the base time is unchanged.
      expect(time).toEqual(60 * 60);
    });

    it("does not bake Sproutroot Surprise into the plot time under SPEED_BOOSTS", () => {
      const { time } = getCropPlotTime({
        crop: "Carrot",
        game: FARM_WITH_PLOTS,

        plot: {
          ...plot,
          fertiliser: { fertilisedAt: 100, name: "Sproutroot Surprise" },
        },
        createdAt: dateNow,
      });

      // Only its grow-TIME half is windowed (2×); the +0.2 yield is separate.
      expect(time).toEqual(60 * 60);
    });

    it("when Bumpkin has Carrot Amulet equipped it reduces 20% the harvest time", () => {
      const { time } = getCropPlotTime({
        crop: "Carrot",
        game: {
          ...FARM_WITH_PLOTS,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: { ...TEST_BUMPKIN.equipped, necklace: "Carrot Amulet" },
          },
        },
        plot,
        createdAt: dateNow,
      });

      expect(time).toEqual(48 * 60);
    });

    it("applies a 10% speed boost with Lunar Calendar placed", () => {
      const carrotHarvestSeconds = CROPS["Carrot"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Carrot",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Lunar Calendar": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot,
        createdAt: dateNow,
      });

      expect(time).toEqual(carrotHarvestSeconds * 0.9);
    });

    it("applies a 25% speed boost with Obie placed", () => {
      const eggplantHarvestSeconds = CROPS["Eggplant"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Eggplant",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            Obie: [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot,
        createdAt: dateNow,
      });

      expect(time).toEqual(eggplantHarvestSeconds * 0.75);
    });

    it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Sunflower", () => {
      const sunflowerHarvestSeconds = CROPS["Sunflower"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(sunflowerHarvestSeconds * 0.8);
    });

    it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Potato", () => {
      const potatoHarvestSeconds = CROPS["Potato"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Potato",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(potatoHarvestSeconds * 0.8);
    });
    it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Pumpkin", () => {
      const pumpkinHarvestSeconds = CROPS["Pumpkin"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Pumpkin",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(pumpkinHarvestSeconds * 0.8);
    });

    it("sets the AOE next available time to the next harvest time", () => {
      const pumpkinHarvestSeconds = CROPS["Pumpkin"].harvestSeconds;

      const { aoe } = getCropPlotTime({
        crop: "Pumpkin",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(aoe["Basic Scarecrow"]?.["0"]?.["-2"]).toEqual(
        dateNow + pumpkinHarvestSeconds * 1000 * 0.8,
      );
    });

    it("sets the Basic Scarecrow AOE cooldown to the windowed (shorter) ready time when a Sparrow Shrine is active", () => {
      const pumpkinHarvestSeconds = CROPS["Pumpkin"].harvestSeconds;

      const { aoe } = getCropPlotTime({
        crop: "Pumpkin",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
            "Sparrow Shrine": [
              {
                id: "456",
                coordinates: { x: 3, y: 3 },
                createdAt: dateNow,
                readyAt: dateNow,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      // Base (Basic Scarecrow ×0.8) duration accrues at the Sparrow speed while
      // the window is active, so the AOE frees up sooner than the raw seconds.
      const baseDurationMs = pumpkinHarvestSeconds * 0.8 * 1000;
      expect(aoe["Basic Scarecrow"]?.["0"]?.["-2"]).toBeCloseTo(
        dateNow + baseDurationMs / CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
        5,
      );
    });

    it("does not apply 20% speed boost if the AOE has already been used", () => {
      const pumpkinHarvestSeconds = CROPS["Pumpkin"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Pumpkin",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
          aoe: {
            "Basic Scarecrow": {
              "0": {
                "-2": dateNow + pumpkinHarvestSeconds * 0.8,
              },
            },
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(pumpkinHarvestSeconds);
    });

    it("does apply 20% speed boost if the AOE is available", () => {
      const pumpkinHarvestSeconds = CROPS["Pumpkin"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Pumpkin",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
          aoe: {
            "Basic Scarecrow": {
              "0": {
                "-2": dateNow,
              },
            },
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(pumpkinHarvestSeconds * 0.8);
    });

    it("does not apply boost with Basic Scarecrow if not basic crop", () => {
      const beetrootHarvestSeconds = CROPS["Beetroot"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Beetroot",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(beetrootHarvestSeconds);
    });

    it("does not apply boost with Basic Scarecrow placed, if plot is outside AOE", () => {
      const sunflowerHarvestSeconds = CROPS["Sunflower"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: Date.now() - 100,
                readyAt: Date.now() - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 2, y: -2 },
        createdAt: dateNow,
      });

      expect(time).toEqual(sunflowerHarvestSeconds);
    });

    it("does not apply boost with Basic Scarecrow placed, if it was moved within 10min", () => {
      const sunflowerHarvestSeconds = CROPS["Sunflower"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow,
                readyAt: dateNow + 600000,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(sunflowerHarvestSeconds);
    });

    it("applies a 25% speed boost with Kernaldo placed", () => {
      const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Corn",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            Kernaldo: [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.75);
    });

    it("applies a 2x speed boost with Giant Zucchini placed", () => {
      const baseHarvestSeconds = CROPS["Zucchini"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Zucchini",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Giant Zucchini": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.5);
    });

    it("does not reduce the base plot time for Harvest Hourglass under SPEED_BOOSTS (applied as a speed window)", () => {
      const dateNow = Date.now();
      const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Corn",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Harvest Hourglass": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds);
    });

    it("excludes the Harvest Hourglass from greenhouse crops under SPEED_BOOSTS (windowed)", () => {
      const dateNow = Date.now();

      // Greenhouse crops joined the windowed model: the hourglass applies live
      // via getGreenhouseBoostWindows, so it's no longer baked here either.
      const { multiplier, boostsUsed } = getCropTime({
        crop: "Rice",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Harvest Hourglass": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
      });

      expect(multiplier).toEqual(1);
      expect(boostsUsed).not.toContainEqual({
        name: "Harvest Hourglass",
        value: "x0.75",
      });
    });

    it("does not reduce the base plot time for a totem under SPEED_BOOSTS (applied as a speed window)", () => {
      const dateNow = Date.now();
      const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;

      const { time } = getCropPlotTime({
        crop: "Corn",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Super Totem": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds);
    });

    it("excludes the totems from greenhouse crops under SPEED_BOOSTS (windowed)", () => {
      const dateNow = Date.now();

      const { multiplier, boostsUsed } = getCropTime({
        crop: "Rice",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Super Totem": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
      });

      expect(multiplier).toEqual(1);
      expect(boostsUsed).not.toContainEqual({
        name: "Super Totem",
        value: "x0.5",
      });
    });

    it("applies a +5% speed boost with Green Thumb skill", () => {
      const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Corn",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Green Thumb": 1,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.95);
    });

    it("applies a +10% speed boost on advanced crops with Strong Roots skill", () => {
      const baseHarvestSeconds = CROPS["Radish"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Radish",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Strong Roots": 1,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.9);
    });

    it("does not apply a +10% speed boost on Sunflower with Strong Roots skill", () => {
      const baseHarvestSeconds = CROPS["Sunflower"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Strong Roots": 1,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds);
    });

    it("applies a +6% speed boost with rank 2 Green Thumb skill", () => {
      const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Corn",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Green Thumb": 2,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.94);
    });

    it("applies a +7.5% speed boost with rank 3 Green Thumb skill", () => {
      const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Corn",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Green Thumb": 3,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.925);
    });

    it("neutralises a rank 3 Green Thumb on the Saltwort event crop (x0.95, not x0.925)", () => {
      const baseHarvestSeconds = CROPS["Saltwort"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Saltwort",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Green Thumb": 3,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      // Saltwort (event crop) uses the rank-1 multiplier (x0.95); Corn above
      // (a non-event crop) still gets the full rank-3 x0.925.
      expect(time).toEqual(baseHarvestSeconds * 0.95);
    });

    it("applies a +12.5% speed boost on advanced crops with rank 2 Strong Roots skill", () => {
      const baseHarvestSeconds = CROPS["Radish"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Radish",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Strong Roots": 2,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.875);
    });

    it("applies a +15% speed boost on advanced crops with rank 3 Strong Roots skill", () => {
      const baseHarvestSeconds = CROPS["Radish"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Radish",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Strong Roots": 3,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds * 0.85);
    });

    it("does not apply a rank 3 Strong Roots speed boost on Sunflower", () => {
      const baseHarvestSeconds = CROPS["Sunflower"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Strong Roots": 3,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds);
    });

    it("does not reduce the base plot time for Sunshower under SPEED_BOOSTS (applied as a speed window)", () => {
      const baseHarvestSeconds = CROPS["Sunflower"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          calendar: {
            dates: [],
            sunshower: {
              startedAt: new Date().getTime(),
              triggeredAt: dateNow,
            },
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds);
    });

    it("does not reduce the base plot time for Sparrow Shrine (applied as a speed window at read time)", () => {
      const baseHarvestSeconds = CROPS["Sunflower"].harvestSeconds;
      const { time } = getCropPlotTime({
        crop: "Sunflower",
        game: {
          ...FARM_WITH_PLOTS,
          collectibles: {
            "Sparrow Shrine": [
              {
                id: "123",
                coordinates: { x: -1, y: -1 },
                createdAt: dateNow - 100,
                readyAt: dateNow - 100,
              },
            ],
          },
        },
        plot: { ...plot, x: 0, y: -3 },
        createdAt: dateNow,
      });

      expect(time).toEqual(baseHarvestSeconds);
    });
  });

  it("should throw an error if trying to harvest a crop if its plot is frozen", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          calendar: {
            dates: [],
            greatFreeze: {
              startedAt: new Date().getTime(),
              triggeredAt: Date.now() - 1000,
            },
          },
          inventory: {
            "Sunflower Seed": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          item: "Sunflower Seed",
          index: "1",
          cropId: "123",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot is affected by greatFreeze");
  });

  it("reduces wheat harvest time in half if Solflare Aegis is worn", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            secondaryTool: "Solflare Aegis",
          },
        },
        inventory: {
          "Wheat Seed": new Decimal(1),
        },
        season: {
          season: "summer",
          startedAt: 0,
        },
        collectibles: {},
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Wheat Seed",
      },
    });

    // Should be twice as fast! (Planted in the past)
    const plantTime = CROPS.Wheat.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(plantTime * 0.5);
  });

  it("reduces Barley harvest time in half if Autumn's Embrace is worn", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            secondaryTool: "Autumn's Embrace",
          },
        },
        inventory: {
          "Barley Seed": new Decimal(1),
        },
        season: {
          season: "autumn",
          startedAt: 0,
        },
        collectibles: {},
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: Object.keys(GAME_STATE.crops)[0],

        item: "Barley Seed",
      },
    });

    // Should be twice as fast! (Planted in the past)
    const plantTime = CROPS.Barley.harvestSeconds * 1000;

    const crops = state.crops;

    expect(crops).toBeDefined();
    const plantedAt = crops[firstId].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow);
    expect(crops[firstId].crop?.baseDurationMs).toBe(plantTime * 0.5);
  });

  describe("SPEED_BOOSTS feature gate", () => {
    const originalNetwork = CONFIG.NETWORK;
    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    const plantSunflowerWithSparrow = () =>
      plant({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunflower Seed": new Decimal(1) },
          collectibles: {
            "Sparrow Shrine": [
              {
                id: "1",
                coordinates: { x: 3, y: 3 },
                createdAt: dateNow,
                readyAt: dateNow,
              },
            ],
          },
        },
        createdAt: dateNow,
        action: {
          type: "seed.planted",
          cropId: "123",
          index: Object.keys(GAME_STATE.crops)[0],
          item: "Sunflower Seed",
        },
      });

    it("uses the speed-rate model when the flag is on (amoy)", () => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
      const crop = plantSunflowerWithSparrow().crops[firstId].crop;

      // True plant time + baseDurationMs (Sparrow excluded from the base).
      expect(crop?.plantedAt).toBe(dateNow);
      expect(crop?.baseDurationMs).toBe(CROPS.Sunflower.harvestSeconds * 1000);
      expect(crop?.boostedTime).toBeUndefined();
    });

    it("falls back to legacy discount-at-start when the flag is off (mainnet)", () => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
      const crop = plantSunflowerWithSparrow().crops[firstId].crop;

      // Sparrow folded in as ×0.75: back-dated plantedAt + boostedTime, no baseDurationMs.
      const sunflowerTime = CROPS.Sunflower.harvestSeconds * 1000;
      expect(crop?.baseDurationMs).toBeUndefined();
      expect(crop?.boostedTime).toBe(sunflowerTime * 0.25);
      expect(crop?.plantedAt).toBe(dateNow - sunflowerTime * 0.25);
    });
  });
});
