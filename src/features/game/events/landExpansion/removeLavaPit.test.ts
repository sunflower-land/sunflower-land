import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_LAVA_PIT_ERRORS, removeLavaPit } from "./removeLavaPit";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  lavaPits: {
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

describe("removeLavaPit", () => {
  it("throws if lava pit not found", () => {
    expect(() =>
      removeLavaPit({
        state: GAME_STATE,
        action: { type: "lavaPit.removed", id: "1" },
      }),
    ).toThrow(REMOVE_LAVA_PIT_ERRORS.LAVA_PIT_NOT_FOUND);
  });

  it("throws if lava pit not placed", () => {
    expect(() =>
      removeLavaPit({
        state: GAME_STATE,
        action: { type: "lavaPit.removed", id: "0" },
      }),
    ).toThrow(REMOVE_LAVA_PIT_ERRORS.LAVA_PIT_NOT_PLACED);
  });

  it("removes lava pit", () => {
    const state = removeLavaPit({
      state: GAME_STATE,
      action: { type: "lavaPit.removed", id: "2" },
    });
    expect(state.lavaPits["2"].x).toBeUndefined();
    expect(state.lavaPits["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeLavaPit({
      state: GAME_STATE,
      action: { type: "lavaPit.removed", id: "2" },
    });
    expect(state.lavaPits["2"].removedAt).toBeDefined();
  });
});
