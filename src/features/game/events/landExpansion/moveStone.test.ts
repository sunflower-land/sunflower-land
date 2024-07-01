import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { MOVE_STONE_ERRORS, moveStone } from "./moveStone";

describe("moveStone", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveStone({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "stone.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_STONE_ERRORS.NO_BUMPKIN);
  });

  it("does not move stone with invalid id", () => {
    expect(() =>
      moveStone({
        state: {
          ...TEST_FARM,
          stones: {
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
        type: "stone.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.stones).toEqual({
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

  it("does not move gold if mined and within Turtle AoE", () => {
    const dateNow = Date.now();
    expect(() =>
      moveStone({
        state: {
          ...TEST_FARM,
          collectibles: {
            "Tin Turtle": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          bumpkin: INITIAL_BUMPKIN,
          stones: {
            1: {
              height: 1,
              width: 1,
              x: 1,
              y: 2,
              stone: {
                amount: 1,
                minedAt: dateNow - 100,
              },
            },
          },
        },
        action: {
          type: "stone.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_STONE_ERRORS.AOE_LOCKED);
  });
});
