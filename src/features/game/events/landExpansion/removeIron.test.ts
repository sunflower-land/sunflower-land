import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_IRON_ERRORS, removeIron } from "./removeIron";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  iron: {
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

describe("removeIron", () => {
  it("throws if iron not found", () => {
    expect(() =>
      removeIron({
        state: GAME_STATE,
        action: { type: "iron.removed", id: "1" },
      }),
    ).toThrow(REMOVE_IRON_ERRORS.IRON_NOT_FOUND);
  });

  it("throws if iron not placed", () => {
    expect(() =>
      removeIron({
        state: GAME_STATE,
        action: { type: "iron.removed", id: "0" },
      }),
    ).toThrow(REMOVE_IRON_ERRORS.IRON_NOT_PLACED);
  });

  it("removes iron", () => {
    const state = removeIron({
      state: GAME_STATE,
      action: { type: "iron.removed", id: "2" },
    });
    expect(state.iron["2"].x).toBeUndefined();
    expect(state.iron["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeIron({
      state: GAME_STATE,
      action: { type: "iron.removed", id: "2" },
    });
    expect(state.iron["2"].removedAt).toBeDefined();
  });
});
