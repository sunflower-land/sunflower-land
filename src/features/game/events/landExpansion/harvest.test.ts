import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { harvest } from "./harvest";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("harvest", () => {
  it("does not harvest on non-existent plot", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "landExpansion.item.harvested",
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
          type: "landExpansion.item.harvested",
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
          type: "landExpansion.item.harvested",
          index: 4,
        },
      })
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,
          plots: {
            0: {
              ...GAME_STATE.plots[0],
              crop: {
                name: "Sunflower",
                plantedAt: Date.now() - 100,
              },
            },
          },
        },
        action: {
          type: "landExpansion.item.harvested",
          index: 0,
        },
      })
    ).toThrow("Not ready");
  });

  it("harvests a crop", () => {
    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {
          Radish: new Decimal(42),
          Sunflower: new Decimal(2),
        },
        plots: {
          0: {
            ...GAME_STATE.plots[0],
            crop: {
              name: "Sunflower",
              plantedAt: Date.now() - 2 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "landExpansion.item.harvested",
        index: 0,
      },
    });

    // Positional data remains
    const { x, y, height, width } = GAME_STATE.plots[0];

    expect(state.inventory).toEqual({
      ...state.inventory,
      Sunflower: new Decimal(3),
    });
    expect(state.plots).toEqual({
      0: { x, y, height, width },
    });
  });

  it("harvests a buffed crop amount", () => {
    const state = harvest({
      state: {
        ...GAME_STATE,
        plots: {
          0: {
            ...GAME_STATE.plots[0],
            crop: {
              name: "Sunflower",
              plantedAt: Date.now() - 2 * 60 * 1000,
              amount: 2,
            },
          },
        },
      },
      action: {
        type: "landExpansion.item.harvested",
        index: 0,
      },
    });

    // Positional data remains
    const { x, y, height, width } = GAME_STATE.plots[0];

    expect(state.inventory.Sunflower).toEqual(new Decimal(2));
    expect(state.plots).toEqual({
      0: { x, y, height, width },
    });
  });
});
