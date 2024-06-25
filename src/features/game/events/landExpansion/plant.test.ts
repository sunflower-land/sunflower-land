import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { GameState, CropPlot } from "../../types/game";
import {
  getCropPlotTime,
  getCropYieldAmount,
  getPlantedAt,
  isPlotFertile,
  plant,
} from "./plant";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
  crops: {
    0: {
      createdAt: Date.now(),
      height: 1,
      width: 1,
      x: 0,
      y: 0,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
    },
  },
};

const firstCropId = Object.keys(GAME_STATE.crops)[0];

describe("plant", () => {
  const dateNow = Date.now();

  it("does not plant on non-existent plot", () => {
    const { inventory } = GAME_STATE;
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "-1",

          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it("does not plant on plot with negative plot index", () => {
    const { inventory } = GAME_STATE;
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "1.2",

          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it.skip("does not plant if water well does not exist", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {},
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "1",

          item: "Sunflower Seed",
        },
      })
    ).toThrow("Water Well does not exist");
  });

  it("does not plant on non-existent plot", () => {
    const { inventory } = GAME_STATE;
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "200000",

          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it("does not plant if crop already exists", () => {
    const { inventory, crops: plots } = GAME_STATE;
    const plot = (plots as Record<number, CropPlot>)[0];

    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow,
                amount: 1,
              },
            },
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",

          item: "Sunflower Seed",
        },
      })
    ).toThrow("Crop is already planted");
  });

  it("does not plant an invalid item", () => {
    const { inventory } = GAME_STATE;
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",

          item: "Pickaxe",
        },
      })
    ).toThrow("Not a seed");
  });

  it("does not plant if user does not have seeds", () => {
    const { inventory } = GAME_STATE;
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",

          item: "Sunflower Seed",
        },
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const seedsAmount = new Decimal(5);

    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": seedsAmount,
          "Water Well": new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Sunflower Seed",
      },
    });

    const plots = state.crops;

    expect(state.inventory["Sunflower Seed"]).toEqual(seedsAmount.minus(1));
    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0]).toEqual(
      expect.objectContaining({
        crop: expect.objectContaining({
          name: "Sunflower",
          plantedAt: expect.any(Number),
          amount: 1,
        }),
      })
    );
  });

  it("plants a normal cauliflower", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Cauliflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0].crop).toEqual(
      expect.objectContaining({
        name: "Cauliflower",
        plantedAt: expect.any(Number),
        amount: 1,
      })
    );
  });

  it("plants a special cauliflower", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
          "Golden Cauliflower": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        collectibles: {
          "Golden Cauliflower": [
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
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Cauliflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0].crop).toEqual(
      expect.objectContaining({
        name: "Cauliflower",
        plantedAt: expect.any(Number),
        amount: 2,
      })
    );
  });

  it("plants a normal parsnip", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Parsnip Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0].crop).toEqual(
      expect.objectContaining({
        name: "Parsnip",
        plantedAt: expect.any(Number),
        amount: 1,
      })
    );
  });

  it("plants a special parsnip", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          // "Mysterious Parsnip": new Decimal(1),
          "Water Well": new Decimal(1),
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
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Parsnip Seed",
      },
      createdAt: dateNow,
    });

    // Should be twice as fast! (Planted in the past)
    const parsnipTime = CROPS().Parsnip.harvestSeconds * 1000;

    const plots = state.crops;

    expect(plots).toBeDefined();
    const plantedAt =
      (plots as Record<number, CropPlot>)[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - parsnipTime * 0.5);
  });
  it("yields 20% more parsnip if bumpkin is equipped with Parsnip Tool", () => {
    const PARSNIP_STATE: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, tool: "Parsnip" },
      },
    };

    const state = plant({
      state: {
        ...PARSNIP_STATE,
        crops: {
          "0": {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 1,
            y: 1,
          },
        },
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Parsnip Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields 10% more with bumpkin skill Master Farmer", () => {
    const SKILL_STATE: GameState = {
      ...TEST_FARM,
      crops: {
        "0": {
          createdAt: Date.now(),
          height: 1,
          width: 1,
          x: 1,
          y: 1,
        },
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { ...INITIAL_BUMPKIN.skills, "Master Farmer": 1 },
      },
    };

    const state = plant({
      state: {
        ...SKILL_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Sunflower Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.1);
  });
  it("grows faster with a Nancy placed and ready", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          Nancy: new Decimal(1),
          "Water Well": new Decimal(1),
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
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Carrot Seed",
      },
      createdAt: dateNow,
    });

    // Should be twice as fast! (Planted in the past)
    const carrotTime = CROPS().Carrot.harvestSeconds * 1000;

    const plots = state.crops;

    expect(plots).toBeDefined();
    const plantedAt = plots[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - carrotTime * 0.15);
  });

  it("grows faster if Lunar calendar is placed.", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
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
        index: "0",

        item: "Sunflower Seed",
      },
    });

    const sunflowerTime = CROPS().Sunflower.harvestSeconds * 1000;

    const plots = state.crops;

    expect(plots).toBeDefined();
    const plantedAt =
      (plots as Record<number, CropPlot>)[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - sunflowerTime * 0.1);
  });

  it("yields more crop with a scarecrow", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          Scarecrow: new Decimal(1),
          "Water Well": new Decimal(1),
        },
        collectibles: {
          Scarecrow: [
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
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Carrot Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("throws an error if the player doesnt have a bumpkin", async () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
          inventory: {
            "Carrot Seed": new Decimal(1),
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",

          item: "Carrot Seed",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("yields +0.2 if Scary Mike is placed, plot is within AoE and planting Carrot", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Carrot Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Scary Mike is placed, plot is within AoE and planting Cabbage", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cabbage Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Cabbage Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Scary Mike is placed, plot is within AoE and planting Beetroot", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Beetroot Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Beetroot Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Scary Mike is placed, plot is within AoE and planting Cauliflower", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Cauliflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Scary Mike is placed, plot is within AoE and planting Parsnip", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Parsnip Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("does not give boost if Scary Mike is placed, plot is within AoE and planting Sunflower", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Sunflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("does not give boost if Scary Mike is placed, plot is NOT within AoE and planting Cauliflower", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
          "Scary Mike": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -6,
          },
        },
        collectibles: {
          "Scary Mike": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Cauliflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("yields +0.2 if Laurie the Chuckle Crow is placed, plot is within AoE and planting Eggplant", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Eggplant Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Eggplant Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Laurie the Chuckle Crow is placed, plot is within AoE and planting Radish", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Radish Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Radish Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Laurie the Chuckle Crow is placed, plot is within AoE and planting Wheat", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Wheat Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Wheat Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Laurie the Chuckle Crow is placed, plot is within AoE and planting Kale", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Kale Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Kale Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("yields +0.2 if Laurie the Chuckle Crow is placed, plot is within AoE and planting Corn", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Corn Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Corn Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("does not give boost if Laurie the Chuckle Crow is placed, plot is within AoE and planting Cauliflower", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Sunflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("does not give boost if Laurie the Chuckle Crow is placed, plot is NOT within AoE and planting Cauliflower", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
          "Laurie the Chuckle Crow": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -6,
          },
        },
        collectibles: {
          "Laurie the Chuckle Crow": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Cauliflower Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("yields +1 if Queen Cornelia is placed, plot is within AoE and planting Corn", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Corn Seed": new Decimal(1),
          "Queen Cornelia": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -1,
          },
        },
        collectibles: {
          "Queen Cornelia": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Corn Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(2);
  });

  it("does not boost crop if Queen Cornelia is placed, plot is within AoE but planting Radish", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Radish Seed": new Decimal(1),
          "Queen Cornelia": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Queen Cornelia": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Radish Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("does not give boost if Queen Cornelia is placed, plot is NOT within AoE and planting Corn", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Corn Seed": new Decimal(1),
          "Queen Cornelia": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -6,
          },
        },
        collectibles: {
          "Queen Cornelia": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 0, y: 0 },
              // ready at < now
              readyAt: dateNow - 12 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",
        item: "Corn Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("yields +0.5 pumpkin with Freya Fox placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Pumpkin Seed": new Decimal(1),
          "Freya Fox": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        collectibles: {
          "Freya Fox": [
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
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",

        item: "Pumpkin Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.5);
  });

  it("yields +0.1 Corn with Poppy placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Corn Seed": new Decimal(1),
          Poppy: new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          Poppy: [
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
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Corn Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.1);
  });

  it("applies the Tofu Mask Boost", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Tofu Mask",
          },
        },
        inventory: {
          "Soybean Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Soybean Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.1);
  });

  it("applies a bud yield boost", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        buds: {
          1: {
            aura: "No Aura",
            colour: "Green",
            type: "Castle",
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

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.3);
  });

  it("applies a bud speed boost", () => {
    const state: GameState = plant({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
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
      dateNow - 0.1 * CROPS().Parsnip.harvestSeconds * 1000
    );
  });
});

describe("getCropTime", () => {
  const dateNow = Date.now();
  const plot = GAME_STATE.crops[firstCropId];

  it("applies a 5% speed boost with Cultivator skill", () => {
    const time = getCropPlotTime({
      crop: "Carrot",
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Cultivator: 1 } },
      },
      buds: {},
      plot,
      inventory: {},
    });

    expect(time).toEqual(57 * 60);
  });

  it("reduces in 20% carrot time when Bumpkin is wearing Carrot Amulet", () => {
    const time = getCropPlotTime({
      crop: "Carrot",
      inventory: {},
      buds: {},
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: { ...INITIAL_BUMPKIN.equipped, necklace: "Carrot Amulet" },
        },
      },
    });

    expect(time).toEqual(60 * 60 * 0.8);
  });

  it("applies a 10% speed boost with Lunar Calendar placed.", () => {
    const carrotHarvestSeconds = CROPS()["Carrot"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Carrot",
      inventory: {},
      buds: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Lunar Calendar": [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      plot,
    });

    expect(time).toEqual(carrotHarvestSeconds * 0.9);
  });

  it("grows cabbage twice as fast with Cabbage Girl placed.", () => {
    const cabbageHarvestSeconds = CROPS()["Cabbage"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Cabbage",
      buds: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Cabbage Girl": [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      inventory: {},
      plot,
    });

    expect(time).toEqual(cabbageHarvestSeconds * 0.5);
  });

  it("applies a 25% speed boost with Obie placed", () => {
    const baseHarvestSeconds = CROPS()["Eggplant"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Eggplant",
      inventory: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          Obie: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      buds: {},
      plot,
    });

    expect(time).toEqual(baseHarvestSeconds * 0.75);
  });

  it("applies the eggplant boost when wearing the onesie", () => {
    const amount = getCropYieldAmount({
      crop: "Eggplant",
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            onesie: "Eggplant Onesie",
          },
        },
      },
      plot,
    });

    expect(amount).toEqual(1.1);
  });

  it("applies the corn boost when wearing the corn onesie", () => {
    const amount = getCropYieldAmount({
      crop: "Corn",
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            onesie: "Corn Onesie",
          },
        },
      },
      plot,
    });

    expect(amount).toEqual(1.1);
  });

  it("applies a 25% speed boost with Kernaldo placed", () => {
    const baseHarvestSeconds = CROPS()["Corn"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Corn",
      inventory: {},
      game: {
        ...TEST_FARM,
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
      buds: {},
      plot,
    });

    expect(time).toEqual(baseHarvestSeconds * 0.75);
  });

  it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Sunflower", () => {
    const sunflowerHarvestSeconds = CROPS()["Sunflower"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Sunflower",
      inventory: {},
      buds: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Basic Scarecrow": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      plot: { ...plot, x: 0, y: -2 },
    });

    expect(time).toEqual(sunflowerHarvestSeconds * 0.8);
  });

  it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Potato", () => {
    const potatoHarvestSeconds = CROPS()["Potato"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Potato",
      inventory: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Basic Scarecrow": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      plot: { ...plot, x: 0, y: -2 },
      buds: {},
    });

    expect(time).toEqual(potatoHarvestSeconds * 0.8);
  });

  it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Pumpkin", () => {
    const pumpkinHarvestSeconds = CROPS()["Pumpkin"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Pumpkin",
      inventory: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Basic Scarecrow": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      buds: {},
      plot: { ...plot, x: 0, y: -2 },
    });

    expect(time).toEqual(pumpkinHarvestSeconds * 0.8);
  });

  it("does not apply boost with Basic Scarecrow if not basic crop", () => {
    const beetrootHarvestSeconds = CROPS()["Beetroot"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Beetroot",
      inventory: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Basic Scarecrow": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      buds: {},
      plot: { ...plot, x: 0, y: -2 },
    });

    expect(time).toEqual(beetrootHarvestSeconds);
  });

  it("does not apply boost with Basic Scarecrow placed, if plot is outside AOE", () => {
    const sunflowerHarvestSeconds = CROPS()["Sunflower"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Sunflower",
      inventory: {},
      game: {
        ...TEST_FARM,
        collectibles: {
          "Basic Scarecrow": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow - 100,
              readyAt: dateNow - 100,
            },
          ],
        },
      },
      buds: {},
      plot: { ...plot, x: 2, y: -2 },
    });

    expect(time).toEqual(sunflowerHarvestSeconds);
  });

  it("does not apply boost with Basic Scarecrow placed, if it was moved within 10min", () => {
    const sunflowerHarvestSeconds = CROPS()["Sunflower"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Sunflower",
      inventory: {},
      game: {
        ...TEST_FARM,
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
      buds: {},
      plot: { ...plot, x: 0, y: -3 },
    });

    expect(time).toEqual(sunflowerHarvestSeconds);
  });

  it("plants a normal soybean", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        island: {
          type: "desert",
        },
        inventory: {
          "Soybean Seed": new Decimal(1),
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",
        item: "Soybean Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0].crop).toEqual(
      expect.objectContaining({
        name: "Soybean",
        plantedAt: expect.any(Number),
        amount: 1,
      })
    );
  });

  it("adds +1 soybean with Soybliss placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        island: {
          type: "desert",
        },
        inventory: {
          "Soybean Seed": new Decimal(1),
        },
        collectibles: {
          Soybliss: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow - 10000,
              readyAt: dateNow - 10000,
              id: "123",
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "seed.planted",
        cropId: "123",
        index: "0",
        item: "Soybean Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0].crop).toEqual(
      expect.objectContaining({
        name: "Soybean",
        plantedAt: expect.any(Number),
        amount: 2,
      })
    );
  });
});

describe("isPlotFertile", () => {
  it("cannot plant on 18th field if a well is not available", () => {
    let counter = 1;
    const fakePlot = () => ({
      createdAt: Date.now() + counter++,
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    });
    const isFertile = isPlotFertile({
      crops: {
        0: fakePlot(),
        1: fakePlot(),
        2: fakePlot(),
        3: fakePlot(),
        4: fakePlot(),
        5: fakePlot(),
        6: fakePlot(),
        7: fakePlot(),
        8: fakePlot(),
        21: fakePlot(),
        32: fakePlot(),
        43: fakePlot(),
        54: fakePlot(),
        65: fakePlot(),
        76: fakePlot(),
        87: fakePlot(), //16th
        98: fakePlot(), // 17th
        99: fakePlot(), // 18th
        100: fakePlot(), // 19th
      },
      plotIndex: "99",
      buildings: {},
      bumpkin: { ...INITIAL_BUMPKIN },
    });

    expect(isFertile).toBeFalsy();
  });

  it("cannot plant on 25th field if 2 wells are not avilable", () => {
    let counter = 1;
    const fakePlot = () => ({
      createdAt: Date.now() + counter++,
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    });
    const isFertile = isPlotFertile({
      buildings: {
        "Water Well": [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
      bumpkin: { ...INITIAL_BUMPKIN },
      crops: {
        0: fakePlot(),
        1: fakePlot(),
        2: fakePlot(),
        3: fakePlot(),
        4: fakePlot(),
        5: fakePlot(),
        6: fakePlot(),
        7: fakePlot(),
        8: fakePlot(),
        9: fakePlot(),
        10: fakePlot(), //11th
        11: fakePlot(), // 12th
        12: fakePlot(),
        13: fakePlot(),
        14: fakePlot(),
        15: fakePlot(),
        16: fakePlot(),
        17: fakePlot(),
        18: fakePlot(),
        19: fakePlot(),
        20: fakePlot(),
        21: fakePlot(),
        22: fakePlot(),
        23: fakePlot(), // 24th
        24: fakePlot(), // 25th
        25: fakePlot(), // 26th
      },
      plotIndex: "25",
    });

    expect(isFertile).toBeFalsy();
  });

  it("can plant on 6th field without a well", () => {
    const fakePlot = {
      createdAt: Date.now(),
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    };
    const isFertile = isPlotFertile({
      crops: {
        0: fakePlot,
        1: fakePlot,
        2: fakePlot,
        3: fakePlot,
        4: fakePlot,
        5: fakePlot, //6th
        6: fakePlot,
        7: fakePlot,
        8: fakePlot,
        9: fakePlot,
        10: fakePlot,
        11: fakePlot,
      },
      plotIndex: "5",
      buildings: {},
      bumpkin: { ...INITIAL_BUMPKIN },
    });
    expect(isFertile).toBeTruthy();
  });

  it("can plant on 11th field if they have well", () => {
    const fakePlot = {
      createdAt: Date.now(),
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    };
    const isFertile = isPlotFertile({
      buildings: {
        "Water Well": [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
      bumpkin: { ...INITIAL_BUMPKIN },
      crops: {
        0: fakePlot,
        1: fakePlot,
        2: fakePlot,
        3: fakePlot,
        4: fakePlot,
        5: fakePlot,
        6: fakePlot,
        7: fakePlot,
        8: fakePlot,
        9: fakePlot,
        10: fakePlot, //11th
        11: fakePlot, // 12th
      },
      plotIndex: "8",
    });

    expect(isFertile).toBeTruthy();
  });
});

describe("getCropYield", () => {
  it("does not apply sir goldensnout boost outside AOE", () => {
    const amount = getCropYieldAmount({
      crop: "Sunflower",
      game: {
        ...TEST_FARM,
        collectibles: {
          "Sir Goldensnout": [
            {
              coordinates: { x: 6, y: 6 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      plot: { createdAt: 0, height: 1, width: 1, x: 2, y: 3 },
    });

    expect(amount).toEqual(1);
  });

  it("applies sir goldensnout boost inside AOE", () => {
    const amount = getCropYieldAmount({
      crop: "Sunflower",
      game: {
        ...TEST_FARM,
        collectibles: {
          "Sir Goldensnout": [
            {
              coordinates: { x: 6, y: 6 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      plot: { createdAt: 0, height: 1, width: 1, x: 5, y: 6 },
    });

    expect(amount).toEqual(1.5);
  });

  it("yields +3 when wearing Infernal Pitchfork", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            tool: "Infernal Pitchfork",
          },
        },
        inventory: {
          "Sunflower Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Sunflower Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(4);
  });

  it("yields +0.2 Carrots when Lab Grown Carrot is placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Lab Grown Carrot": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Carrot Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.2);
  });

  it("does not yield +0.2 Carrots when Lab Grown Carrot is not placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Carrot Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("yields +0.3 Pumpkins when Lab Grown Pumpkin is placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Pumpkin Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Lab Grown Pumpkin": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Pumpkin Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.3);
  });

  it("does not yield +0.3 Pumpkins when Lab Grown Pumpkin is not placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Pumpkin Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Pumpkin Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  it("yields +0.4 Radishes when Lab Grown Radish is placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Radish Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {
          "Lab Grown Radish": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Radish Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1.4);
  });

  it("does not yield +0.4 Radishes when Lab Grown Radish is not placed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Radish Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            height: 1,
            width: 1,
            x: 0,
            y: -2,
          },
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        cropId: "1",
        index: "0",

        item: "Radish Seed",
      },
      createdAt: Date.now(),
    });

    const plots = state.crops;

    expect(plots).toBeDefined();

    expect((plots as Record<number, CropPlot>)[0].crop?.amount).toEqual(1);
  });

  describe("getPlantedAt", () => {
    it("returns normal planted at if time wrap is expired", () => {
      const now = Date.now();

      const time = getPlantedAt({
        buds: {},
        crop: "Sunflower",
        inventory: {},
        game: {
          ...TEST_FARM,
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
        createdAt: now,
        plot: {
          createdAt: now,
          height: 1,
          width: 1,
          x: 0,
          y: -2,
        },
      });

      expect(time).toEqual(now);
    });

    it("crop replenishes faster with time warp", () => {
      const now = Date.now();

      const time = getPlantedAt({
        buds: {},
        crop: "Sunflower",
        inventory: {},
        game: {
          ...TEST_FARM,
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
        createdAt: now,
        plot: {
          createdAt: now,
          height: 1,
          width: 1,
          x: 0,
          y: -2,
        },
      });

      expect(time).toEqual(now - 30 * 1000);
    });

    it("applies the harvest hourglass boost of -25% crop growth time for 6 hours", () => {
      const now = Date.now();
      const baseHarvestSeconds = CROPS()["Corn"].harvestSeconds;

      const time = getPlantedAt({
        crop: "Corn",
        buds: {},
        inventory: {},
        game: {
          ...TEST_FARM,
          collectibles: {
            "Harvest Hourglass": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        plot: {
          createdAt: now,
          height: 1,
          width: 1,
          x: 0,
          y: -2,
        },
      });

      const boost = baseHarvestSeconds * 0.25 * 1000;

      expect(time).toEqual(now - boost);
    });

    it("does not apply a boost if the harvest hourglass has expired", () => {
      const now = Date.now();
      const sevenHoursAgo = now - 7 * 60 * 60 * 1000;

      const time = getPlantedAt({
        crop: "Corn",
        buds: {},
        inventory: {},
        game: {
          ...TEST_FARM,
          collectibles: {
            "Harvest Hourglass": [
              {
                id: "123",
                createdAt: sevenHoursAgo,
                coordinates: { x: 1, y: 1 },
                readyAt: sevenHoursAgo,
              },
            ],
          },
        },
        createdAt: now,
        plot: {
          createdAt: now,
          height: 1,
          width: 1,
          x: 0,
          y: -2,
        },
      });

      expect(time).toEqual(now);
    });
  });
});
