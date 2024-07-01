import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { makeChickens } from "./removeBuilding.test";
import {
  removeCollectible,
  REMOVE_COLLECTIBLE_ERRORS,
} from "./removeCollectible";
import { SEEDS } from "features/game/types/seeds";
import { FRUIT_SEEDS } from "features/game/types/fruits";
import { FLOWER_SEEDS } from "features/game/types/flowers";

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
    });

    expect(gameState.collectibles.Nugget).toEqual([
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

  it("uses one Rusty Shovel per collectible removed", () => {
    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
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
        id: "123",
      },
    });

    expect(gameState.inventory["Rusty Shovel"]).toEqual(new Decimal(1));
  });

  it("does not remove chicken coop if unsupported chickens are brewing", () => {
    const gameState = {
      ...GAME_STATE,
      inventory: {
        "Rusty Shovel": new Decimal(2),
      },
      chickens: makeChickens(15),
      collectibles: {
        "Chicken Coop": [
          {
            id: "123",
            createdAt: 0,
            coordinates: { x: 1, y: 1 },
            readyAt: 0,
          },
        ],
      },
      buildings: {
        "Hen House": [
          {
            id: "123",
            coordinates: { x: 1, y: 1 },
            createdAt: 0,
            readyAt: 0,
          },
        ],
      },
    };
    gameState.chickens["12"].fedAt = 1;
    expect(() =>
      removeCollectible({
        state: gameState,
        action: {
          location: "farm",
          type: "collectible.removed",
          name: "Chicken Coop",
          id: "123",
        },
      }),
    ).toThrow(REMOVE_COLLECTIBLE_ERRORS.CHICKEN_COOP_REMOVE_BREWING_CHICKEN);
  });

  it("removes 5 chickens if chicken coop is removed and one hen house placed", () => {
    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        chickens: makeChickens(15),
        collectibles: {
          "Chicken Coop": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
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
        location: "farm",
        type: "collectible.removed",
        name: "Chicken Coop",
        id: "123",
      },
    });

    expect(getKeys(gameState.chickens).length).toEqual(10);
  });

  it("removes 10 chickens if chicken coop is removed and two hen houses are placed", () => {
    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        chickens: makeChickens(30),
        collectibles: {
          "Chicken Coop": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
            {
              id: "345",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        location: "farm",
        type: "collectible.removed",
        name: "Chicken Coop",
        id: "123",
      },
    });

    expect(getKeys(gameState.chickens).length).toEqual(20);
  });

  it("removes the collectible key if there are none of the type placed", () => {
    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        chickens: makeChickens(30),
        collectibles: {
          "Rock Golem": [
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
        name: "Rock Golem",
        id: "123",
      },
    });

    expect(gameState.collectibles["Rock Golem"]).toBeUndefined();
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

  it("burns all seeds if a Kuebiko is removed", () => {
    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        crops: {},
        inventory: {
          Kuebiko: new Decimal(1),
          ...Object.fromEntries(
            Object.entries(SEEDS()).map(([name]) => [name, new Decimal(1)]),
          ),
          ...Object.fromEntries(
            Object.entries(FRUIT_SEEDS()).map(([name]) => [
              name,
              new Decimal(1),
            ]),
          ),
          ...Object.fromEntries(
            Object.entries(FLOWER_SEEDS()).map(([name]) => [
              name,
              new Decimal(1),
            ]),
          ),
        },
        collectibles: {
          Kuebiko: [
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
        name: "Kuebiko",
        id: "123",
      },
    });

    expect(gameState.inventory).toStrictEqual({ Kuebiko: new Decimal(1) });
  });

  it("burns all flower seeds if a Hungry Caterpillar is removed", () => {
    const fruitSeeds = Object.fromEntries(
      Object.entries(FRUIT_SEEDS()).map(([name]) => [name, new Decimal(1)]),
    );

    const gameState = removeCollectible({
      state: {
        ...GAME_STATE,
        crops: {},
        inventory: {
          "Hungry Caterpillar": new Decimal(1),
          ...Object.fromEntries(
            Object.entries(FLOWER_SEEDS()).map(([name]) => [
              name,
              new Decimal(1),
            ]),
          ),
          ...fruitSeeds,
        },
        collectibles: {
          "Hungry Caterpillar": [
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
        name: "Hungry Caterpillar",
        id: "123",
      },
    });

    expect(gameState.inventory).toStrictEqual({
      "Hungry Caterpillar": new Decimal(1),
      ...fruitSeeds,
    });
  });
});
