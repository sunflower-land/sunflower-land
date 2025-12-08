import Decimal from "decimal.js-light";

import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { craftCollectible } from "./craftCollectible";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";

const GAME_STATE: GameState = TEST_FARM;

describe("craftCollectible", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("throws an error if item is not craftable", () => {
    expect(() =>
      craftCollectible({
        state: GAME_STATE,
        action: {
          type: "collectible.crafted",
          name: "Sunflower Statue" as any,
        },
      }),
    ).toThrow("Item does not exist");
  });

  it("does not craft item if there is insufficient ingredients", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {},
        },
        action: {
          type: "collectible.crafted",
          name: "Immortal Pear",
        },
      }),
    ).toThrow("Insufficient ingredient: Gold");
  });

  it("does not craft item if there is insufficient coins", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          coins: 0,
          inventory: {
            Wood: new Decimal(100),
            Radish: new Decimal(60),
            Kale: new Decimal(40),
            Wheat: new Decimal(20),
          },
        },
        action: {
          type: "collectible.crafted",
          name: "Laurie the Chuckle Crow",
        },
      }),
    ).toThrow("Insufficient Coins");
  });

  it("crafts item if there is sufficient ingredients and no coin requirement", () => {
    const result = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 0,
        inventory: {
          Gold: new Decimal(5),
          Apple: new Decimal(10),
          Blueberry: new Decimal(10),
          Orange: new Decimal(10),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Immortal Pear",
      },
    });
    expect(result.inventory["Immortal Pear"]).toEqual(new Decimal(1));
  });

  it("increments Immortal Pear Crafted activity by 1 when 1 pear is crafted", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Gold: new Decimal(10),
          Apple: new Decimal(15),
          Orange: new Decimal(12),
          Blueberry: new Decimal(10),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Immortal Pear",
      },
    });

    expect(state.farmActivity["Immortal Pear Crafted"]).toBe(1);
  });

  it("requires ID does not exist", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Sunflower: new Decimal(150),
            "Basic Land": new Decimal(10),
            Sand: new Decimal(100),
            Hieroglyph: new Decimal(50),
          },
          buildings: {},
          collectibles: {
            "Treasure Map": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "collectible.crafted",
          name: "Treasure Map",
          coordinates: { x: 0, y: 5 },
          id: "123",
        },
      }),
    ).toThrow("ID already exists");
  });

  it("requires decoration does not collide", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Sunflower: new Decimal(150),
            "Basic Land": new Decimal(10),
            Sand: new Decimal(100),
            Hieroglyph: new Decimal(50),
          },
          buildings: {},
          collectibles: {
            "Treasure Map": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "collectible.crafted",
          name: "Treasure Map",
          coordinates: { x: 0, y: 0 },
          id: "456",
        },
      }),
    ).toThrow("Decoration collides");
  });

  it("places decoration", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Sunflower: new Decimal(150),
          "Basic Land": new Decimal(10),
          Sand: new Decimal(100),
          Hieroglyph: new Decimal(50),
        },
        buildings: {},
        collectibles: {},
      },
      action: {
        type: "collectible.crafted",
        name: "Treasure Map",
        coordinates: { x: 0, y: 5 },
        id: "456",
      },
    });

    expect(state.collectibles["Treasure Map"]?.[0]?.coordinates).toEqual({
      x: 0,
      y: 5,
    });
  });

  it("throws an error if key already bought today", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            "Treasure Key": new Decimal(0),
            ...ARTEFACT_SHOP_KEYS["Treasure Key"].ingredients,
          },
          pumpkinPlaza: {
            keysBought: {
              factionShop: {},
              treasureShop: {
                "Treasure Key": {
                  boughtAt: new Date("2024-08-09").getTime(),
                },
              },
              megastore: {},
            },
          },
        },
        action: {
          type: "collectible.crafted",
          name: "Treasure Key",
        },
        createdAt: new Date("2024-08-09").getTime(),
      }),
    ).toThrow("Already bought today");
  });

  it("updates createdAt when key is bought", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          ...ARTEFACT_SHOP_KEYS["Treasure Key"].ingredients,
          "Treasure Key": new Decimal(0),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Treasure Key",
      },
      createdAt: new Date("2024-09-01").getTime(),
    });
    expect(state.inventory["Treasure Key"]).toStrictEqual(new Decimal(1));
    expect(state.inventory.Hieroglyph).toStrictEqual(new Decimal(0));
    expect(state.inventory.Sand).toStrictEqual(new Decimal(0));
    expect(
      state.pumpkinPlaza.keysBought?.treasureShop["Treasure Key"]?.boughtAt,
    ).toEqual(new Date("2024-09-01").getTime());
  });

  it("tracks the bumpkin activity", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 25000,
        inventory: {
          "Wild Mushroom": new Decimal(20),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Fairy Circle",
      },
    });
    expect(state.inventory["Fairy Circle"]).toEqual(new Decimal(1));
    expect(state.farmActivity["Coins Spent"]).toBe(25000);
  });

  it("prevents crafting a helios item twice", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 200,
        inventory: {
          Gold: new Decimal(20),
          Apple: new Decimal(30),
          Orange: new Decimal(24),
          Blueberry: new Decimal(20),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Immortal Pear",
      },
    });

    expect(() =>
      craftCollectible({
        state: state,
        action: {
          type: "collectible.crafted",
          name: "Immortal Pear",
        },
      }),
    ).toThrow("Inventory limit reached");
  });

  it("prevents crafting treasure map twice", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          Sand: new Decimal(100),
          Hieroglyph: new Decimal(50),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Treasure Map",
      },
    });

    expect(() =>
      craftCollectible({
        state: state,
        action: {
          type: "collectible.crafted",
          name: "Treasure Map",
        },
      }),
    ).toThrow("Inventory limit reached");
  });

  it("prevents crafting potion house items twice", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          "Potion Ticket": new Decimal(20000),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Lab Grown Carrot",
      },
    });

    expect(() =>
      craftCollectible({
        state: state,
        action: {
          type: "collectible.crafted",
          name: "Lab Grown Carrot",
        },
      }),
    ).toThrow("Inventory limit reached");
  });
});
