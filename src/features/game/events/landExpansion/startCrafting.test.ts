/* eslint-disable no-var */
import { CONFIG } from "lib/config";
import Decimal from "decimal.js-light";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { startCrafting, type StartCraftingAction } from "./startCrafting";
import { getCraftingQueueReadyAts } from "features/game/lib/craftingReadiness";
import { INITIAL_FARM } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import {
  type RecipeCollectibleName,
  RECIPES,
} from "features/game/lib/crafting";

describe("startCrafting", () => {
  // These tests assert the LEGACY discount-at-start timing (every boost is baked
  // into readyAt when the craft is queued). FE jest runs on amoy where
  // SPEED_BOOSTS is on, so force the flag off here; the windowed model is covered
  // in its own describe.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const farmId = 1;
  let gameState: GameState;

  beforeEach(() => {
    gameState = {
      ...INITIAL_FARM,
      buildings: {
        "Crafting Box": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
          },
        ],
      },
      inventory: {
        Wood: new Decimal(10),
        Stone: new Decimal(10),
        Leather: new Decimal(10),
        Wool: new Decimal(10),
      },
      craftingBox: {
        status: "idle",
        startedAt: 0,
        readyAt: 0,
        recipes: {},
      },
    };
  });

  it("sets the crafting status to pending", () => {
    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        { collectible: "Stone" },
      ],
    };

    const newState = startCrafting({ farmId, state: gameState, action });

    expect(newState.craftingBox.status).toBe("pending");
  });

  it("crafts base instant recipes immediately", () => {
    gameState.craftingBox.recipes = {
      Timber: {
        name: "Timber",
        type: "collectible",
        ingredients: [
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
        ],
        time: 0,
      },
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
      ],
    };

    const newState = startCrafting({ farmId, state: gameState, action });

    expect(newState.craftingBox.status).toBe("idle");
    expect(newState.craftingBox.queue).toHaveLength(0);
    expect(newState.inventory.Wood).toStrictEqual(new Decimal(1));
    expect(newState.inventory.Timber).toStrictEqual(new Decimal(1));
    expect(newState.craftingBox.recipes.Timber).toBeDefined();
    expect(newState.farmActivity["Timber Crafting Started"]).toBe(1);
    expect(newState.farmActivity["Timber Crafted"]).toBe(1);
  });

  const instantRecipeFixtures: [RecipeCollectibleName, InventoryItemName][] = [
    ["Bee Box", "Honey"],
    ["Crimsteel", "Crimstone"],
    ["Cushion", "Feather"],
    ["Hardened Leather", "Leather"],
    ["Kelp Fibre", "Seaweed"],
    ["Merino Cushion", "Merino Wool"],
    ["Ocean's Treasure", "Pearl"],
    ["Royal Bedding", "Cushion"],
    ["Royal Ornament", "Gold"],
    ["Synthetic Fabric", "Wool"],
    ["Timber", "Wood"],
  ];

  it("keeps fixtures aligned with all zero-time recipes", () => {
    const zeroTimeRecipes = Object.values(RECIPES)
      .filter((recipe) => recipe.time === 0)
      .map((recipe) => recipe.name)
      .sort();

    expect(instantRecipeFixtures.map(([name]) => name).sort()).toEqual(
      zeroTimeRecipes,
    );
  });

  it.each(instantRecipeFixtures)(
    "crafts %s immediately",
    (recipeName, ingredientName) => {
      const ingredients = Array.from({ length: 9 }, () => ({
        collectible: ingredientName,
      }));

      gameState.inventory[ingredientName] = new Decimal(9);
      gameState.craftingBox.recipes = {
        [recipeName]: {
          ...RECIPES[recipeName],
          ingredients,
        },
      };

      const state = startCrafting({
        farmId,
        state: gameState,
        action: {
          type: "crafting.started",
          queueItemId: "test-id",
          ingredients,
        },
      });

      expect(state.craftingBox.status).toBe("idle");
      expect(state.craftingBox.queue).toHaveLength(0);
      expect(state.inventory[ingredientName]).toStrictEqual(new Decimal(0));
      expect(state.inventory[recipeName]).toStrictEqual(new Decimal(1));
      expect(state.farmActivity[`${recipeName} Crafting Started`]).toBe(1);
      expect(state.farmActivity[`${recipeName} Crafted`]).toBe(1);
    },
  );

  it("throws an error if the player doesn't have a Crafting Box", () => {
    gameState.buildings["Crafting Box"] = [];

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "You do not have a Crafting Box",
    );
  });

  it("throws an error if the Crafting Box is not placed", () => {
    gameState.buildings["Crafting Box"] = [
      {
        id: "123",
        coordinates: undefined,
        createdAt: 0,
        readyAt: 0,
      },
    ];

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "You do not have a Crafting Box",
    );
  });

  it("throws an error if there's no available slots (queue full)", () => {
    const now = Date.now();
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "test-id",
          name: "Timber",
          readyAt: now + 60000,
          startedAt: now,
          type: "collectible",
        },
      ],
      startedAt: now,
      readyAt: now + 60000,
      recipes: {},
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id1",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "No available slots",
    );
  });

  it("does not change status when invalid recipe is attempted with non-empty queue", () => {
    const now = Date.now();
    gameState.vip = { bundles: [], expiresAt: now + 86400000 };
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "test-id",
          name: "Timber",
          readyAt: now + 60000,
          startedAt: now,
          type: "collectible",
        },
      ],
      startedAt: now,
      readyAt: now + 60000,
      recipes: {
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id1",
      ingredients: [null, null, null, null, null, null, null, null, null],
    };

    const newState = startCrafting({ farmId, state: gameState, action });

    expect(newState.craftingBox.status).toBe("crafting");
    expect(newState.craftingBox.queue).toHaveLength(1);
  });

  it("blocks new craft when queue fills the slot", () => {
    const now = Date.now();
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "timber-1",
          name: "Timber",
          startedAt: now,
          readyAt: now + 60000,
          type: "collectible",
        },
      ],
      recipes: {
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Wool" },
        { collectible: "Wool" },
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Leather" },
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "No available slots",
    );
  });

  it("crafts base instant recipes without collecting existing ready queue items", () => {
    const now = Date.now();
    gameState.inventory.Wood = new Decimal(19);
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "ready-bed",
          name: "Basic Bed",
          startedAt: now - 60000,
          readyAt: now - 1000,
          type: "collectible",
        },
      ],
      recipes: {
        Timber: {
          name: "Timber",
          type: "collectible",
          ingredients: [
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
          ],
          time: 0,
        },
      },
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "timber-2",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Wood" },
      ],
    };

    const state = startCrafting({
      farmId,
      state: gameState,
      action,
      createdAt: now,
    });

    expect(state.craftingBox.queue).toHaveLength(1);
    expect(state.craftingBox.queue?.[0].id).toBe("ready-bed");
    expect(state.inventory["Basic Bed"]).toBeUndefined();
    expect(state.inventory.Timber).toStrictEqual(new Decimal(1));
    expect(state.inventory.Wood).toStrictEqual(new Decimal(10));
    expect(state.farmActivity["Timber Crafting Started"]).toBe(1);
    expect(state.farmActivity["Timber Crafted"]).toBe(1);
  });

  it("crafts base instant recipes when all queue slots are full", () => {
    const now = Date.now();
    gameState.inventory.Wood = new Decimal(19);
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "busy-slot",
          name: "Basic Bed",
          startedAt: now,
          readyAt: now + 60000,
          type: "collectible",
        },
      ],
      recipes: {
        Timber: {
          name: "Timber",
          type: "collectible",
          ingredients: [
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
            { collectible: "Wood" },
          ],
          time: 0,
        },
      },
    };

    const state = startCrafting({
      farmId,
      state: gameState,
      action: {
        type: "crafting.started",
        queueItemId: "timber-2",
        ingredients: [
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
          { collectible: "Wood" },
        ],
      },
      createdAt: now,
    });

    expect(state.craftingBox.status).toBe("crafting");
    expect(state.craftingBox.queue).toHaveLength(1);
    expect(state.craftingBox.queue?.[0].id).toBe("busy-slot");
    expect(state.inventory["Basic Bed"]).toBeUndefined();
    expect(state.inventory.Timber).toStrictEqual(new Decimal(1));
    expect(state.inventory.Wood).toStrictEqual(new Decimal(10));
    expect(state.farmActivity["Timber Crafting Started"]).toBe(1);
    expect(state.farmActivity["Timber Crafted"]).toBe(1);
  });

  it("throws an error if the player provides less than 9 ingredients", () => {
    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "You must provide 9 ingredients",
    );
  });

  it("throws an error if the player provides more than 9 ingredients", () => {
    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
        { collectible: "Wood" },
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "You must provide 9 ingredients",
    );
  });

  it("if recipes exists - throws if the player doesn't have the ingredients", () => {
    gameState.craftingBox.recipes = {
      Doll: {
        name: "Doll",
        type: "collectible",
        ingredients: [
          null,
          null,
          null,
          null,
          { collectible: "Stone" },
          null,
          null,
          null,
          null,
        ],
        time: 0,
      },
    };
    gameState.inventory.Stone = new Decimal(0);

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        null,
        null,
        null,
        null,
        { collectible: "Stone" },
        null,
        null,
        null,
        null,
      ],
    };

    expect(() => startCrafting({ farmId, state: gameState, action })).toThrow(
      "You do not have the ingredients to craft this item",
    );
  });

  it("if recipes exists - subtracts the ingredients from the player's inventory", () => {
    gameState.inventory.Stone = new Decimal(1);

    gameState.craftingBox.recipes = {
      Doll: {
        name: "Doll",
        type: "collectible",
        ingredients: [
          null,
          null,
          null,
          null,
          { collectible: "Stone" },
          null,
          null,
          null,
          null,
        ],
        time: 0,
      },
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        null,
        null,
        null,
        null,
        { collectible: "Stone" },
        null,
        null,
        null,
        null,
      ],
    };

    const state = startCrafting({ farmId, state: gameState, action });

    expect(state.inventory.Stone).toStrictEqual(new Decimal(0));
  });

  it("if recipes exists - does not allow crafting when the ingredient is placed", () => {
    gameState.craftingBox.recipes = {
      "Sturdy Bed": {
        name: "Sturdy Bed",
        type: "collectible",
        ingredients: [
          { collectible: "Merino Cushion" },
          { collectible: "Merino Cushion" },
          { collectible: "Merino Cushion" },
          { collectible: "Crimsteel" },
          { collectible: "Crimsteel" },
          { collectible: "Crimsteel" },
          { collectible: "Crimsteel" },
          { collectible: "Basic Bed" },
          { collectible: "Crimsteel" },
        ],
        time: 0,
      },
    };

    gameState.inventory["Basic Bed"] = new Decimal(1);
    gameState.inventory["Merino Cushion"] = new Decimal(3);
    gameState.inventory["Crimsteel"] = new Decimal(5);

    gameState.collectibles = {};
    gameState.collectibles["Basic Bed"] = [
      {
        id: "123",
        coordinates: { x: 0, y: 0 },
        createdAt: 0,
        readyAt: 0,
      },
    ];

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id",
      ingredients: [
        { collectible: "Merino Cushion" },
        { collectible: "Merino Cushion" },
        { collectible: "Merino Cushion" },
        { collectible: "Crimsteel" },
        { collectible: "Crimsteel" },
        { collectible: "Crimsteel" },
        { collectible: "Crimsteel" },
        { collectible: "Basic Bed" },
        { collectible: "Crimsteel" },
      ],
    };

    expect(() =>
      startCrafting({ farmId, state: { ...gameState }, action }),
    ).toThrow("You do not have the ingredients to craft this item");
  });

  it("allows adding to queue when VIP and one item is crafting", () => {
    const counter = (() => {
      let c = 0;
      while (
        !prngChance({
          farmId,
          itemId: KNOWN_IDS["Doll"],
          counter: c,
          chance: 10,
          criticalHitName: "Fox Shrine",
        })
      ) {
        c++;
      }
      return c;
    })();
    const now = Date.now();
    gameState.vip = {
      bundles: [],
      expiresAt: now + 86400000,
    };
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "test-id",
          name: "Doll",
          readyAt: now + 60000,
          startedAt: now,
          type: "collectible",
        },
      ],
      startedAt: now,
      readyAt: now + 60000,
      recipes: {
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };
    gameState.inventory = {
      Leather: new Decimal(10),
      Wool: new Decimal(10),
    };
    gameState.collectibles = {
      "Fox Shrine": [
        {
          id: "123",
          coordinates: { x: 0, y: 0 },
          createdAt: now,
          readyAt: now,
        },
      ],
    };
    gameState.farmActivity = { "Doll Crafting Started": counter };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "test-id1",
      ingredients: [
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Wool" },
        { collectible: "Wool" },
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Leather" },
      ],
    };

    const newState = startCrafting({
      farmId,
      state: gameState,
      action,
      createdAt: now,
    });

    expect(newState.craftingBox.queue).toHaveLength(2);
    expect(newState.craftingBox.queue?.[0].name).toBe("Doll");
    expect(newState.craftingBox.queue?.[1].name).toBe("Doll");
    expect(newState.craftingBox.queue?.[1].readyAt).toBe(now);
    expect(newState.craftingBox.queue?.[1].startedAt).toBe(now);
  });

  it("increments X Crafting Started when adding to queue", () => {
    const now = Date.now();
    gameState.vip = {
      bundles: [],
      expiresAt: now + 86400000,
    };
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "test-id",
          name: "Doll",
          readyAt: now + 60000,
          startedAt: now,
          type: "collectible",
        },
      ],
      startedAt: now,
      readyAt: now + 60000,
      recipes: {
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };
    gameState.inventory = {
      Leather: new Decimal(10),
      Wool: new Decimal(10),
    };
    gameState.farmActivity = { "Doll Crafting Started": 1 };

    const newState = startCrafting({
      farmId,
      state: gameState,
      action: {
        queueItemId: "test-id1",
        type: "crafting.started",
        ingredients: [
          { collectible: "Leather" },
          { collectible: "Wool" },
          { collectible: "Leather" },
          { collectible: "Wool" },
          { collectible: "Wool" },
          { collectible: "Wool" },
          { collectible: "Leather" },
          { collectible: "Wool" },
          { collectible: "Leather" },
        ],
      },
      createdAt: now,
    });

    expect(newState.farmActivity["Doll Crafting Started"]).toBe(2);
  });

  it("each queued item gets unique Fox Shrine roll via X Crafting Started", () => {
    const now = Date.now();
    gameState.vip = {
      bundles: [],
      expiresAt: now + 86400000,
    };
    gameState.craftingBox = {
      status: "crafting",
      queue: [],
      startedAt: now,
      readyAt: now,
      recipes: {
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };
    gameState.inventory = {
      Leather: new Decimal(20),
      Wool: new Decimal(25),
    };
    gameState.collectibles = {
      "Fox Shrine": [
        {
          id: "123",
          coordinates: { x: 0, y: 0 },
          createdAt: now,
          readyAt: now,
        },
      ],
    };

    let state = gameState;
    for (let i = 0; i < 4; i++) {
      state = startCrafting({
        farmId,
        state,
        action: {
          queueItemId: `test-id-${i}`,
          type: "crafting.started",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
        },
        createdAt: now,
      });
    }

    expect(state.farmActivity["Doll Crafting Started"]).toBe(4);
    const readyAts = state.craftingBox.queue!.map((q) => q.readyAt);
    const uniqueReadyAts = new Set(readyAts);
    expect(uniqueReadyAts.size).toBeGreaterThan(1);
  });

  it("applies a 10% chance to instantly craft a recipe when Fox Shrine is active", () => {
    function getCounter() {
      let counter = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (
          prngChance({
            farmId,
            itemId: KNOWN_IDS["Basic Bed"],
            counter,
            chance: 10,
            criticalHitName: "Fox Shrine",
          })
        ) {
          return counter;
        }
        counter++;
      }
    }

    const counter = getCounter();
    const now = Date.now();

    const state = startCrafting({
      farmId,
      state: {
        ...gameState,
        craftingBox: {
          ...gameState.craftingBox,
          recipes: {
            "Basic Bed": {
              name: "Basic Bed",
              type: "collectible",
              ingredients: [
                { collectible: "Cushion" },
                { collectible: "Cushion" },
                { collectible: "Cushion" },
                { collectible: "Timber" },
                { collectible: "Cushion" },
                { collectible: "Timber" },
                { collectible: "Timber" },
                { collectible: "Timber" },
                { collectible: "Timber" },
              ],
              time: 8 * 60 * 60 * 1000,
            },
          },
        },
        collectibles: {
          "Fox Shrine": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              readyAt: now,
            },
          ],
        },
        inventory: {
          Cushion: new Decimal(4),
          Timber: new Decimal(5),
          "Fox Shrine": new Decimal(1),
        },
        farmActivity: {
          "Basic Bed Crafting Started": counter,
        },
      },
      action: {
        type: "crafting.started",
        queueItemId: "test-id",
        ingredients: [
          { collectible: "Cushion" },
          { collectible: "Cushion" },
          { collectible: "Cushion" },
          { collectible: "Timber" },
          { collectible: "Cushion" },
          { collectible: "Timber" },
          { collectible: "Timber" },
          { collectible: "Timber" },
          { collectible: "Timber" },
        ],
      },
      createdAt: now,
    });

    expect(state.craftingBox.queue?.[0].readyAt).toBe(now);
  });

  it("makes instant recipe immediately ready when added to a non-empty queue", () => {
    const counter = (() => {
      let c = 0;
      while (
        !prngChance({
          farmId,
          itemId: KNOWN_IDS["Doll"],
          counter: c,
          chance: 10,
          criticalHitName: "Fox Shrine",
        })
      ) {
        c++;
      }
      return c;
    })();
    const now = Date.now();
    gameState.vip = {
      bundles: [],
      expiresAt: now + 86400000,
    };
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "test-id",
          name: "Basic Bed",
          readyAt: now + 60000,
          startedAt: now,
          type: "collectible",
        },
      ],
      startedAt: now,
      readyAt: now + 60000,
      recipes: {
        "Basic Bed": {
          name: "Basic Bed",
          type: "collectible",
          ingredients: [
            { collectible: "Cushion" },
            { collectible: "Cushion" },
            { collectible: "Cushion" },
            { collectible: "Timber" },
            { collectible: "Cushion" },
            { collectible: "Timber" },
            { collectible: "Timber" },
            { collectible: "Timber" },
            { collectible: "Timber" },
          ],
          time: 8 * 60 * 60 * 1000,
        },
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };
    gameState.inventory = {
      Cushion: new Decimal(4),
      Timber: new Decimal(5),
      Leather: new Decimal(10),
      Wool: new Decimal(10),
    };
    gameState.collectibles = {
      "Fox Shrine": [
        {
          id: "123",
          coordinates: { x: 0, y: 0 },
          createdAt: now,
          readyAt: now,
        },
      ],
    };
    gameState.farmActivity = { "Doll Crafting Started": counter };

    const state = startCrafting({
      farmId,
      state: gameState,
      action: {
        type: "crafting.started",
        queueItemId: "test-id1",
        ingredients: [
          { collectible: "Leather" },
          { collectible: "Wool" },
          { collectible: "Leather" },
          { collectible: "Wool" },
          { collectible: "Wool" },
          { collectible: "Wool" },
          { collectible: "Leather" },
          { collectible: "Wool" },
          { collectible: "Leather" },
        ],
      },
      createdAt: now,
    });

    expect(state.craftingBox.queue).toHaveLength(2);

    const instantItem = state.craftingBox.queue![1];
    expect(instantItem.name).toBe("Doll");
    expect(instantItem.readyAt).toBe(now);
    expect(instantItem.startedAt).toBe(now);
  });

  // A finished craft left uncollected keeps occupying a queue slot with a
  // readyAt in the past. A new craft must start "now", not chain off that past
  // readyAt — otherwise the elapsed wait is discounted from (or makes instant)
  // the next craft.
  it("does not discount the next craft when a finished item is left uncollected", () => {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    // Doll #1 finished 4h ago but was never collected.
    const finishedReadyAt = now - 4 * 60 * 60 * 1000;

    gameState.vip = { bundles: [], expiresAt: now + 86400000 };
    gameState.inventory = {
      Leather: new Decimal(10),
      Wool: new Decimal(10),
    };
    gameState.farmActivity = { "Doll Crafting Started": 1 };
    gameState.craftingBox = {
      status: "crafting",
      queue: [
        {
          id: "doll-finished",
          name: "Doll",
          startedAt: finishedReadyAt - twoHours,
          readyAt: finishedReadyAt,
          type: "collectible",
        },
      ],
      recipes: {
        Doll: {
          name: "Doll",
          type: "collectible",
          ingredients: [
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Wool" },
            { collectible: "Leather" },
            { collectible: "Wool" },
            { collectible: "Leather" },
          ],
          time: 2 * 60 * 60 * 1000,
        },
      },
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      queueItemId: "doll-2",
      ingredients: [
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Wool" },
        { collectible: "Wool" },
        { collectible: "Leather" },
        { collectible: "Wool" },
        { collectible: "Leather" },
      ],
    };

    const newState = startCrafting({
      state: gameState,
      action,
      createdAt: now,
      farmId,
    });

    const newItem = newState.craftingBox.queue?.find((q) => q.id === "doll-2");
    // Must start now and take the full 2h — not inherit the 4h waited.
    expect(newItem?.startedAt).toBe(now);
    expect(newItem?.readyAt).toBe(now + twoHours);
  });
});

describe("startCrafting — SPEED_BOOSTS", () => {
  // Pins the flag ON rather than relying on `.env`: a developer running with
  // VITE_NETWORK=mainnet would otherwise see this whole describe fail.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const farmId = 1;
  const HOUR = 60 * 60 * 1000;
  const BASIC_BED_TIME = 8 * HOUR;

  const basicBedIngredients = [
    { collectible: "Cushion" as const },
    { collectible: "Cushion" as const },
    { collectible: "Cushion" as const },
    { collectible: "Timber" as const },
    { collectible: "Cushion" as const },
    { collectible: "Timber" as const },
    { collectible: "Timber" as const },
    { collectible: "Timber" as const },
    { collectible: "Timber" as const },
  ];

  // The FE matches against DISCOVERED recipes (the static RECIPES carry no
  // ingredients on this side), so the recipe has to be seeded on state.
  const basicBedRecipe = {
    name: "Basic Bed" as const,
    type: "collectible" as const,
    ingredients: basicBedIngredients,
    time: BASIC_BED_TIME,
  };

  const basicBedAction: StartCraftingAction = {
    type: "crafting.started",
    queueItemId: "test-id",
    ingredients: basicBedIngredients,
  };

  let gameState: GameState;

  beforeEach(() => {
    gameState = {
      ...INITIAL_FARM,
      bumpkin: INITIAL_FARM.bumpkin,
      buildings: {
        "Crafting Box": [
          { id: "123", coordinates: { x: 0, y: 0 }, createdAt: 0, readyAt: 0 },
        ],
      },
      inventory: { Cushion: new Decimal(40), Timber: new Decimal(50) },
      // VIP unlocks the 4-slot queue, which the chaining tests need.
      vip: { bundles: [], expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 },
      craftingBox: {
        status: "idle",
        recipes: { "Basic Bed": basicBedRecipe },
      },
    };
  });

  const withCollectible = (
    game: GameState,
    name: "Fox Shrine" | "Time Warp Totem" | "Super Totem",
    createdAt: number,
  ): GameState => ({
    ...game,
    collectibles: {
      ...game.collectibles,
      [name]: [
        {
          id: "c1",
          coordinates: { x: 3, y: 3 },
          createdAt,
          readyAt: createdAt,
        },
      ],
    },
  });

  it("stores the unboosted duration as baseDurationMs", () => {
    const now = Date.now();
    const state = startCrafting({
      state: gameState,
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    const [craft] = state.craftingBox.queue ?? [];
    expect(craft.baseDurationMs).toEqual(BASIC_BED_TIME);
    expect(craft.startedAt).toEqual(now);
    expect(craft.readyAt).toEqual(now + BASIC_BED_TIME);
  });

  it("bakes Sol & Luna into baseDurationMs and keeps it in boostsUsed", () => {
    const now = Date.now();
    const state = startCrafting({
      state: {
        ...gameState,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: { ...INITIAL_FARM.bumpkin.equipped, wings: "Sol & Luna" },
        },
      },
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    const [craft] = state.craftingBox.queue ?? [];
    expect(craft.baseDurationMs).toEqual(BASIC_BED_TIME * 0.5);
    expect(state.boostsUsedAt?.["Sol & Luna"]).toBeDefined();
  });

  it("bakes Architect Ruler into baseDurationMs and keeps it in boostsUsed", () => {
    const now = Date.now();
    const state = startCrafting({
      state: {
        ...gameState,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            tool: "Architect Ruler",
          },
        },
      },
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    const [craft] = state.craftingBox.queue ?? [];
    expect(craft.baseDurationMs).toEqual(BASIC_BED_TIME * 0.75);
    expect(state.boostsUsedAt?.["Architect Ruler"]).toBeDefined();
  });

  it("does NOT bake a totem in, and leaves it out of boostsUsed", () => {
    const now = Date.now();
    const state = startCrafting({
      state: withCollectible(gameState, "Time Warp Totem", now),
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    const [craft] = state.craftingBox.queue ?? [];
    // The full base duration is stored; the 2x is applied live by the windows.
    expect(craft.baseDurationMs).toEqual(BASIC_BED_TIME);
    expect(craft.readyAt).toEqual(now + BASIC_BED_TIME / 2);
    expect(state.boostsUsedAt?.["Time Warp Totem"]).toBeUndefined();
  });

  /**
   * The Fox Shrine roll is real (this suite does not mock the prng), so seek a
   * `<Name> Crafting Started` counter that lands on the wanted outcome and seed
   * farmActivity with it.
   */
  const counterFor = (proc: boolean): number => {
    let counter = 0;
    while (
      prngChance({
        farmId,
        itemId: KNOWN_IDS["Basic Bed"],
        counter,
        chance: 10,
        criticalHitName: "Fox Shrine",
      }) !== proc
    ) {
      counter++;
    }
    return counter;
  };

  it("applies the Fox Shrine window at 1.35x without baking it in", () => {
    const now = Date.now();

    const state = startCrafting({
      state: {
        ...withCollectible(gameState, "Fox Shrine", now),
        farmActivity: { "Basic Bed Crafting Started": counterFor(false) },
      },
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    const [craft] = state.craftingBox.queue ?? [];
    expect(craft.baseDurationMs).toEqual(BASIC_BED_TIME);
    expect(craft.readyAt).toEqual(now + BASIC_BED_TIME / 1.35);
    expect(state.boostsUsedAt?.["Fox Shrine"]).toBeUndefined();
  });

  it("still fires the Fox Shrine instant proc, with zero work", () => {
    const now = Date.now();

    const state = startCrafting({
      state: {
        ...withCollectible(gameState, "Fox Shrine", now),
        farmActivity: { "Basic Bed Crafting Started": counterFor(true) },
      },
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    const [craft] = state.craftingBox.queue ?? [];
    expect(craft.baseDurationMs).toEqual(0);
    expect(craft.startedAt).toEqual(now);
    expect(craft.readyAt).toEqual(now);
    // The proc is a discrete outcome, so it stays a named boost.
    expect(state.boostsUsedAt?.["Fox Shrine"]).toBeDefined();
  });

  it("anchors on a free box and chains behind a running craft", () => {
    const now = Date.now();

    const first = startCrafting({
      state: gameState,
      action: basicBedAction,
      createdAt: now,
      farmId,
    });
    expect(first.craftingBox.queue?.[0].startedAt).toEqual(now);

    const second = startCrafting({
      state: first,
      action: { ...basicBedAction, queueItemId: "test-id-2" },
      createdAt: now,
      farmId,
    });

    // Queued behind the first, so it carries no anchor of its own.
    expect(second.craftingBox.queue?.[1].startedAt).toBeUndefined();
    expect(second.craftingBox.queue?.[1].baseDurationMs).toEqual(
      BASIC_BED_TIME,
    );
  });

  it("anchors the next craft when a finished one is left uncollected", () => {
    const now = Date.now();

    const first = startCrafting({
      state: gameState,
      action: basicBedAction,
      createdAt: now,
      farmId,
    });

    // Long after the first finished, and never collected.
    const later = now + BASIC_BED_TIME + 5 * HOUR;
    const second = startCrafting({
      state: first,
      action: { ...basicBedAction, queueItemId: "test-id-2" },
      createdAt: later,
      farmId,
    });

    // Anchored at `later`, NOT back-dated to the stale readyAt.
    expect(second.craftingBox.queue?.[1].startedAt).toEqual(later);
    expect(second.craftingBox.queue?.[1].readyAt).toEqual(
      later + BASIC_BED_TIME,
    );
  });

  it("pulls the WHOLE queue forward when a totem is placed mid-queue", () => {
    const now = Date.now();

    const queued = startCrafting({
      state: startCrafting({
        state: gameState,
        action: basicBedAction,
        createdAt: now,
        farmId,
      }),
      action: { ...basicBedAction, queueItemId: "test-id-2" },
      createdAt: now,
      farmId,
    });

    const before = getCraftingQueueReadyAts({
      queue: queued.craftingBox.queue ?? [],
      game: queued,
    });
    expect(before).toEqual([now + BASIC_BED_TIME, now + 2 * BASIC_BED_TIME]);

    // The totem arrives after both were queued.
    const boosted = withCollectible(queued, "Time Warp Totem", now);
    const after = getCraftingQueueReadyAts({
      queue: boosted.craftingBox.queue ?? [],
      game: boosted,
    });

    // Both move, not just the head - that is the point of the slice. The head is
    // fully inside the totem's window, so it halves outright.
    expect(after[0]).toEqual(now + BASIC_BED_TIME / 2);
    expect(after[1]).toBeLessThan(before[1]);

    // The head's 8h of work at 2x consumes the totem's entire 4h window, so the
    // tail is credited nothing of its own and runs at 1x - it moves only because
    // the box freed up sooner. Per-craft acceleration of a QUEUED craft is covered
    // in craftingReadiness.test.ts, where the window outlasts the head.
    expect(after[1]).toEqual(after[0] + BASIC_BED_TIME);
  });
});
