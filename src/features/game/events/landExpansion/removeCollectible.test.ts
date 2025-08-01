import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  removeCollectible,
  REMOVE_COLLECTIBLE_ERRORS,
} from "./removeCollectible";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

describe("removeCollectible", () => {
  it("does not remove non-existent collectible ", () => {
    expect(() =>
      removeCollectible({
        state: {
          ...GAME_STATE,
          collectibles: {
            Nugget: [
              {
                id: "123",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          location: "farm",
          type: "collectible.removed",
          name: "Algerian Flag",
          id: "1",
        },
      }),
    ).toThrow(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  });

  it("does not remove collectible with invalid id", () => {
    expect(() =>
      removeCollectible({
        state: {
          ...GAME_STATE,
          collectibles: {
            Nugget: [
              {
                id: "123",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          location: "farm",
          type: "collectible.removed",
          name: "Nugget",
          id: "1",
        },
      }),
    ).toThrow(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  });

  it("removes a collectible and does not affect collectibles of the same type", () => {
    const dateNow = Date.now();
    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(1),
        },
        collectibles: {
          Nugget: [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
            {
              id: "456",
              createdAt: 0,
              coordinates: { x: 4, y: 4 },
              readyAt: 0,
            },
            {
              id: "789",
              createdAt: 0,
              coordinates: { x: 8, y: 8 },
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        location: "farm",
        type: "collectible.removed",
        name: "Nugget",
        id: "123",
      },
      createdAt: dateNow,
    });

    expect(gameState.collectibles.Nugget).toEqual([
      {
        id: "123",
        createdAt: 0,
        readyAt: 0,
        removedAt: dateNow,
      },
      {
        id: "456",
        createdAt: 0,
        coordinates: { x: 4, y: 4 },
        readyAt: 0,
      },
      {
        id: "789",
        createdAt: 0,
        coordinates: { x: 8, y: 8 },
        readyAt: 0,
      },
    ]);
  });

  it("it prevents a genie lamp from being removed if it is in use", () => {
    expect(() =>
      removeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            "Rusty Shovel": new Decimal(2),
          },
          collectibles: {
            "Genie Lamp": [
              {
                id: "123",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
                rubbedCount: 1,
              },
            ],
          },
        },
        action: {
          location: "farm",
          type: "collectible.removed",
          name: "Genie Lamp",
          id: "123",
        },
      }),
    ).toThrow("Genie Lamp is in use");
  });
});
