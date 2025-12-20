import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
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

  it("prevents limited time items from being removed while active", () => {
    const now = Date.now();

    expect(() =>
      removeCollectible({
        state: {
          ...GAME_STATE,
          collectibles: {
            "Fox Shrine": [
              {
                id: "1",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now,
              },
            ],
          },
        },
        action: {
          location: "farm",
          type: "collectible.removed",
          name: "Fox Shrine",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow(REMOVE_COLLECTIBLE_ERRORS.LIMITED_ITEM_IN_USE);
  });

  it("allows limited time items to be removed once expired", () => {
    const now = Date.now();
    const cooldown = EXPIRY_COOLDOWNS["Fox Shrine"];
    const expiredAt = now - cooldown;

    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Fox Shrine": [
            {
              id: "1",
              createdAt: expiredAt,
              coordinates: { x: 1, y: 1 },
              readyAt: expiredAt,
            },
          ],
        },
      },
      action: {
        location: "farm",
        type: "collectible.removed",
        name: "Fox Shrine",
        id: "1",
      },
      createdAt: now,
    });

    expect(gameState.collectibles["Fox Shrine"]).toEqual([
      {
        id: "1",
        createdAt: expiredAt,
        readyAt: expiredAt,
        removedAt: now,
      },
    ]);
  });
});
