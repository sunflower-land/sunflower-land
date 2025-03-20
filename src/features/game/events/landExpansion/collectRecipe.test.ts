import { TEST_FARM } from "features/game/lib/constants";
import { GameState, PlacedItem } from "features/game/types/game";
import { collectRecipe } from "./collectRecipe";

const GAME_STATE: GameState = TEST_FARM;

describe("collect Recipes", () => {
  it("throws an error if building does not exist", () => {
    expect(() =>
      collectRecipe({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      }),
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
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Building is not cooking anything");
  });

  it("throws an error if there are no recipes that are ready", () => {
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
                crafting: [
                  {
                    name: "Boiled Eggs",
                    readyAt: Date.now() + 60 * 1000,
                    amount: 1,
                  },
                ],
              },
            ],
          },
        },
        action: {
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("No recipes are ready");
  });

  it("removes the recipes from the building", () => {
    const firePit: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
      crafting: [
        {
          name: "Boiled Eggs",
          readyAt: Date.now() - 5 * 1000,
          amount: 1,
        },
      ],
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
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.buildings).toEqual({
      "Fire Pit": [
        {
          ...firePit,
          crafting: [],
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

  it("only removes the recipes that are ready", () => {
    const state = collectRecipe({
      state: {
        ...GAME_STATE,
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Boiled Eggs",
                  readyAt: Date.now() - 5 * 1000,
                  amount: 1,
                },
                {
                  name: "Mashed Potato",
                  readyAt: Date.now() + 5 * 1000,
                  amount: 1,
                },
                {
                  name: "Pumpkin Soup",
                  readyAt: Date.now() + 10 * 1000,
                  amount: 1,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    const building = state.buildings?.["Fire Pit"]?.[0];

    expect(building?.crafting).toMatchObject([
      {
        name: "Mashed Potato",
        readyAt: expect.any(Number),
        amount: 1,
      },
      {
        name: "Pumpkin Soup",
        readyAt: expect.any(Number),
        amount: 1,
      },
    ]);
  });
});
