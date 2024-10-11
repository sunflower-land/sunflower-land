import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { startCrafting, StartCraftingAction } from "./startCrafting";

describe("startCrafting", () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = {
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
      craftingBox: {},
    } as GameState;
  });

  it("starts crafting", () => {
    const action: StartCraftingAction = {
      type: "crafting.started",
      ingredients: {
        Wood: 2,
        Stone: 1,
      },
    };

    const newState = startCrafting({ state: gameState, action });

    expect(newState.craftingBox.status).toBe("pending");
  });

  it("throws an error if the player doesn't have a Crafting Box", () => {
    gameState.buildings["Crafting Box"] = [];

    const action: StartCraftingAction = {
      type: "crafting.started",
      ingredients: {
        Wood: 2,
        Stone: 1,
      },
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
    };

    const action: StartCraftingAction = {
      type: "crafting.started",
      ingredients: {
        Wood: 2,
        Stone: 1,
      },
    };

    expect(() => startCrafting({ state: gameState, action })).toThrow(
      "There's already an ongoing crafting",
    );
  });
});
