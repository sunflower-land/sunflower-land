import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  REMOVE_OIL_RESERVE_ERRORS,
  removeOilReserve,
} from "./removeOilReserve";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  oilReserves: {
    "0": {
      oil: {
        drilledAt: 0,
      },
      createdAt: 0,
      drilled: 0,
    },
    "2": {
      oil: {
        drilledAt: 0,
      },
      createdAt: 0,
      x: 1,
      y: 0,
      drilled: 0,
    },
  },
};

describe("removeOilReserve", () => {
  it("throws if oil reserve not found", () => {
    expect(() =>
      removeOilReserve({
        state: GAME_STATE,
        action: { type: "oilReserve.removed", id: "1" },
      }),
    ).toThrow(REMOVE_OIL_RESERVE_ERRORS.OIL_RESERVE_NOT_FOUND);
  });

  it("throws if oil reserve not placed", () => {
    expect(() =>
      removeOilReserve({
        state: GAME_STATE,
        action: { type: "oilReserve.removed", id: "0" },
      }),
    ).toThrow(REMOVE_OIL_RESERVE_ERRORS.OIL_RESERVE_NOT_PLACED);
  });

  it("removes oil reserve", () => {
    const state = removeOilReserve({
      state: GAME_STATE,
      action: { type: "oilReserve.removed", id: "2" },
    });
    expect(state.oilReserves["2"].x).toBeUndefined();
    expect(state.oilReserves["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeOilReserve({
      state: GAME_STATE,
      action: { type: "oilReserve.removed", id: "2" },
    });
    expect(state.oilReserves["2"].removedAt).toBeDefined();
  });
});
