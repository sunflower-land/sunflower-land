import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeCrimstone, REMOVE_CRIMSTONE_ERRORS } from "./removeCrimstone";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  crimstones: {
    "0": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      minesLeft: 5,
    },
    "2": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      minesLeft: 5,
      x: 1,
      y: 0,
    },
  },
};

describe("removeCrimstone", () => {
  it("throws if crimstone not found", () => {
    expect(() =>
      removeCrimstone({
        state: GAME_STATE,
        action: { type: "crimstone.removed", id: "1" },
      }),
    ).toThrow(REMOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_FOUND);
  });

  it("throws if crimstone not placed", () => {
    expect(() =>
      removeCrimstone({
        state: GAME_STATE,
        action: { type: "crimstone.removed", id: "0" },
      }),
    ).toThrow(REMOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_PLACED);
  });

  it("removes crimstone", () => {
    const state = removeCrimstone({
      state: GAME_STATE,
      action: { type: "crimstone.removed", id: "2" },
    });
    expect(state.crimstones["2"].x).toBeUndefined();
    expect(state.crimstones["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeCrimstone({
      state: GAME_STATE,
      action: { type: "crimstone.removed", id: "2" },
    });
    expect(state.crimstones["2"].removedAt).toBeDefined();
  });
});
