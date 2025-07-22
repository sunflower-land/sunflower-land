import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState, CropPlot } from "../../types/game";
import { harvest } from "./harvest";
import cloneDeep from "lodash.clonedeep";

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
        state: gameState,
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
        state: gameState,
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
          ...gameState,
          crops: {
            1: {
              createdAt: Date.now(),
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
    const plots = gameState.crops;
    const plot = (plots as Record<number, CropPlot>)[0];

    expect(() =>
      harvest({
        state: {
          ...gameState,

          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: Date.now() - 100,
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
    const { crops: plots } = gameState;
    const plot = (plots as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...gameState,
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
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin.equipped,
            necklace: "Green Amulet",
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
              criticalHit: { "Green Amulet": 1 },
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

    expect(state.inventory.Sunflower).toEqual(new Decimal(10));
  });

  it("harvests a unbuffed crop amount if green amulet is not equipped", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin.equipped,
            necklace: undefined,
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
              criticalHit: { "Green Amulet": 1 },
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

    expect(state.inventory.Sunflower).toEqual(new Decimal(1));
  });

  it("harvests a buffed amount if an item is equipped after planting", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin.equipped,
            necklace: "Sunflower Amulet",
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
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

    expect(state.inventory.Sunflower).toEqual(new Decimal(1.1));
  });

  it("harvests a buffed amount if a fertiliser is applied after planting", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
            fertiliser: {
              name: "Sprout Mix",
              fertilisedAt: dateNow - 2 * 60 * 1000,
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

    expect(state.inventory.Sunflower).toEqual(new Decimal(1.2));
  });

  it("harvests a buffed amount if a fertiliser is applied after planting with knowledge crab", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
            fertiliser: {
              name: "Sprout Mix",
              fertilisedAt: dateNow - 2 * 60 * 1000,
            },
          },
        },
        collectibles: {
          "Knowledge Crab": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              readyAt: dateNow - 2 * 60 * 1000,
              createdAt: dateNow - 2 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1.4));
  });

  describe("BumpkinActivity", () => {
    it("increments Sunflowers Harvested activity by 1", () => {
      const { crops: plots } = gameState;
      const plot = (plots as Record<number, CropPlot>)[0];

      const state = harvest({
        state: {
          ...gameState,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: Date.now() - 2 * 60 * 1000,
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
      const { crops: plots } = gameState;
      const plot = (plots as Record<number, CropPlot>)[0];

      const stateOne = harvest({
        state: {
          ...gameState,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: Date.now() - 2 * 60 * 1000,
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
