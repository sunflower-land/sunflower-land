import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  REMOVE_FRUIT_PATCH_ERRORS,
  removeFruitPatch,
} from "./removeFruitPatch";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  fruitPatches: {
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

describe("removeFruitPatch", () => {
  const dateNow = Date.now();
  it("throws if fruit patch not found", () => {
    expect(() =>
      removeFruitPatch({
        state: GAME_STATE,
        action: { type: "fruitPatch.removed", id: "1" },
        createdAt: dateNow,
      }),
    ).toThrow(REMOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_FOUND);
  });

  it("throws if fruit patch not placed", () => {
    expect(() =>
      removeFruitPatch({
        state: GAME_STATE,
        action: { type: "fruitPatch.removed", id: "0" },
        createdAt: dateNow,
      }),
    ).toThrow(REMOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_PLACED);
  });

  it("removes fruit patch", () => {
    const state = removeFruitPatch({
      state: GAME_STATE,
      action: { type: "fruitPatch.removed", id: "2" },
      createdAt: dateNow,
    });
    expect(state.fruitPatches["2"].x).toBeUndefined();
    expect(state.fruitPatches["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeFruitPatch({
      state: GAME_STATE,
      action: { type: "fruitPatch.removed", id: "2" },
      createdAt: dateNow,
    });
    expect(state.fruitPatches["2"].removedAt).toBeDefined();
  });
});
