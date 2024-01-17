import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_RUBY_ERRORS, moveRuby } from "./moveRuby";

describe("moveRuby", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveRuby({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "ruby.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_RUBY_ERRORS.NO_BUMPKIN);
  });

  it("does not move ruby with invalid id", () => {
    expect(() =>
      moveRuby({
        state: {
          ...TEST_FARM,
          rubies: {
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
          type: "ruby.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_RUBY_ERRORS.RUBY_NOT_PLACED);
  });

  it("moves a ruby node", () => {
    const gameState = moveRuby({
      state: {
        ...TEST_FARM,
        rubies: {
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
        type: "ruby.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.rubies).toEqual({
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
