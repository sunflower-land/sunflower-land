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

  it("moves a collectible placed in the interior (ground)", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        interior: {
          ground: {
            collectibles: {
              "Abandoned Bear": [
                {
                  id: "ground-1",
                  coordinates: { x: 0, y: 0 },
                  createdAt: 0,
                  readyAt: 0,
                },
                {
                  id: "ground-2",
                  coordinates: { x: 3, y: 4 },
                  createdAt: 0,
                  readyAt: 0,
                },
              ],
            },
          },
        },
      },
      action: {
        type: "collectible.moved",
        name: "Abandoned Bear",
        id: "ground-1",
        coordinates: { x: 5, y: 6 },
        location: "interior",
      },
    });

    expect(gameState.interior.ground.collectibles["Abandoned Bear"]).toEqual([
      {
        id: "ground-1",
        coordinates: { x: 5, y: 6 },
        createdAt: 0,
        readyAt: 0,
      },
      {
        id: "ground-2",
        coordinates: { x: 3, y: 4 },
        createdAt: 0,
        readyAt: 0,
      },
    ]);
  });

  it("does not move an interior collectible with an unknown id", () => {
    expect(() =>
      moveCollectible({
        state: {
          ...GAME_STATE,
          interior: {
            ground: {
              collectibles: {
                "Abandoned Bear": [
                  {
                    id: "ground-1",
                    coordinates: { x: 0, y: 0 },
                    createdAt: 0,
                    readyAt: 0,
                  },
                ],
              },
            },
          },
        },
        action: {
          type: "collectible.moved",
          name: "Abandoned Bear",
          id: "missing",
          coordinates: { x: 1, y: 1 },
          location: "interior",
        },
      }),
    ).toThrow(MOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_NOT_PLACED);
  });

  it("moves a collectible placed in level_one", () => {
    const gameState = moveCollectible({
      state: {
        ...GAME_STATE,
        interior: {
          ground: { collectibles: {} },
          expansion: "level-one-start",
          level_one: {
            collectibles: {
              "Abandoned Bear": [
                {
                  id: "lo-1",
                  coordinates: { x: 0, y: 0 },
                  createdAt: 0,
                  readyAt: 0,
                },
              ],
            },
          },
        },
      },
      action: {
        type: "collectible.moved",
        name: "Abandoned Bear",
        id: "lo-1",
        coordinates: { x: 7, y: 8 },
        location: "level_one",
      },
    });

    expect(
      gameState.interior.level_one!.collectibles["Abandoned Bear"],
    ).toEqual([
      {
        id: "lo-1",
        coordinates: { x: 7, y: 8 },
        createdAt: 0,
        readyAt: 0,
      },
    ]);
  });

  it("rejects moving on level_one before the upgrade has been bought", () => {
    expect(() =>
      moveCollectible({
        state: {
          ...GAME_STATE,
          interior: {
            ground: { collectibles: {} },
            // level_one purposely missing
          },
        },
        action: {
          type: "collectible.moved",
          name: "Abandoned Bear",
          id: "lo-1",
          coordinates: { x: 7, y: 8 },
          location: "level_one",
        },
      }),
    ).toThrow("Level one floor has not been unlocked");
  });
});
