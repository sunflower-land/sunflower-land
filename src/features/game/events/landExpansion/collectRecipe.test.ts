import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState, PlacedItem } from "features/game/types/game";
import { collectRecipe } from "./collectRecipe";

const GAME_STATE: GameState = INITIAL_FARM;

describe("collect Recipes", () => {
  it("throws an error if building does not exist", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Building does not exist");
  });

  it("throws an error if building is not cooking anything", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
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
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Building is not cooking anything");
  });

  it("throws an error if recipe is not ready", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
                crafting: {
                  name: "Boiled Egg",
                  readyAt: Date.now() + 60 * 1000,
                },
              },
            ],
          },
        },
        action: {
          type: "recipe.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Recipe is not ready");
  });

  it("removes the recipe from the building", () => {
    const firePit: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
      crafting: {
        name: "Boiled Egg",
        readyAt: Date.now() - 5 * 1000,
      },
    };
    const state = collectRecipe({
      state: {
        ...GAME_STATE,
        buildings: {
          "Fire Pit": [
            firePit,
            {
              id: "2039",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "recipe.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.buildings).toEqual({
      "Fire Pit": [
        {
          ...firePit,
          crafting: undefined,
        },

        {
          id: "2039",
          coordinates: { x: 1, y: 1 },
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("adds the consumable to the inventory", () => {
    const state = collectRecipe({
      state: {
        ...GAME_STATE,
        balance: new Decimal(10),
        inventory: {
          "Boiled Egg": new Decimal(3),
          Sunflower: new Decimal(22),
        },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
              crafting: {
                name: "Boiled Egg",
                readyAt: Date.now() - 5 * 1000,
              },
            },
          ],
        },
      },
      action: {
        type: "recipe.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.inventory).toEqual({
      "Boiled Egg": new Decimal(4),
      Sunflower: new Decimal(22),
    });
  });
});
