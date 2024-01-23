import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_CRIMSTONE_ERRORS, moveCrimstone } from "./moveCrimstone";

describe("moveCrimstone", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveCrimstone({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "crimstone.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_CRIMSTONE_ERRORS.NO_BUMPKIN);
  });

  it("does not move crimstone with invalid id", () => {
    expect(() =>
      moveCrimstone({
        state: {
          ...TEST_FARM,
          crimstones: {
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
          type: "crimstone.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_PLACED);
  });

  it("moves a crimstone node", () => {
    const gameState = moveCrimstone({
      state: {
        ...TEST_FARM,
        crimstones: {
          "123": {
            height: 1,
            width: 1,
            x: 1,
            y: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
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
        height: 1,
        width: 1,
        x: 2,
        y: 2,
        stone: {
          amount: 1,
          minedAt: 0,
        },
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
      },
    });
  });
});
