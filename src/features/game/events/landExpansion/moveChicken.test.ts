import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { MOVE_CHICKEN_ERRORS, moveChicken } from "./moveChicken";

describe("moveChicken", () => {
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveChicken({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "chicken.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CHICKEN_ERRORS.NO_BUMPKIN);
  });

  it("does not move chicken with invalid id", () => {
    expect(() =>
      moveChicken({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          chickens: {
            1: {
              coordinates: {
                x: 1,
                y: 1,
              },
              multiplier: 1,
            },
          },
        },
        action: {
          type: "chicken.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CHICKEN_ERRORS.CHICKEN_NOT_PLACED);
  });

  it("moves a chicken", () => {
    const gameState = moveChicken({
      state: {
        ...TEST_FARM,
        bumpkin: INITIAL_BUMPKIN,
        chickens: {
          123: {
            coordinates: {
              x: 1,
              y: 1,
            },
            multiplier: 1,
          },
          456: {
            coordinates: {
              x: 4,
              y: 4,
            },
            multiplier: 1,
          },
          789: {
            coordinates: {
              x: 8,
              y: 8,
            },
            multiplier: 1,
          },
        },
      },
      action: {
        type: "chicken.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.chickens).toEqual({
      "123": { coordinates: { x: 2, y: 2 }, multiplier: 1 },
      "456": { coordinates: { x: 4, y: 4 }, multiplier: 1 },
      "789": { coordinates: { x: 8, y: 8 }, multiplier: 1 },
    });
  });

  it("doesn't throw an error if colliding with itself", () => {
    const state = moveChicken({
      state: {
        ...TEST_FARM,
        bumpkin: INITIAL_BUMPKIN,
        chickens: {
          123: {
            coordinates: {
              x: 1,
              y: 1,
            },
            multiplier: 1,
          },
        },
      },
      action: {
        type: "chicken.moved",
        id: "123",
        coordinates: { x: 1, y: 1 },
      },
    });

    expect(state.chickens["123"].coordinates).toEqual({ x: 1, y: 1 });
  });

  it("does not move chicken when fed and within Bale AoE", () => {
    expect(() =>
      moveChicken({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          collectibles: {
            Bale: [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "1",
                readyAt: 0,
              },
            ],
          },
          chickens: {
            1: {
              coordinates: {
                x: 0,
                y: 0,
              },
              multiplier: 1,
              fedAt: Date.now() - 1000,
            },
          },
        },
        action: {
          type: "chicken.moved",
          id: "1",
          coordinates: { x: 8, y: 8 },
        },
      }),
    ).toThrow(MOVE_CHICKEN_ERRORS.AOE_LOCKED);
  });

  it("moves a chicken within Bale AoE but egg ready", () => {
    const now = Date.now();
    const gameState = moveChicken({
      state: {
        ...TEST_FARM,
        bumpkin: INITIAL_BUMPKIN,
        collectibles: {
          Bale: [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        chickens: {
          123: {
            coordinates: {
              x: 0,
              y: 0,
            },
            multiplier: 1,
            // now - 48 hours
            fedAt: now - 172800000,
          },
        },
      },
      action: {
        type: "chicken.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.chickens).toEqual({
      "123": {
        coordinates: { x: 2, y: 2 },
        multiplier: 1,
        fedAt: now - 172800000,
      },
    });
  });
});
