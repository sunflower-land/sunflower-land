import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeGold, REMOVE_GOLD_ERRORS } from "./removeGold";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  gold: {
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

describe("removeGold", () => {
  it("throws if gold not found", () => {
    expect(() =>
      removeGold({
        state: GAME_STATE,
        action: { type: "gold.removed", id: "1" },
      }),
    ).toThrow(REMOVE_GOLD_ERRORS.GOLD_NOT_FOUND);
  });

  it("throws if stone not placed", () => {
    expect(() =>
      removeGold({
        state: GAME_STATE,
        action: { type: "gold.removed", id: "0" },
      }),
    ).toThrow(REMOVE_GOLD_ERRORS.GOLD_NOT_PLACED);
  });

  it("removes gold", () => {
    const state = removeGold({
      state: GAME_STATE,
      action: { type: "gold.removed", id: "2" },
    });
    expect(state.gold["2"].x).toBeUndefined();
    expect(state.gold["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeGold({
      state: GAME_STATE,
      action: { type: "gold.removed", id: "2" },
    });
    expect(state.gold["2"].removedAt).toBeDefined();
  });
});
