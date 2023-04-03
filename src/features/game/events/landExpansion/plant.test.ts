import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { GameState, CropPlot } from "../../types/game";
import { getCropTime, isPlotFertile, plant } from "./plant";

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
      },
    },
  },
};

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
    console.log(plantedAt);

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
});

describe("getCropTime", () => {
  it("applies a 5% speed boost with Cultivator skill", () => {
    const time = getCropTime(
      "Carrot",
      {},
      {},
      { ...INITIAL_BUMPKIN, skills: { Cultivator: 1 } }
    );

    expect(time).toEqual(57 * 60);
  });

  it("reduces in 20% carrot time when Bumpkin is wearing Carrot Amulet", () => {
    const time = getCropTime(
      "Carrot",
      {},
      {},
      {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, necklace: "Carrot Amulet" },
      }
    );

    expect(time).toEqual(60 * 60 * 0.8);
  });

  it("applies a 10% speed boost with Lunar Calendar placed.", () => {
    const carrotHarvestSeconds = CROPS()["Carrot"].harvestSeconds;
    const time = getCropTime(
      "Carrot",
      {},
      {
        "Lunar Calendar": [
          {
            id: "123",
            coordinates: { x: -1, y: -1 },
            createdAt: Date.now() - 100,
            readyAt: Date.now() - 100,
          },
        ],
      },
      { ...INITIAL_BUMPKIN }
    );

    expect(time).toEqual(carrotHarvestSeconds * 0.9);
  });

  it("grows cabbage twice as fast with Cabbage Girl placed.", () => {
    const cabbageHarvestSeconds = CROPS()["Cabbage"].harvestSeconds;
    const time = getCropTime(
      "Cabbage",
      {},
      {
        "Cabbage Girl": [
          {
            id: "123",
            coordinates: { x: -1, y: -1 },
            createdAt: Date.now() - 100,
            readyAt: Date.now() - 100,
          },
        ],
      },
      { ...INITIAL_BUMPKIN }
    );

    expect(time).toEqual(cabbageHarvestSeconds * 0.5);
  });
});

describe("isPlotFertile", () => {
  it("cannot plant on 16th field if a well is not available", () => {
    let counter = 1;
    const fakePlot = () => ({
      createdAt: Date.now() + counter++,
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    });
    const isFertile = isPlotFertile({
      gameState: {
        ...TEST_FARM,
        buildings: {},
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
        },
      },
      plotIndex: "87",
    });

    expect(isFertile).toBeFalsy();
  });

  it("cannot plant on 23rd field if 2 wells are not avilable", () => {
    let counter = 1;
    const fakePlot = () => ({
      createdAt: Date.now() + counter++,
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    });
    const isFertile = isPlotFertile({
      gameState: {
        ...TEST_FARM,
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
        },
      },
      plotIndex: "23",
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
      gameState: {
        ...TEST_FARM,
        buildings: {},
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
      },
      plotIndex: "5",
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
      gameState: {
        ...TEST_FARM,
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
      },
      plotIndex: "8",
    });

    expect(isFertile).toBeTruthy();
  });
});
