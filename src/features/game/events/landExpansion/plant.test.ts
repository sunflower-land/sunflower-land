import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import {
  GENESIS_LAND_EXPANSION,
  INITIAL_BUMPKIN,
  TEST_FARM,
} from "../../lib/constants";
import { GameState, LandExpansionPlot } from "../../types/game";
import { getCropTime, isPlotFertile, plant } from "./plant";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("plant", () => {
  const dateNow = Date.now();
  it("does not plant on a non existent expansion", () => {
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
          index: 0,
          expansionIndex: -1,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("does not plant on a an expansion with no plots", () => {
    const { inventory } = GAME_STATE;
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          expansions: [{ createdAt: 0, readyAt: 0 }],
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          index: 0,
          expansionIndex: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Expansion does not have any plots");
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
          index: -1,
          expansionIndex: 0,
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
          index: 1.2,
          expansionIndex: 0,
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
          index: 1,
          expansionIndex: 0,
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
          index: 200000,
          expansionIndex: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it("does not plant if crop already exists", () => {
    const { inventory } = GAME_STATE;
    const expansions = [...GAME_STATE.expansions];
    const expansion = expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            ...inventory,
            "Water Well": new Decimal(1),
          },
          expansions: [
            {
              ...expansion,
              plots: {
                0: {
                  ...plot,
                  crop: {
                    name: "Sunflower",
                    plantedAt: dateNow,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "seed.planted",
          index: 0,
          expansionIndex: 0,
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
          index: 0,
          expansionIndex: 0,
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
          index: 0,
          expansionIndex: 0,
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
        index: 0,
        expansionIndex: 0,
        item: "Sunflower Seed",
      },
    });

    const plots = state.expansions[0].plots;

    expect(state.inventory["Sunflower Seed"]).toEqual(seedsAmount.minus(1));
    expect(plots).toBeDefined();
    expect((plots as Record<number, LandExpansionPlot>)[0]).toEqual(
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
        index: 0,
        expansionIndex: 0,
        item: "Cauliflower Seed",
      },
    });

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    expect((plots as Record<number, LandExpansionPlot>)[0].crop).toEqual(
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
        index: 0,
        expansionIndex: 0,
        item: "Cauliflower Seed",
      },
    });

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    expect((plots as Record<number, LandExpansionPlot>)[0].crop).toEqual(
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
        index: 0,
        expansionIndex: 0,
        item: "Parsnip Seed",
      },
    });

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    expect((plots as Record<number, LandExpansionPlot>)[0].crop).toEqual(
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
        index: 0,
        expansionIndex: 0,
        item: "Parsnip Seed",
      },
      createdAt: dateNow,
    });

    // Should be twice as fast! (Planted in the past)
    const parnsipTime = CROPS().Parsnip.harvestSeconds * 1000;

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    const plantedAt =
      (plots as Record<number, LandExpansionPlot>)[0].crop?.plantedAt || 0;
    console.log(plantedAt);

    expect(plantedAt).toBe(dateNow - parnsipTime * 0.5);
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
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Water Well": new Decimal(1),
        },
        collectibles: {},
      },
      action: {
        type: "seed.planted",
        index: 0,
        expansionIndex: 0,
        item: "Parsnip Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();

    expect(
      (plots as Record<number, LandExpansionPlot>)[0].crop?.amount
    ).toEqual(1.2);
  });

  it("yields 10% more with bumpkin skill Master Farmer", () => {
    const SKILL_STATE: GameState = {
      ...TEST_FARM,
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
        index: 0,
        expansionIndex: 0,
        item: "Sunflower Seed",
      },
      createdAt: dateNow,
    });

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();

    expect(
      (plots as Record<number, LandExpansionPlot>)[0].crop?.amount
    ).toEqual(1.1);
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
        index: 0,
        expansionIndex: 0,
        item: "Carrot Seed",
      },
      createdAt: dateNow,
    });

    // Should be twice as fast! (Planted in the psat)
    const carrotTime = CROPS().Carrot.harvestSeconds * 1000;

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    const plantedAt = (plots as LandExpansionPlot[])[0].crop?.plantedAt || 0;

    expect(plantedAt).toBe(dateNow - carrotTime * 0.15);
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
        index: 0,
        expansionIndex: 0,
        item: "Carrot Seed",
      },
    });

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();

    expect(
      (plots as Record<number, LandExpansionPlot>)[0].crop?.amount
    ).toEqual(1.2);
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
          index: 0,
          expansionIndex: 0,
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
});

describe("isPlotFertile", () => {
  it("cannot plant on 16th field if a well is not avilable", () => {
    const fakePlot = {
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    };
    const isFertile = isPlotFertile({
      gameState: {
        ...TEST_FARM,
        buildings: {},
        expansions: [
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
              4: fakePlot,
              5: fakePlot,
              6: fakePlot,
              7: fakePlot, //16th
              8: fakePlot, // 17th
            },
          },
        ],
      },
      expansionIndex: 2,
      plotIndex: 7,
    });

    expect(isFertile).toBeFalsy();
  });

  it("cannot plant on 23rd field if 2 wells are not avilable", () => {
    const fakePlot = {
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
        expansions: [
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot, //11th
              3: fakePlot, // 12th
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
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
              10: fakePlot,
              11: fakePlot, // 24th
            },
          },
        ],
      },
      expansionIndex: 3,
      plotIndex: 11,
    });

    expect(isFertile).toBeFalsy();
  });

  it("can plant on 6th field without a well", () => {
    const fakePlot = {
      x: 1,
      y: 1,
      height: 1,
      width: 1,
    };
    const isFertile = isPlotFertile({
      gameState: {
        ...TEST_FARM,
        buildings: {},
        expansions: [
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot, //6th
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
        ],
      },
      expansionIndex: 1,
      plotIndex: 1,
    });
    expect(isFertile).toBeTruthy();
  });

  it("can plant on 11th field if they have well", () => {
    const fakePlot = {
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
        expansions: [
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot,
              3: fakePlot,
            },
          },
          {
            ...GENESIS_LAND_EXPANSION,
            plots: {
              0: fakePlot,
              1: fakePlot,
              2: fakePlot, //11th
              3: fakePlot, // 12th
            },
          },
        ],
      },
      expansionIndex: 2,
      plotIndex: 2,
    });

    expect(isFertile).toBeTruthy();
  });
});
