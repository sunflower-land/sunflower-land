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

const dateNow = Date.now();

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
  crops: {
    0: {
      createdAt: dateNow,
      x: 0,
      y: 0,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
      },
    },
  },
};

const firstCropId = Object.keys(GAME_STATE.crops)[0];

describe("plant", () => {
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
      }),
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
      }),
    ).toThrow("Plot does not exist");
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
      }),
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
      }),
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
      }),
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
      }),
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
        }),
      }),
    );
  });

  it("does not plant a non-seasonal seed", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            "Cauliflower Seed": new Decimal(1),
            "Water Well": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
        },
        action: {
          type: "seed.planted",
          cropId: "123",
          index: "0",

          item: "Cauliflower Seed",
        },
      }),
    ).toThrow("This seed is not available in this season");
  });

  it("plants a normal cauliflower", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Cauliflower Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
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
      }),
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
        season: {
          season: "winter",
          startedAt: 0,
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
      }),
    );
  });

  it("reduces wheat harvest time in half if Solflare Aegis is worn", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
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
    const plantedAt =
      (crops as Record<number, CropPlot>)[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - plantTime * 0.5);
  });

  it("reduces Barley harvest time in half if Autumn's Embrace is worn", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
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
    const plantedAt =
      (crops as Record<number, CropPlot>)[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - plantTime * 0.5);
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
    const carrotTime = CROPS.Carrot.harvestSeconds * 1000;

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

    const sunflowerTime = CROPS.Sunflower.harvestSeconds * 1000;

    const plots = state.crops;

    expect(plots).toBeDefined();
    const plantedAt =
      (plots as Record<number, CropPlot>)[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - sunflowerTime * 0.1);
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
        season: {
          season: "winter",
          startedAt: 0,
        },
        crops: {
          0: {
            createdAt: dateNow,
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
      dateNow - 0.1 * CROPS.Parsnip.harvestSeconds * 1000,
    );
  });
});

describe("getCropTime", () => {
  const plot = GAME_STATE.crops[firstCropId];

  it("applies a 5% speed boost with Cultivator skill", () => {
    const time = getCropPlotTime({
      crop: "Carrot",
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Cultivator: 1 } },
      },
      plot,
    });

    expect(time).toEqual(57 * 60);
  });

  it("reduces in 20% carrot time when Bumpkin is wearing Carrot Amulet", () => {
    const time = getCropPlotTime({
      crop: "Carrot",
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
    const carrotHarvestSeconds = CROPS["Carrot"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Carrot",
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
    const cabbageHarvestSeconds = CROPS["Cabbage"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Cabbage",
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
      plot,
    });

    expect(time).toEqual(cabbageHarvestSeconds * 0.5);
  });

  it("applies a 25% speed boost with Obie placed", () => {
    const baseHarvestSeconds = CROPS["Eggplant"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Eggplant",
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
    const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Corn",
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
      plot,
    });

    expect(time).toEqual(baseHarvestSeconds * 0.75);
  });

  it("gives +0.5 Yam when Giant Yam is placed and ready", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        island: {
          type: "desert",
        },
        inventory: {
          "Yam Seed": new Decimal(1),
        },
        season: {
          season: "autumn",
          startedAt: 0,
        },
        collectibles: {
          "Giant Yam": [
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
        item: "Yam Seed",
      },
    });

    const plots = state.crops;

    expect(plots).toBeDefined();
    expect((plots as Record<number, CropPlot>)[0].crop).toEqual(
      expect.objectContaining({
        name: "Yam",
        plantedAt: expect.any(Number),
      }),
    );
  });

  it("applies a 2x speed boost with Giant Zucchini placed", () => {
    const baseHarvestSeconds = CROPS["Zucchini"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Zucchini",
      game: {
        ...TEST_FARM,
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
      plot,
    });

    expect(time).toEqual(baseHarvestSeconds * 0.5);
  });

  it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Sunflower", () => {
    const sunflowerHarvestSeconds = CROPS["Sunflower"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Sunflower",
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
    const potatoHarvestSeconds = CROPS["Potato"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Potato",
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

    expect(time).toEqual(potatoHarvestSeconds * 0.8);
  });

  it("applies a 20% speed boost with Basic Scarecrow placed, plot is within AOE and crop is Pumpkin", () => {
    const pumpkinHarvestSeconds = CROPS["Pumpkin"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Pumpkin",
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

    expect(time).toEqual(pumpkinHarvestSeconds * 0.8);
  });

  it("does not apply boost with Basic Scarecrow if not basic crop", () => {
    const beetrootHarvestSeconds = CROPS["Beetroot"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Beetroot",
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

    expect(time).toEqual(beetrootHarvestSeconds);
  });

  it("does not apply boost with Basic Scarecrow placed, if plot is outside AOE", () => {
    const sunflowerHarvestSeconds = CROPS["Sunflower"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Sunflower",
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
      plot: { ...plot, x: 2, y: -2 },
    });

    expect(time).toEqual(sunflowerHarvestSeconds);
  });

  it("does not apply boost with Basic Scarecrow placed, if it was moved within 10min", () => {
    const sunflowerHarvestSeconds = CROPS["Sunflower"].harvestSeconds;

    const time = getCropPlotTime({
      crop: "Sunflower",
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
        season: {
          season: "spring",
          startedAt: 0,
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
      }),
    );
  });

  it("applies a +5% speed boost with Green Thumb skill", () => {
    const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Corn",
      game: {
        ...TEST_FARM,
        collectibles: {},
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Green Thumb": 1,
          },
        },
      },
      plot: { ...plot, x: 0, y: -3 },
    });

    expect(time).toEqual(baseHarvestSeconds * 0.95);
  });

  it("applies a +10% speed boost on advanced crops with Strong Roots skill", () => {
    const baseHarvestSeconds = CROPS["Radish"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Radish",
      game: {
        ...TEST_FARM,
        collectibles: {},
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Strong Roots": 1,
          },
        },
      },
      plot: { ...plot, x: 0, y: -3 },
    });

    expect(time).toEqual(baseHarvestSeconds * 0.9);
  });

  it("does not apply a +10% speed boost on Sunflower with Strong Roots skill", () => {
    const baseHarvestSeconds = CROPS["Sunflower"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Sunflower",
      game: {
        ...TEST_FARM,
        collectibles: {},
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Strong Roots": 1,
          },
        },
      },
      plot: { ...plot, x: 0, y: -3 },
    });

    expect(time).toEqual(baseHarvestSeconds);
  });

  it("applies a 2x speed boost with Sunshower", () => {
    const baseHarvestSeconds = CROPS["Sunflower"].harvestSeconds;
    const time = getCropPlotTime({
      crop: "Sunflower",
      game: {
        ...TEST_FARM,
        collectibles: {},
        calendar: {
          dates: [],
          sunshower: {
            startedAt: new Date().getTime(),
            triggeredAt: dateNow,
          },
        },
      },
      plot: { ...plot, x: 0, y: -3 },
    });

    expect(time).toEqual(baseHarvestSeconds * 0.5);
  });
});

describe("isPlotFertile", () => {
  it("cannot plant on the 19th field if well is not placed down, regardless of well level", () => {
    let counter = 1;
    const fakePlot = () => ({
      createdAt: dateNow + counter++,
      x: 1,
      y: 1,
    });
    const isFertile = isPlotFertile({
      island: "spring",
      buildings: {
        "Water Well": [],
      },
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
        10: fakePlot(),
        11: fakePlot(),
        12: fakePlot(),
        13: fakePlot(),
        14: fakePlot(),
        15: fakePlot(),
        16: fakePlot(),
        17: fakePlot(),
        18: fakePlot(),
      },
      plotIndex: "18",
      wellLevel: 3,
    });

    expect(isFertile).toBeFalsy();
  });

  it("cannot plant on 26th field if 2 wells are not avilable", () => {
    let counter = 1;
    const fakePlot = () => ({
      createdAt: dateNow + counter++,
      x: 1,
      y: 1,
    });
    const isFertile = isPlotFertile({
      island: "spring",
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
        26: fakePlot(), // 27th
      },
      plotIndex: "26",
      wellLevel: 1,
    });

    expect(isFertile).toBeFalsy();
  });

  it("can plant on 6th field without a well", () => {
    const fakePlot = {
      createdAt: dateNow,
      x: 1,
      y: 1,
    };
    const isFertile = isPlotFertile({
      island: "spring",
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
      wellLevel: 1,
      buildings: {},
    });
    expect(isFertile).toBeTruthy();
  });
});

describe("getPlantedAt", () => {
  it("returns normal planted at if time wrap is expired", () => {
    const now = dateNow;

    const time = getPlantedAt({
      crop: "Sunflower",
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
        x: 0,
        y: -2,
      },
    });

    expect(time).toEqual(now);
  });

  it("crop replenishes faster with time warp", () => {
    const now = dateNow;

    const time = getPlantedAt({
      crop: "Sunflower",
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
        x: 0,
        y: -2,
      },
    });

    expect(time).toEqual(now - 30 * 1000);
  });

  it("crop replenishes faster with Super Totem", () => {
    const now = dateNow;

    const time = getPlantedAt({
      crop: "Sunflower",
      game: {
        ...TEST_FARM,
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
      createdAt: now,
      plot: {
        createdAt: now,
        x: 0,
        y: -2,
      },
    });

    expect(time).toEqual(now - 30 * 1000);
  });

  it("does not apply a boost if the Super Totem has expired", () => {
    const now = dateNow;
    const nineDaysAgo = now - 9 * 24 * 60 * 60 * 1000;

    const time = getPlantedAt({
      crop: "Corn",
      game: {
        ...TEST_FARM,
        collectibles: {
          "Super Totem": [
            {
              id: "123",
              createdAt: nineDaysAgo,
              coordinates: { x: 1, y: 1 },
              readyAt: nineDaysAgo,
            },
          ],
        },
      },
      createdAt: now,
      plot: {
        createdAt: now,
        x: 0,
        y: -2,
      },
    });

    expect(time).toEqual(now);
  });

  it("doesn't stack Super Totem and Time Warp totem", () => {
    const now = dateNow;

    const time = getPlantedAt({
      crop: "Sunflower",
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
      createdAt: now,
      plot: {
        createdAt: now,
        x: 0,
        y: -2,
      },
    });

    expect(time).toEqual(now - 30 * 1000);
  });

  it("applies the harvest hourglass boost of -25% crop growth time for 6 hours", () => {
    const now = dateNow;
    const baseHarvestSeconds = CROPS["Corn"].harvestSeconds;

    const time = getPlantedAt({
      crop: "Corn",
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
        x: 0,
        y: -2,
      },
    });

    const boost = baseHarvestSeconds * 0.25 * 1000;

    expect(time).toEqual(now - boost);
  });

  it("does not apply a boost if the harvest hourglass has expired", () => {
    const now = dateNow;
    const sevenHoursAgo = now - 7 * 60 * 60 * 1000;

    const time = getPlantedAt({
      crop: "Corn",
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
        x: 0,
        y: -2,
      },
    });

    expect(time).toEqual(now);
  });
});
