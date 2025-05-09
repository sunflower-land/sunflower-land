import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_FRUIT_PATCH_ERRORS, moveFruitPatch } from "./moveFruitPatch";

describe("moveFruitPatch", () => {
  it("does not move fruit patch with invalid id", () => {
    expect(() =>
      moveFruitPatch({
        state: {
          ...TEST_FARM,
          fruitPatches: {
            1: {
              x: 1,
              y: 1,
            },
          },
        },
        action: {
          type: "fruitPatch.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_PLACED);
  });

  it("moves a fruit patches", () => {
    const gameState = moveFruitPatch({
      state: {
        ...TEST_FARM,
        fruitPatches: {
          123: {
            x: 1,
            y: 1,
          },
          456: {
            x: 4,
            y: 4,
          },
          789: {
            x: 8,
            y: 8,
          },
        },
      },
      action: {
        type: "fruitPatch.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.fruitPatches).toEqual({
      "123": { x: 2, y: 2 },
      "456": { x: 4, y: 4 },
      "789": { x: 8, y: 8 },
    });
  });
});
