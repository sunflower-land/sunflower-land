import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_IRON_ERRORS, moveIron } from "./moveIron";

describe("moveIron", () => {
  it("does not move iron with invalid id", () => {
    expect(() =>
      moveIron({
        state: {
          ...TEST_FARM,
          iron: {
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
          type: "iron.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_IRON_ERRORS.IRON_NOT_PLACED);
  });

  it("moves a iron node", () => {
    const gameState = moveIron({
      state: {
        ...TEST_FARM,
        iron: {
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
        type: "iron.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.iron).toEqual({
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
