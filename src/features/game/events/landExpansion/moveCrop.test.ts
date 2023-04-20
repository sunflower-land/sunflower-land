import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_CROP_ERRORS, moveCrop } from "./moveCrop";

describe("moveCrop", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "crop.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_CROP_ERRORS.NO_BUMPKIN);
  });

  it("does not move crop with invalid id", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 1,
              y: 1,
              createdAt: Date.now(),
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_CROP_ERRORS.CROP_NOT_PLACED);
  });

  it("moves a crop", () => {
    const gameState = moveCrop({
      state: {
        ...TEST_FARM,
        crops: {
          123: {
            height: 1,
            width: 1,
            x: 1,
            y: 1,
            createdAt: 0,
          },
          456: {
            height: 1,
            width: 1,
            x: 4,
            y: 4,
            createdAt: 0,
          },
          789: {
            height: 1,
            width: 1,
            x: 8,
            y: 8,
            createdAt: 0,
          },
        },
      },
      action: {
        type: "crop.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.crops).toEqual({
      "123": { height: 1, width: 1, x: 2, y: 2, createdAt: 0 },
      "456": { height: 1, width: 1, x: 4, y: 4, createdAt: 0 },
      "789": { height: 1, width: 1, x: 8, y: 8, createdAt: 0 },
    });
  });
});
