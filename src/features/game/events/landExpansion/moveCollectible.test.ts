import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { MOVE_COLLECTIBLE_ERRORS, moveCollectible } from "./moveCollectible";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

describe("moveCollectible", () => {
  const dateNow = Date.now();
  it("throws if player has no Bumpkin", () => {
    expect(() =>
      moveCollectible({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "collectible.moved",
          name: "Algerian Flag",
          id: "1",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow(MOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  });
  it("does not move non-existent building ", () => {
    expect(() =>
      moveCollectible({
        state: {
          ...GAME_STATE,
          collectibles: {
            "Abandoned Bear": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "collectible.moved",
          name: "Algerian Flag",
          id: "1",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow(MOVE_COLLECTIBLE_ERRORS.NO_COLLECTIBLES);
  });

  it("does not move building with invalid id", () => {
    expect(() =>
      moveCollectible({
        state: {
          ...GAME_STATE,
          collectibles: {
            "Algerian Flag": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "collectible.moved",
          name: "Algerian Flag",
          id: "1",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow(MOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_NOT_PLACED);
  });

  it("moves a collectible", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Abandoned Bear": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "456",
              coordinates: { x: 4, y: 4 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "789",
              coordinates: { x: 8, y: 8 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "collectible.moved",
        name: "Abandoned Bear",
        id: "123",
        coordinates: { x: 2, y: 2 },
        location: "farm",
      },
    });

    expect(gameState.collectibles["Abandoned Bear"]).toEqual([
      {
        id: "123",
        coordinates: { x: 2, y: 2 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "456",
        coordinates: { x: 4, y: 4 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "789",
        coordinates: {
          x: 8,
          y: 8,
        },
        createdAt: 0,
        readyAt: 0,
      },
    ]);
  });

  it("does not updates readyAt when moving Nancy", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        collectibles: {
          Nancy: [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "456",
              coordinates: { x: 4, y: 4 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "789",
              coordinates: { x: 8, y: 8 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "collectible.moved",
        name: "Nancy",
        id: "123",
        coordinates: { x: 2, y: 2 },
        location: "farm",
      },
      createdAt: dateNow,
    });

    expect(gameState.collectibles["Nancy"]).toEqual([
      {
        id: "123",
        coordinates: { x: 2, y: 2 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "456",
        coordinates: { x: 4, y: 4 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "789",
        coordinates: {
          x: 8,
          y: 8,
        },
        createdAt: 0,
        readyAt: 0,
      },
    ]);
  });

  it("throws when trying to move Bale with chickens fed", () => {
    const dateNow = Date.now();

    expect(() =>
      moveCollectible({
        state: {
          ...GAME_STATE,
          chickens: {
            0: {
              fedAt: dateNow,
              multiplier: 1,
            },
          },
          collectibles: {
            Bale: [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "collectible.moved",
          name: "Bale",
          id: "123",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Chickens are fed");
  });
});
