import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { MOVE_IRON_ERRORS, moveIron } from "./moveIron";

describe("moveIron", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveIron({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "iron.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_IRON_ERRORS.NO_BUMPKIN);
  });

  it("does not move iron with invalid id", () => {
    expect(() =>
      moveIron({
        state: {
          ...TEST_FARM,
          iron: {
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
        type: "iron.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.iron).toEqual({
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

  it("does not move iron if mined and within Turtle AoE", () => {
    const dateNow = Date.now();
    expect(() =>
      moveIron({
        state: {
          ...TEST_FARM,
          collectibles: {
            "Emerald Turtle": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          bumpkin: INITIAL_BUMPKIN,
          iron: {
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
          type: "iron.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_IRON_ERRORS.AOE_LOCKED);
  });
});
