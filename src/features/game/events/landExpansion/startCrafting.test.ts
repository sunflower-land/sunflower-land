import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { startCrafting, StartCraftingAction } from "./startCrafting";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("startCrafting", () => {
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

    const newState = startCrafting({ state: gameState, action });

    expect(newState.craftingBox.status).toBe("pending");
  });

  it("if recipes exists - sets the crafting status to crafting", () => {
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

    const newState = startCrafting({ state: gameState, action });

    expect(newState.craftingBox.status).toBe("crafting");
  });

  it("throws an error if the player doesn't have a Crafting Box", () => {
    gameState.buildings["Crafting Box"] = [];

    const action: StartCraftingAction = {
      type: "crafting.started",
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

    expect(() => startCrafting({ state: gameState, action })).toThrow(
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

    expect(() => startCrafting({ state: gameState, action })).toThrow(
      "You do not have a Crafting Box",
    );
  });

  it("throws an error if there's already an ongoing crafting", () => {
    gameState.craftingBox = {
      status: "pending",
      startedAt: Date.now(),
      readyAt: Date.now() + 60000,
      recipes: {},
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
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

    expect(() => startCrafting({ state: gameState, action })).toThrow(
      "There's already an ongoing crafting",
    );
  });

  it("throws an error if the player provides less than 9 ingredients", () => {
    const action: StartCraftingAction = {
      type: "crafting.started",
      ingredients: [
        { collectible: "Wood" },
        { collectible: "Wood" },
        { collectible: "Stone" },
      ],
    };

    expect(() => startCrafting({ state: gameState, action })).toThrow(
      "You must provide 9 ingredients",
    );
  });

  it("throws an error if the player provides more than 9 ingredients", () => {
    const action: StartCraftingAction = {
      type: "crafting.started",
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

    expect(() => startCrafting({ state: gameState, action })).toThrow(
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

    expect(() => startCrafting({ state: gameState, action })).toThrow(
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

    const state = startCrafting({ state: gameState, action });

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

    expect(() => startCrafting({ state: { ...gameState }, action })).toThrow(
      "You do not have the ingredients to craft this item",
    );
  });
});
