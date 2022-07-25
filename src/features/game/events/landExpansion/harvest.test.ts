import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { GameState, LandExpansionPlot } from "../../types/game";
import { harvest } from "./harvest";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("harvest", () => {
  it("does not harvest on a non-existent expansion", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          expansionIndex: -1,
          index: 0,
        },
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
          index: 4,
        },
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
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(2));
  });
});
