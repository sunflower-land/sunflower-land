import { TEST_FARM } from "features/game/lib/constants";
import { MOVE_OIL_ERRORS, moveOilReserve } from "./moveOilReserve";

describe("moveOilReserve", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveOilReserve({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "oilReserve.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_OIL_ERRORS.NO_BUMPKIN);
  });

  it("does not move oil with invalid id", () => {
    expect(() =>
      moveOilReserve({
        state: {
          ...TEST_FARM,
          oilReserves: {
            "1": {
              height: 1,
              width: 1,
              drilled: 1,
              createdAt: 0,
              x: 1,
              y: 1,
              oil: {
                amount: 1,
                drilledAt: 0,
              },
            },
          },
        },
        action: {
          type: "oilReserve.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      })
    ).toThrow(MOVE_OIL_ERRORS.OIL_NOT_PLACED);
  });

  it("moves a oil reserve", () => {
    const gameState = moveOilReserve({
      state: {
        ...TEST_FARM,
        oilReserves: {
          "123": {
            height: 1,
            width: 1,
            x: 1,
            y: 1,
            oil: {
              amount: 1,
              drilledAt: 0,
            },
            createdAt: 0,
            drilled: 1,
          },
          "456": {
            height: 1,
            width: 1,
            x: 4,
            y: 4,
            oil: {
              amount: 1,
              drilledAt: 0,
            },
            drilled: 1,
            createdAt: 0,
          },
          "789": {
            height: 1,
            width: 1,
            x: 8,
            y: 8,
            oil: {
              amount: 1,
              drilledAt: 0,
            },
            drilled: 1,
            createdAt: 0,
          },
        },
      },
      action: {
        type: "oilReserve.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.oilReserves).toEqual({
      "123": {
        height: 1,
        width: 1,
        x: 2,
        y: 2,
        oil: {
          amount: 1,
          drilledAt: 0,
        },
        drilled: 1,
        createdAt: 0,
      },
      "456": {
        height: 1,
        width: 1,
        x: 4,
        y: 4,
        oil: {
          amount: 1,
          drilledAt: 0,
        },
        drilled: 1,
        createdAt: 0,
      },
      "789": {
        height: 1,
        width: 1,
        x: 8,
        y: 8,
        oil: {
          amount: 1,
          drilledAt: 0,
        },
        drilled: 1,
        createdAt: 0,
      },
    });
  });
});
