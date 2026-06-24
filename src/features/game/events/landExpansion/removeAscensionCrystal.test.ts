import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  removeAscensionCrystal,
  REMOVE_ASCENSION_CRYSTAL_ERRORS,
} from "./removeAscensionCrystal";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  ascensionCrystals: {
    "0": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      minesLeft: 1,
    },
    "2": {
      stone: {
        minedAt: 0,
      },
      createdAt: 0,
      minesLeft: 1,
      x: 1,
      y: 0,
    },
  },
};

describe("removeAscensionCrystal", () => {
  it("throws if the ascension crystal is not found", () => {
    expect(() =>
      removeAscensionCrystal({
        state: GAME_STATE,
        action: { type: "ascensionCrystal.removed", id: "1" },
      }),
    ).toThrow(REMOVE_ASCENSION_CRYSTAL_ERRORS.ASCENSION_CRYSTAL_NOT_FOUND);
  });

  it("throws if the ascension crystal is not placed", () => {
    expect(() =>
      removeAscensionCrystal({
        state: GAME_STATE,
        action: { type: "ascensionCrystal.removed", id: "0" },
      }),
    ).toThrow(REMOVE_ASCENSION_CRYSTAL_ERRORS.ASCENSION_CRYSTAL_NOT_PLACED);
  });

  it("removes an ascension crystal", () => {
    const state = removeAscensionCrystal({
      state: GAME_STATE,
      action: { type: "ascensionCrystal.removed", id: "2" },
    });
    expect(state.ascensionCrystals["2"].x).toBeUndefined();
    expect(state.ascensionCrystals["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeAscensionCrystal({
      state: GAME_STATE,
      action: { type: "ascensionCrystal.removed", id: "2" },
    });
    expect(state.ascensionCrystals["2"].removedAt).toBeDefined();
  });
});
