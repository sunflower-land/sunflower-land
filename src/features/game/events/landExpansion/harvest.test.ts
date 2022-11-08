import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import cloneDeep from "lodash.clonedeep";
import { GameState, LandExpansionPlot } from "../../types/game";
import { harvest } from "./harvest";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
  trees: {},
  bumpkin: INITIAL_BUMPKIN,
};

describe("harvest", () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = cloneDeep(GAME_STATE);
  });

  const dateNow = Date.now();

  it("does not harvest on a non-existent expansion", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          expansionIndex: -1,
          index: 0,
        },
        createdAt: dateNow,
      })
    ).toThrow("Expansion does not exist");
  });

  it("does not plant on a an expansion with no plots", () => {
    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,
          expansions: [{ createdAt: 0, readyAt: 0 }],
        },
        action: {
          type: "crop.harvested",
          index: 0,
          expansionIndex: 0,
        },
        createdAt: dateNow,
      })
    ).toThrow("Expansion does not have any plots");
  });

  it("does not harvest on non-existent plot", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: -1,
        },
        createdAt: dateNow,
      })
    ).toThrow("Plot does not exist");
  });

  it("does not harvest on non-integer plot", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: 1.2,
        },
        createdAt: dateNow,
      })
    ).toThrow("Plot does not exist");
  });

  it("does not harvest empty air", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: 7,
        },
        createdAt: dateNow,
      })
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    const expansion = GAME_STATE.expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    expect(() =>
      harvest({
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
                    plantedAt: Date.now() - 100,
                    amount: 1,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: 0,
        },
        createdAt: dateNow,
      })
    ).toThrow("Not ready");
  });

  it("harvests a crop", () => {
    const expansion = GAME_STATE.expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {
          Radish: new Decimal(42),
          Sunflower: new Decimal(2),
        },
        expansions: [
          {
            ...expansion,
            plots: {
              0: {
                ...plot,
                crop: {
                  name: "Sunflower",
                  plantedAt: Date.now() - 2 * 60 * 1000,
                  amount: 1,
                },
              },
            },
          },
        ],
      },
      action: {
        type: "crop.harvested",
        expansionIndex: 0,
        index: 0,
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      ...state.inventory,
      Sunflower: new Decimal(3),
    });

    const plotAfterHarvest = state.expansions[0].plots?.[0].crop;

    expect(plotAfterHarvest).not.toBeDefined();
  });

  it("harvests a buffed crop amount", () => {
    const expansion = GAME_STATE.expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    const state = harvest({
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
                  plantedAt: Date.now() - 2 * 60 * 1000,
                  amount: 2,
                },
              },
            },
          },
        ],
      },
      action: {
        type: "crop.harvested",
        expansionIndex: 0,
        index: 0,
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(2));
  });

  it("collects an SFL reward", () => {
    const expansion = GAME_STATE.expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    const state = harvest({
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
                  plantedAt: Date.now() - 2 * 60 * 1000,
                  amount: 1,
                  reward: {
                    sfl: new Decimal(1),
                    items: [],
                  },
                },
              },
            },
          },
        ],
      },
      action: {
        type: "crop.harvested",
        expansionIndex: 0,
        index: 0,
      },
      createdAt: dateNow,
    });

    expect(state.balance).toEqual(new Decimal(1));
  });

  it("collects item rewards", () => {
    const expansion = GAME_STATE.expansions[0];
    const { plots } = expansion;
    const plot = (plots as Record<number, LandExpansionPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {
          Potato: new Decimal(2),
          "Pumpkin Seed": new Decimal(5),
        },
        expansions: [
          {
            ...expansion,
            plots: {
              0: {
                ...plot,
                crop: {
                  name: "Sunflower",
                  plantedAt: Date.now() - 2 * 60 * 1000,
                  amount: 1,
                  reward: {
                    sfl: new Decimal(0),
                    items: [
                      {
                        amount: 1,
                        name: "Pumpkin Seed",
                      },
                      {
                        amount: 3,
                        name: "Carrot Seed",
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
      action: {
        type: "crop.harvested",
        expansionIndex: 0,
        index: 0,
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      Potato: new Decimal(2),
      "Pumpkin Seed": new Decimal(6),
      "Carrot Seed": new Decimal(3),
      Sunflower: new Decimal(1),
    });
  });

  describe("BumpkinActivity", () => {
    it("increments Sunflowers Harvested activity by 1", () => {
      const expansion = GAME_STATE.expansions[0];
      const { plots } = expansion;
      const plot = (plots as Record<number, LandExpansionPlot>)[0];

      const state = harvest({
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
                    plantedAt: Date.now() - 2 * 60 * 1000,
                    amount: 2,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: 0,
        },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.activity?.["Sunflower Harvested"]).toEqual(1);
    });

    it("increments Sunflowers Harvested activity by 2", () => {
      const expansion = GAME_STATE.expansions[0];
      const { plots } = expansion;
      const plot = (plots as Record<number, LandExpansionPlot>)[0];

      const stateOne = harvest({
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
                    plantedAt: Date.now() - 2 * 60 * 1000,
                    amount: 2,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: 0,
        },
        createdAt: dateNow,
      });

      const state = harvest({
        state: {
          ...stateOne,
          expansions: [
            {
              ...expansion,
              plots: {
                0: {
                  ...plot,
                  crop: {
                    name: "Potato",
                    plantedAt: Date.now() - 6 * 60 * 1000,
                    amount: 2,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "crop.harvested",
          expansionIndex: 0,
          index: 0,
        },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.activity?.["Sunflower Harvested"]).toEqual(1);
      expect(state.bumpkin?.activity?.["Potato Harvested"]).toEqual(1);
    });
  });
});
