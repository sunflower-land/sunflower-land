import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_CRIMSTONE_ERRORS, moveCrimstone } from "./moveCrimstone";

describe("moveCrimstone", () => {
  it("does not move crimstone with invalid id", () => {
    expect(() =>
      moveCrimstone({
        state: {
          ...TEST_FARM,
          crimstones: {
            1: {
              height: 2,
              width: 2,
              x: 1,
              y: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
              minesLeft: 5,
            },
          },
        },
        action: {
          type: "crimstone.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_PLACED);
  });

  it("moves a crimstone node", () => {
    const gameState = moveCrimstone({
      state: {
        ...TEST_FARM,
        crimstones: {
          "123": {
            height: 2,
            width: 2,
            x: 1,
            y: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 5,
          },
          "456": {
            height: 2,
            width: 2,
            x: 4,
            y: 4,
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 5,
          },
          "789": {
            height: 2,
            width: 2,
            x: 8,
            y: 8,
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 5,
          },
        },
      },
      action: {
        type: "crimstone.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.crimstones).toEqual({
      "123": {
        height: 2,
        width: 2,
        x: 2,
        y: 2,
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 5,
      },
      "456": {
        height: 2,
        width: 2,
        x: 4,
        y: 4,
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 5,
      },
      "789": {
        height: 2,
        width: 2,
        x: 8,
        y: 8,
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 5,
      },
    });
  });
});
