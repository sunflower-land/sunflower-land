import { TEST_FARM } from "features/game/lib/constants";
import {
  CriticalHitName,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import { collectRecipe } from "./collectRecipe";
import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import { CookableName } from "features/game/types/consumables";
import { prngChance } from "lib/prng";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: { ...TEST_FARM.inventory, "Boiled Eggs": new Decimal(0) },
};

describe("collect Recipes", () => {
  const farmId = 1;
  const dateNow = Date.now();
  it("throws an error if building does not exist", () => {
    expect(() =>
      collectRecipe({
        farmId,
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Building does not exist");
  });

  it("throws an error if building is not cooking anything", () => {
    expect(() =>
      collectRecipe({
        farmId,
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
        createdAt: dateNow,
      }),
    ).toThrow("Building is not cooking anything");
  });

  it("throws an error if there are no recipes that are ready", () => {
    expect(() =>
      collectRecipe({
        farmId,
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
        createdAt: dateNow,
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
        },
      ],
    };
    const state = collectRecipe({
      farmId,
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
      createdAt: dateNow,
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
      farmId,
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
                },
                {
                  name: "Mashed Potato",
                  readyAt: Date.now() + 5 * 1000,
                },
                {
                  name: "Pumpkin Soup",
                  readyAt: Date.now() + 10 * 1000,
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
      createdAt: dateNow,
    });

    const building = state.buildings?.["Fire Pit"]?.[0];

    expect(building?.crafting).toMatchObject([
      {
        name: "Mashed Potato",
        readyAt: expect.any(Number),
      },
      {
        name: "Pumpkin Soup",
        readyAt: expect.any(Number),
      },
    ]);
  });

  function getPrngCounter(
    recipeName: CookableName,
    criticalHitName: CriticalHitName,
    chance: number,
  ) {
    let counter = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (
        prngChance({
          farmId,
          itemId: KNOWN_IDS[recipeName],
          counter,
          chance,
          criticalHitName,
        })
      ) {
        return counter;
      }
      counter++;
    }
  }

  it("returns 2 if Fiery Jackpot skill is active and lands on 20% chance", () => {
    const state = collectRecipe({
      farmId,
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
                  readyAt: dateNow - 5 * 1000,
                },
              ],
            },
          ],
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: { "Fiery Jackpot": 1 },
        },
        farmActivity: {
          "Boiled Eggs Cooked": getPrngCounter(
            "Boiled Eggs",
            "Fiery Jackpot",
            20,
          ),
        },
      },
      action: {
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Boiled Eggs"]).toEqual(new Decimal(2));
  });

  it("returns 3 if Fiery Jackpot and Double Nom skill is active and lands on 20% chance", () => {
    const state = collectRecipe({
      farmId,
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
                  readyAt: dateNow - 5 * 1000,
                  skills: { "Double Nom": true },
                },
              ],
            },
          ],
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: { "Fiery Jackpot": 1 },
        },
        farmActivity: {
          "Boiled Eggs Cooked": getPrngCounter(
            "Boiled Eggs",
            "Fiery Jackpot",
            20,
          ),
        },
      },
      action: {
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "123",
      },
      createdAt: dateNow,
    });

    expect(state.inventory["Boiled Eggs"]).toEqual(new Decimal(3));
  });
});
