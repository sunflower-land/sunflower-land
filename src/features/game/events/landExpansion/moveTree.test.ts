import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_TREE_ERRORS, moveTree } from "./moveTree";

describe("moveTree", () => {
  it("does not move tree with invalid id", () => {
    expect(() =>
      moveTree({
        state: {
          ...TEST_FARM,
          trees: {
            1: {
              height: 1,
              width: 1,
              x: 1,
              y: 1,
              wood: {
                amount: 1,
                choppedAt: 0,
              },
            },
          },
        },
        action: {
          type: "tree.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_TREE_ERRORS.TREE_NOT_PLACED);
  });

  it("moves a tree node", () => {
    const gameState = moveTree({
      state: {
        ...TEST_FARM,
        trees: {
          "123": {
            height: 1,
            width: 1,
            x: 1,
            y: 1,
            wood: {
              amount: 1,
              choppedAt: 0,
            },
          },
          "456": {
            height: 1,
            width: 1,
            x: 4,
            y: 4,
            wood: {
              amount: 1,
              choppedAt: 0,
            },
          },
          "789": {
            height: 1,
            width: 1,
            x: 8,
            y: 8,
            wood: {
              amount: 1,
              choppedAt: 0,
            },
          },
        },
      },
      action: {
        type: "tree.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.trees).toEqual({
      "123": {
        height: 1,
        width: 1,
        x: 2,
        y: 2,
        wood: {
          amount: 1,
          choppedAt: 0,
        },
      },
      "456": {
        height: 1,
        width: 1,
        x: 4,
        y: 4,
        wood: {
          amount: 1,
          choppedAt: 0,
        },
      },
      "789": {
        height: 1,
        width: 1,
        x: 8,
        y: 8,
        wood: {
          amount: 1,
          choppedAt: 0,
        },
      },
    });
  });
});
