import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeSunstone, REMOVE_SUNSTONE_ERRORS } from "./removeSunstone";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  sunstones: {
    "0": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      minesLeft: 10,
    },
    "2": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      minesLeft: 10,
      x: 1,
      y: 0,
    },
  },
};

describe("removeSunstone", () => {
  it("throws if sunstone not found", () => {
    expect(() =>
      removeSunstone({
        state: GAME_STATE,
        action: { type: "sunstone.removed", id: "1" },
      }),
    ).toThrow(REMOVE_SUNSTONE_ERRORS.SUNSTONE_NOT_FOUND);
  });

  it("throws if sunstone not placed", () => {
    expect(() =>
      removeSunstone({
        state: GAME_STATE,
        action: { type: "sunstone.removed", id: "0" },
      }),
    ).toThrow(REMOVE_SUNSTONE_ERRORS.SUNSTONE_NOT_PLACED);
  });

  it("removes sunstone", () => {
    const state = removeSunstone({
      state: GAME_STATE,
      action: { type: "sunstone.removed", id: "2" },
    });
    expect(state.sunstones["2"].x).toBeUndefined();
    expect(state.sunstones["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeSunstone({
      state: GAME_STATE,
      action: { type: "sunstone.removed", id: "2" },
    });
    expect(state.sunstones["2"].removedAt).toBeDefined();
  });
});
