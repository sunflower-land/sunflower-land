import { INITIAL_FARM } from "features/game/lib/constants";
import { speedUpCrafting } from "./speedUpCrafting";
import Decimal from "decimal.js-light";
import { getInstantGems } from "./speedUpRecipe";
import { GameState } from "features/game/types/game";
const createdAt = Date.now();
describe("speedUpCrafting", () => {
  it("throws an error if crafting box is not crafting", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "idle",
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
      }),
    ).toThrow("Crafting box is not crafting");
  });

  it("(edge case) throws an error if crafting box is not crafting anything", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
      }),
    ).toThrow("Crafting box is not crafting");
  });

  it("throws an error if crafting box is not ready to be sped up", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            item: { collectible: "Doll" },
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
        createdAt,
      }),
    ).toThrow("Crafting box is not ready to be sped up");
  });

  it("throws an error if insufficient gems", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(0) },
          craftingBox: {
            status: "crafting",
            item: { collectible: "Doll" },
            startedAt: 0,
            readyAt: createdAt + 10000,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
        createdAt,
      }),
    ).toThrow("Insufficient gems");
  });

  it("deducts gems from inventory", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      craftingBox: {
        status: "crafting",
        item: { collectible: "Doll" },
        startedAt: 0,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
    });
    expect(newState.inventory.Gem).toEqual(
      new Decimal(state.inventory.Gem).sub(gemsNeeded),
    );
  });

  it("updates readyAt", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      craftingBox: {
        status: "crafting",
        item: { collectible: "Doll" },
        startedAt: 0,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
    });
    expect(newState.inventory.Gem).toEqual(
      new Decimal(state.inventory.Gem).sub(gemsNeeded),
    );
    expect(newState.craftingBox.readyAt).toEqual(createdAt);
  });

  it("updates gem history", () => {
    const currentDateString = new Date(createdAt)
      .toISOString()
      .substring(0, 10);
    const state: GameState = {
      ...INITIAL_FARM,
      craftingBox: {
        status: "crafting",
        item: { collectible: "Doll" },
        startedAt: 0,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
    });
    expect(newState.gems.history?.[currentDateString]?.spent).toEqual(
      gemsNeeded,
    );
  });
});
