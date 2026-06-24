import { TEST_FARM } from "features/game/lib/constants";
import {
  MOVE_ASCENSION_CRYSTAL_ERRORS,
  moveAscensionCrystal,
} from "./moveAscensionCrystal";

describe("moveAscensionCrystal", () => {
  it("does not move an ascension crystal with an invalid id", () => {
    expect(() =>
      moveAscensionCrystal({
        state: {
          ...TEST_FARM,
          ascensionCrystals: {
            1: {
              x: 1,
              y: 1,
              stone: {
                minedAt: 0,
              },
              minesLeft: 1,
            },
          },
        },
        action: {
          type: "ascensionCrystal.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_ASCENSION_CRYSTAL_ERRORS.ASCENSION_CRYSTAL_NOT_PLACED);
  });

  it("moves an ascension crystal node", () => {
    const gameState = moveAscensionCrystal({
      state: {
        ...TEST_FARM,
        ascensionCrystals: {
          "123": {
            x: 1,
            y: 1,
            stone: {
              minedAt: 0,
            },
            minesLeft: 1,
          },
          "456": {
            x: 4,
            y: 4,
            stone: {
              minedAt: 0,
            },
            minesLeft: 1,
          },
          "789": {
            x: 8,
            y: 8,
            stone: {
              minedAt: 0,
            },
            minesLeft: 1,
          },
        },
      },
      action: {
        type: "ascensionCrystal.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.ascensionCrystals).toEqual({
      "123": {
        x: 2,
        y: 2,
        stone: {
          minedAt: 0,
        },
        minesLeft: 1,
      },
      "456": {
        x: 4,
        y: 4,
        stone: {
          minedAt: 0,
        },
        minesLeft: 1,
      },
      "789": {
        x: 8,
        y: 8,
        stone: {
          minedAt: 0,
        },
        minesLeft: 1,
      },
    });
  });
});
