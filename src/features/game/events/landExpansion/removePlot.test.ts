import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_PLOT_ERRORS, removePlot } from "./removePlot";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  crops: {
    "0": {
      createdAt: 0,
    },
    "2": {
      createdAt: 0,
      x: 1,
      y: 0,
    },
  },
};

describe("removePlot", () => {
  it("throws if plot not found", () => {
    expect(() =>
      removePlot({
        state: GAME_STATE,
        action: { type: "plot.removed", id: "1" },
      }),
    ).toThrow(REMOVE_PLOT_ERRORS.PLOT_NOT_FOUND);
  });

  it("throws if plot not placed", () => {
    expect(() =>
      removePlot({
        state: GAME_STATE,
        action: { type: "plot.removed", id: "0" },
      }),
    ).toThrow(REMOVE_PLOT_ERRORS.PLOT_NOT_PLACED);
  });

  it("removes plot", () => {
    const state = removePlot({
      state: GAME_STATE,
      action: { type: "plot.removed", id: "2" },
    });
    expect(state.crops["2"].x).toBeUndefined();
    expect(state.crops["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removePlot({
      state: GAME_STATE,
      action: { type: "plot.removed", id: "2" },
    });
    expect(state.crops["2"].removedAt).toBeDefined();
  });

  it("saves the current progress", () => {
    const dateNow = Date.now();
    const state = removePlot({
      state: {
        ...GAME_STATE,
        crops: {
          ...GAME_STATE.crops,
          "2": {
            ...GAME_STATE.crops["2"],
            crop: {
              ...GAME_STATE.crops["2"].crop,
              name: "Pumpkin",
              plantedAt: dateNow - 60000,
            },
          },
        },
      },
      action: { type: "plot.removed", id: "2" },
      createdAt: dateNow,
    });
    expect(state.crops["2"].crop?.plantProgress).toBe(60000);
  });
});
