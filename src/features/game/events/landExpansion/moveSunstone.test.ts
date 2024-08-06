import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_GOLD_ERRORS, moveSunstone } from "./moveSunstone";

describe("moveSunstone", () => {
  it("does not move sunstone with invalid id", () => {
    expect(() =>
      moveSunstone({
        state: {
          ...TEST_FARM,
          gold: {
            1: {
              height: 1,
              width: 1,
              x: 1,
              y: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
          },
        },
        action: {
          type: "sunstone.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_GOLD_ERRORS.SUNSTONE_NOT_PLACED);
  });

  it("moves a sunstone node", () => {
    const gameState = moveSunstone({
      state: {
        ...TEST_FARM,
        sunstones: {
          "123": {
            height: 1,
            width: 1,
            x: 1,
            y: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 1,
          },
          "456": {
            height: 1,
            width: 1,
            x: 4,
            y: 4,
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 1,
          },
          "789": {
            height: 1,
            width: 1,
            x: 8,
            y: 8,
            stone: {
              amount: 1,
              minedAt: 0,
            },
            minesLeft: 1,
          },
        },
      },
      action: {
        type: "sunstone.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.sunstones).toEqual({
      "123": {
        height: 1,
        width: 1,
        x: 2,
        y: 2,
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 1,
      },
      "456": {
        height: 1,
        width: 1,
        x: 4,
        y: 4,
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 1,
      },
      "789": {
        height: 1,
        width: 1,
        x: 8,
        y: 8,
        stone: {
          amount: 1,
          minedAt: 0,
        },
        minesLeft: 1,
      },
    });
  });
});
