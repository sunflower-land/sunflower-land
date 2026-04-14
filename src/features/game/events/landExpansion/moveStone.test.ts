import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_STONE_ERRORS, moveStone } from "./moveStone";

describe("moveStone", () => {
  it("does not move stone with invalid id", () => {
    expect(() =>
      moveStone({
        state: {
          ...TEST_FARM,
          stones: {
            1: {
              x: 1,
              y: 1,
              stone: {
                minedAt: 0,
              },
            },
          },
        },
        action: {
          type: "stone.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_STONE_ERRORS.STONE_NOT_PLACED);
  });

  it("moves a stone node", () => {
    const gameState = moveStone({
      state: {
        ...TEST_FARM,
        stones: {
          "123": {
            x: 1,
            y: 1,
            stone: {
              minedAt: 0,
            },
          },
          "456": {
            x: 4,
            y: 4,
            stone: {
              minedAt: 0,
            },
          },
          "789": {
            x: 8,
            y: 8,
            stone: {
              minedAt: 0,
            },
          },
        },
      },
      action: {
        type: "stone.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.stones).toEqual({
      "123": {
        x: 2,
        y: 2,
        stone: {
          minedAt: 0,
        },
      },
      "456": {
        x: 4,
        y: 4,
        stone: {
          minedAt: 0,
        },
      },
      "789": {
        x: 8,
        y: 8,
        stone: {
          minedAt: 0,
        },
      },
    });
  });
});
