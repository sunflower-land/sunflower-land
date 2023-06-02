import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { MOVE_COLLECTIBLE_ERRORS, moveCollectible } from "./moveCollectible";
import { COLLECTIBLE_PLACE_SECONDS } from "./placeCollectible";

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
        },
      })
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
        },
      })
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
        },
      })
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

  it("updates readyAt when moving Basic Scarecrow", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Basic Scarecrow": [
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
        name: "Basic Scarecrow",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
      createdAt: dateNow,
    });

    expect(gameState.collectibles["Basic Scarecrow"]).toEqual([
      {
        id: "123",
        coordinates: { x: 2, y: 2 },
        createdAt: 0,
        readyAt: dateNow + 10 * 60 * 1000,
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

  it("updates readyAt when moving Emerald Turtle", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Emerald Turtle": [
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
        name: "Emerald Turtle",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
      createdAt: dateNow,
    });

    expect(gameState.collectibles["Emerald Turtle"]).toEqual([
      {
        id: "123",
        coordinates: { x: 2, y: 2 },
        createdAt: 0,
        readyAt: dateNow + COLLECTIBLE_PLACE_SECONDS["Emerald Turtle"]! * 1000,
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

  it("updates readyAt when moving Tin Turtle", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Tin Turtle": [
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
        name: "Tin Turtle",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
      createdAt: dateNow,
    });

    expect(gameState.collectibles["Tin Turtle"]).toEqual([
      {
        id: "123",
        coordinates: { x: 2, y: 2 },
        createdAt: 0,
        readyAt: dateNow + COLLECTIBLE_PLACE_SECONDS["Tin Turtle"]! * 1000,
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
});
