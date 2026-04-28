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
    expect(gameState.farmActivity["Collectible Removed"]).toBe(1);
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

  it("removes a collectible placed in the interior (ground)", () => {
    const now = 1700000000000;
    const gameState = removeCollectible({
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
        location: "interior",
        type: "collectible.removed",
        name: "Abandoned Bear",
        id: "ground-1",
      },
      createdAt: now,
    });

    expect(gameState.interior.ground.collectibles["Abandoned Bear"]).toEqual([
      {
        id: "ground-1",
        createdAt: 0,
        readyAt: 0,
        removedAt: now,
      },
    ]);
  });

  it("does not remove an interior collectible with an unknown id", () => {
    expect(() =>
      removeCollectible({
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
          location: "interior",
          type: "collectible.removed",
          name: "Abandoned Bear",
          id: "missing",
        },
      }),
    ).toThrow(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  });

  it("removes a collectible placed in level_one", () => {
    const now = 1700000000000;
    const gameState = removeCollectible({
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
        location: "level_one",
        type: "collectible.removed",
        name: "Abandoned Bear",
        id: "lo-1",
      },
      createdAt: now,
    });

    expect(
      gameState.interior.level_one!.collectibles["Abandoned Bear"],
    ).toEqual([
      {
        id: "lo-1",
        createdAt: 0,
        readyAt: 0,
        removedAt: now,
      },
    ]);
  });

  it("rejects removing on level_one before the upgrade has been bought", () => {
    expect(() =>
      removeCollectible({
        state: {
          ...GAME_STATE,
          interior: {
            ground: { collectibles: {} },
            // level_one purposely missing
          },
        },
        action: {
          location: "level_one",
          type: "collectible.removed",
          name: "Abandoned Bear",
          id: "lo-1",
        },
      }),
    ).toThrow("Level one floor has not been unlocked");
  });
});
