import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_STONE_ERRORS, removeStone } from "./removeStone";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  stones: {
    "0": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
    },
    "2": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      x: 1,
      y: 0,
    },
  },
};

describe("removeStone", () => {
  it("throws if stone not found", () => {
    expect(() =>
      removeStone({
        state: GAME_STATE,
        action: { type: "stone.removed", id: "1" },
      }),
    ).toThrow(REMOVE_STONE_ERRORS.STONE_NOT_FOUND);
  });

  it("throws if stone not placed", () => {
    expect(() =>
      removeStone({
        state: GAME_STATE,
        action: { type: "stone.removed", id: "0" },
      }),
    ).toThrow(REMOVE_STONE_ERRORS.STONE_NOT_PLACED);
  });

  it("removes stone", () => {
    const state = removeStone({
      state: GAME_STATE,
      action: { type: "stone.removed", id: "2" },
    });
    expect(state.stones["2"].x).toBeUndefined();
    expect(state.stones["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeStone({
      state: GAME_STATE,
      action: { type: "stone.removed", id: "2" },
    });
    expect(state.stones["2"].removedAt).toBeDefined();
  });
});
