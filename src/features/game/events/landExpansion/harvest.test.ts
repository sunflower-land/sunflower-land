import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import cloneDeep from "lodash.clonedeep";
import { GameState, CropPlot } from "../../types/game";
import { harvest } from "./harvest";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
  bumpkin: INITIAL_BUMPKIN,
};

describe("harvest", () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = cloneDeep(GAME_STATE);
  });

  const dateNow = Date.now();

  it("does not harvest on non-existent plot", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          index: "-1",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot does not exist");
  });

  it("does not harvest on non-integer plot", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          index: "1.2",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot does not exist");
  });

  it("does not harvest empty air", () => {
    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,
          crops: {
            1: {
              createdAt: Date.now(),
              height: 1,
              width: 1,
              x: 1,
              y: 1,
            },
          },
        },
        action: {
          type: "crop.harvested",
          index: "1",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    const plots = GAME_STATE.crops;
    const plot = (plots as Record<number, CropPlot>)[0];

    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,

          crops: {
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
        action: {
          type: "crop.harvested",
          index: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Not ready");
  });

  it("harvests a crop", () => {
    const { crops: plots } = GAME_STATE;
    const plot = (plots as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {
          Radish: new Decimal(42),
          Sunflower: new Decimal(2),
        },
        crops: {
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
      action: {
        type: "crop.harvested",
        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      ...state.inventory,
      Sunflower: new Decimal(3),
    });

    const plotAfterHarvest = state.crops?.[0].crop;

    expect(plotAfterHarvest).not.toBeDefined();
  });

  it("harvests a buffed crop amount", () => {
    const { crops: plots } = GAME_STATE;
    const plot = (plots as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        crops: {
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
      action: {
        type: "crop.harvested",
        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(2));
  });

  describe("BumpkinActivity", () => {
    it("increments Sunflowers Harvested activity by 1", () => {
      const { crops: plots } = GAME_STATE;
      const plot = (plots as Record<number, CropPlot>)[0];

      const state = harvest({
        state: {
          ...GAME_STATE,
          crops: {
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
        action: {
          type: "crop.harvested",
          index: "0",
        },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.activity?.["Sunflower Harvested"]).toEqual(1);
    });

    it("increments Sunflowers Harvested activity by 2", () => {
      const { crops: plots } = GAME_STATE;
      const plot = (plots as Record<number, CropPlot>)[0];

      const stateOne = harvest({
        state: {
          ...GAME_STATE,
          crops: {
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
        action: {
          type: "crop.harvested",
          index: "0",
        },
        createdAt: dateNow,
      });

      const state = harvest({
        state: {
          ...stateOne,
          crops: {
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
        action: {
          type: "crop.harvested",
          index: "0",
        },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.activity?.["Sunflower Harvested"]).toEqual(1);
      expect(state.bumpkin?.activity?.["Potato Harvested"]).toEqual(1);
    });
  });
});
