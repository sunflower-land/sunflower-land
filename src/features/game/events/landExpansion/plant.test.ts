import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { CROPS } from "../../types/crops";
import { GameState } from "../../types/game";
import { plant } from "./plant";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("plant", () => {
  it("does not plant on non-existent plot", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "landExpansion.item.planted",
          index: -1,
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
          type: "landExpansion.item.planted",
          index: 1.2,
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
          type: "landExpansion.item.planted",
          index: 200000,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Plot does not exist");
  });

  it("does not plant if crop already exists", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          plots: {
            0: {
              ...GAME_STATE.plots[0],
              crop: {
                name: "Sunflower",
                plantedAt: Date.now(),
              },
            },
          },
        },
        action: {
          type: "landExpansion.item.planted",
          index: 0,
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
          type: "landExpansion.item.planted",
          index: 0,
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
          type: "landExpansion.item.planted",
          index: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(5),
        },
      },
      action: {
        type: "landExpansion.item.planted",
        index: 0,
        item: "Sunflower Seed",
      },
    });

    expect(state).toEqual({
      ...GAME_STATE,
      inventory: {
        "Sunflower Seed": new Decimal(4),
      },
      plots: {
        ...GAME_STATE.plots,
        0: expect.objectContaining({
          crop: expect.objectContaining({
            name: "Sunflower",
            plantedAt: expect.any(Number),
            amount: 1,
          }),
        }),
      },
    });
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
        type: "landExpansion.item.planted",
        index: 0,
        item: "Cauliflower Seed",
      },
    });

    expect(state.plots[0].crop).toEqual(
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
        type: "landExpansion.item.planted",
        index: 0,
        item: "Cauliflower Seed",
      },
    });

    expect(state.plots[0].crop).toEqual(
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
        type: "landExpansion.item.planted",
        index: 0,
        item: "Parsnip Seed",
      },
    });

    const plantedAt = state.plots[0].crop?.plantedAt || 0;

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
        type: "landExpansion.item.planted",
        index: 0,
        item: "Parsnip Seed",
      },
    });

    // Should be twice as fast! (Planted in the past)
    const parnsipTime = CROPS().Parsnip.harvestSeconds * 1000;
    const plantedAt = state.plots[0].crop?.plantedAt || 0;

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
        type: "landExpansion.item.planted",
        index: 0,
        item: "Carrot Seed",
      },
    });

    // Should be twice as fast! (Planted in the psat)
    const carrotTime = CROPS().Carrot.harvestSeconds * 1000;
    const plantedAt = state.plots[0].crop?.plantedAt || 0;

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
        type: "landExpansion.item.planted",
        index: 0,
        item: "Carrot Seed",
      },
    });

    // Offset 5 ms for CPU time
    expect(state.plots[0].crop?.amount).toEqual(1.2);
  });
});
