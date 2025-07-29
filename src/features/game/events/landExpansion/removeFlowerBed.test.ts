import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_FLOWER_BED_ERRORS, removeFlowerBed } from "./removeFlowerBed";
const now = Date.now();

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  flowers: {
    discovered: {},
    flowerBeds: {
      "0": { createdAt: now },
      "2": { createdAt: now, x: 1, y: 0 },
    },
  },
};

describe("removeFlowerBed", () => {
  it("throws if flower bed not found", () => {
    expect(() =>
      removeFlowerBed({
        state: GAME_STATE,
        action: { type: "flowerBed.removed", id: "1" },
        createdAt: now,
      }),
    ).toThrow(REMOVE_FLOWER_BED_ERRORS.FLOWER_BED_NOT_FOUND);
  });

  it("throws if flower bed not placed", () => {
    expect(() =>
      removeFlowerBed({
        state: GAME_STATE,
        action: { type: "flowerBed.removed", id: "0" },
        createdAt: now,
      }),
    ).toThrow(REMOVE_FLOWER_BED_ERRORS.FLOWER_BED_NOT_PLACED);
  });

  it("removes flower bed", () => {
    const state = removeFlowerBed({
      state: GAME_STATE,
      action: { type: "flowerBed.removed", id: "2" },
      createdAt: now,
    });
    expect(state.flowers.flowerBeds["2"].x).toBeUndefined();
    expect(state.flowers.flowerBeds["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeFlowerBed({
      state: GAME_STATE,
      action: { type: "flowerBed.removed", id: "2" },
      createdAt: now,
    });
    expect(state.flowers.flowerBeds["2"].removedAt).toBeDefined();
  });
});
