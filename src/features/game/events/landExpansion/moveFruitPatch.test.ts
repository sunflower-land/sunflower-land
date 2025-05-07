import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_FRUIT_PATCH_ERRORS, moveFruitPatch } from "./moveFruitPatch";
const now = Date.now();

describe("moveFruitPatch", () => {
  it("does not move fruit patch with invalid id", () => {
    expect(() =>
      moveFruitPatch({
        state: {
          ...TEST_FARM,
          fruitPatches: {
            1: {
              createdAt: now,
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
        createdAt: now,
      }),
    ).toThrow(MOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_PLACED);
  });

  it("moves a fruit patches", () => {
    const gameState = moveFruitPatch({
      state: {
        ...TEST_FARM,
        fruitPatches: {
          123: {
            createdAt: now,
            x: 1,
            y: 1,
          },
          456: {
            createdAt: now,
            x: 4,
            y: 4,
          },
          789: {
            createdAt: now,
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
      createdAt: now,
    });

    expect(gameState.fruitPatches).toEqual({
      "123": { createdAt: now, x: 2, y: 2 },
      "456": { createdAt: now, x: 4, y: 4 },
      "789": { createdAt: now, x: 8, y: 8 },
    });
  });
});
