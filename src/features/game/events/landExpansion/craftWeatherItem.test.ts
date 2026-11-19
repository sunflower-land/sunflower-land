import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { craftWeatherItem } from "./craftWeatherItem";

const GAME: GameState = {
  ...INITIAL_FARM,
  inventory: {
    Sand: new Decimal(12),
    Leather: new Decimal(3),
    Wood: new Decimal(40),
    Feather: new Decimal(30),
    "Green Beetle": new Decimal(10),
    "Pink Beetle": new Decimal(2),
    Honey: new Decimal(5),
    "Red Pansy": new Decimal(1),
  },
};

describe("craftWeatherItem", () => {
  it("crafts an item and takes exactly its recipe", () => {
    const state = craftWeatherItem({
      state: GAME,
      action: { type: "weatherItem.crafted", item: "Sandbag" },
    });

    expect(state.inventory.Sandbag).toEqual(new Decimal(1));
    expect(state.inventory.Sand).toEqual(new Decimal(2));
    expect(state.inventory.Leather).toEqual(new Decimal(1));
    // Untouched
    expect(state.inventory.Wood).toEqual(new Decimal(40));
  });

  it("costs no coins", () => {
    const state = craftWeatherItem({
      state: { ...GAME, coins: 100 },
      action: { type: "weatherItem.crafted", item: "Sandbag" },
    });

    expect(state.coins).toBe(100);
  });

  it("tracks the craft", () => {
    const state = craftWeatherItem({
      state: GAME,
      action: { type: "weatherItem.crafted", item: "Sandbag" },
    });

    expect(state.farmActivity["Sandbag Crafted"]).toBe(1);
  });

  it("takes only the chosen beetle for a Pest Smoker", () => {
    const state = craftWeatherItem({
      state: GAME,
      action: {
        type: "weatherItem.crafted",
        item: "Pest Smoker",
        ingredient: "Pink Beetle",
      },
    });

    expect(state.inventory["Pest Smoker"]).toEqual(new Decimal(1));
    expect(state.inventory.Wood).toEqual(new Decimal(10));
    expect(state.inventory.Feather).toEqual(new Decimal(0));
    expect(state.inventory["Pink Beetle"]).toEqual(new Decimal(0));
    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(10));
  });

  it("takes the chosen flower for a Wildflower Lure", () => {
    const state = craftWeatherItem({
      state: GAME,
      action: {
        type: "weatherItem.crafted",
        item: "Wildflower Lure",
        ingredient: "Red Pansy",
      },
    });

    expect(state.inventory["Wildflower Lure"]).toEqual(new Decimal(1));
    expect(state.inventory.Honey).toEqual(new Decimal(0));
    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(5));
    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(0));
  });

  it("requires a choice for the Pest Smoker", () => {
    expect(() =>
      craftWeatherItem({
        state: GAME,
        action: { type: "weatherItem.crafted", item: "Pest Smoker" },
      }),
    ).toThrow("Invalid ingredient");
  });

  it("rejects an ingredient the recipe doesn't offer", () => {
    expect(() =>
      craftWeatherItem({
        state: GAME,
        action: {
          type: "weatherItem.crafted",
          item: "Pest Smoker",
          ingredient: "Wood",
        },
      }),
    ).toThrow("Invalid ingredient");
  });

  it("rejects an ingredient on a recipe without a choice", () => {
    expect(() =>
      craftWeatherItem({
        state: GAME,
        action: {
          type: "weatherItem.crafted",
          item: "Sandbag",
          ingredient: "Sand",
        },
      }),
    ).toThrow("Invalid ingredient");
  });

  it("rejects an item that isn't a weather item", () => {
    expect(() =>
      craftWeatherItem({
        state: GAME,
        action: {
          type: "weatherItem.crafted",
          item: "Tornado Pinwheel" as "Sandbag",
        },
      }),
    ).toThrow("Not a weather item");
  });

  it("throws when an ingredient is short", () => {
    const game: GameState = {
      ...GAME,
      inventory: { ...GAME.inventory, Leather: new Decimal(1) },
    };

    expect(() =>
      craftWeatherItem({
        state: game,
        action: { type: "weatherItem.crafted", item: "Sandbag" },
      }),
    ).toThrow("Insufficient ingredient: Leather");
  });

  it("allows only one of each item", () => {
    expect(() =>
      craftWeatherItem({
        state: {
          ...GAME,
          inventory: { ...GAME.inventory, Sandbag: new Decimal(1) },
        },
        action: { type: "weatherItem.crafted", item: "Sandbag" },
      }),
    ).toThrow("You already have this weather item");
  });

  it("doesn't spend a flower that is placed on the farm", () => {
    expect(() =>
      craftWeatherItem({
        state: {
          ...GAME,
          collectibles: {
            "Red Pansy": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "weatherItem.crafted",
          item: "Wildflower Lure",
          ingredient: "Red Pansy",
        },
      }),
    ).toThrow("Insufficient ingredient: Red Pansy");
  });

  describe("on mainnet", () => {
    const originalNetwork = CONFIG.NETWORK;

    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });

    afterAll(() => {
      CONFIG.NETWORK = originalNetwork;
    });

    it("isn't available yet", () => {
      expect(() =>
        craftWeatherItem({
          state: GAME,
          action: { type: "weatherItem.crafted", item: "Sandbag" },
        }),
      ).toThrow("Weather items are not available");
    });
  });
});
