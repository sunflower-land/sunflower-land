import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { CROPS } from "features/game/types/crops";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  MAX_STAMINA,
  PLANT_STAMINA_COST,
} from "../../lib/constants";
import { GameState, LandExpansionPlot } from "../../types/game";
import { plant } from "./plant";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("plant", () => {
  it("does not plant on a non existent expansion", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
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
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          expansions: [{ createdAt: 0, readyAt: 0 }],
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
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "seed.planted",
          index: -1,
          expansionIndex: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it("does not plant on non-integer plot", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "seed.planted",
          index: 1.2,
          expansionIndex: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it("does not plant on non-existent plot", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
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
    const expansions = [...GAME_STATE.expansions];
    const expansion = expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    expect(() =>
      plant({
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
                    plantedAt: Date.now(),
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
    expect(() =>
      plant({
        state: GAME_STATE,
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
    expect(() =>
      plant({
        state: GAME_STATE,
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

    const plantedAt =
      (plots as Record<number, LandExpansionPlot>)[0].crop?.plantedAt || 0;

    // Time should be now (+ a couple ms)
    expect(plantedAt + 10).toBeGreaterThan(Date.now());
  });

  it("plants a special parsnip", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Parsnip Seed": new Decimal(1),
          "Mysterious Parsnip": new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        index: 0,
        expansionIndex: 0,
        item: "Parsnip Seed",
      },
    });

    // Should be twice as fast! (Planted in the past)
    const parnsipTime = CROPS().Parsnip.harvestSeconds * 1000;

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    const plantedAt =
      (plots as Record<number, LandExpansionPlot>)[0].crop?.plantedAt || 0;

    // Offset 5 ms for CPU time
    expect(plantedAt - 5).toBeLessThan(Date.now() - parnsipTime * 0.5);
  });

  it("grows faster with a Nancy", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          Nancy: new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        index: 0,
        expansionIndex: 0,
        item: "Carrot Seed",
      },
    });

    // Should be twice as fast! (Planted in the psat)
    const carrotTime = CROPS().Carrot.harvestSeconds * 1000;

    const plots = state.expansions[0].plots;

    expect(plots).toBeDefined();
    const plantedAt = (plots as LandExpansionPlot[])[0].crop?.plantedAt || 0;

    // Offset 5 ms for CPU time
    expect(plantedAt - 5).toBeLessThan(Date.now() - carrotTime * 0.15);
  });

  it("yields more crop with a scarecrow", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Carrot Seed": new Decimal(1),
          Scarecrow: new Decimal(1),
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

    // Offset 5 ms for CPU time
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

  it("requires player has enough stamina", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            stamina: {
              value: 0,
              replenishedAt: Date.now(),
            },
          },
          inventory: {
            "Carrot Seed": new Decimal(1),
          },
        },
        action: {
          type: "seed.planted",
          index: 0,
          expansionIndex: 0,
          item: "Carrot Seed",
        },
      })
    ).toThrow("You do not have enough stamina");
  });

  it("replenishes stamina before planting", () => {
    const createdAt = Date.now();

    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          stamina: {
            value: 0,
            replenishedAt: 0,
          },
        },
        inventory: {
          "Carrot Seed": new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        index: 0,
        expansionIndex: 0,
        item: "Carrot Seed",
      },
      createdAt,
    });

    expect(state.bumpkin?.stamina.replenishedAt).toBe(createdAt);
  });

  it("deducts stamina from bumpkin", () => {
    const createdAt = Date.now();

    const state = plant({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          stamina: {
            value: MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)],
            replenishedAt: createdAt,
          },
        },
        inventory: {
          "Carrot Seed": new Decimal(1),
        },
      },
      action: {
        type: "seed.planted",
        index: 0,
        expansionIndex: 0,
        item: "Carrot Seed",
      },
      createdAt,
    });

    expect(state.bumpkin?.stamina.value).toBe(
      MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)] -
        PLANT_STAMINA_COST
    );
  });
});
