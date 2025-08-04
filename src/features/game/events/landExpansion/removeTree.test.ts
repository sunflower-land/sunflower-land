import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeTree, REMOVE_TREE_ERRORS } from "./removeTree";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  trees: {
    "0": {
      wood: {
        choppedAt: 0,
      },
      createdAt: 0,
    },
    "2": {
      wood: {
        choppedAt: 0,
      },
      createdAt: 0,
      x: 1,
      y: 0,
    },
  },
};

describe("removeTree", () => {
  it("throws if tree not found", () => {
    expect(() =>
      removeTree({
        state: GAME_STATE,
        action: { type: "tree.removed", id: "1" },
      }),
    ).toThrow(REMOVE_TREE_ERRORS.TREE_NOT_FOUND);
  });

  it("throws if tree not placed", () => {
    expect(() =>
      removeTree({
        state: GAME_STATE,
        action: { type: "tree.removed", id: "0" },
      }),
    ).toThrow(REMOVE_TREE_ERRORS.TREE_NOT_PLACED);
  });

  it("removes tree", () => {
    const state = removeTree({
      state: GAME_STATE,
      action: { type: "tree.removed", id: "2" },
    });
    expect(state.trees["2"].x).toBeUndefined();
    expect(state.trees["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeTree({
      state: GAME_STATE,
      action: { type: "tree.removed", id: "2" },
    });
    expect(state.trees["2"].removedAt).toBeDefined();
  });
});
