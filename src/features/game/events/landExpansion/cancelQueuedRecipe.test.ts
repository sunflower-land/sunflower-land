import { INITIAL_FARM } from "features/game/lib/constants";
import {
  cancelQueuedRecipe,
  getCurrentCookingItem,
} from "./cancelQueuedRecipe";
import { BuildingProduct, PlacedItem } from "features/game/types/game";
import { CookableName } from "features/game/types/consumables";

describe("cancelQueuedRecipe", () => {
  it("throws an error if the building does not exist", () => {
    expect(() =>
      cancelQueuedRecipe({
        state: INITIAL_FARM,
        action: {
          type: "recipe.cancelled",
          buildingName: "Bakery",
          buildingId: "1",
          queueItem: {
            name: "Carrot Cake",
            readyAt: 0,
            amount: 1,
          },
        },
      }),
    ).toThrow("Building does not exist");
  });

  it("throws an error if there is no queue", () => {
    expect(() =>
      cancelQueuedRecipe({
        state: {
          ...INITIAL_FARM,
          buildings: {
            Bakery: [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
        },
        action: {
          type: "recipe.cancelled",
          buildingName: "Bakery",
          buildingId: "1",
          queueItem: {
            name: "Carrot Cake",
            readyAt: 0,
            amount: 1,
          },
        },
      }),
    ).toThrow("No queue exists");
  });

  it("throws an error if no recipe exists at the index", () => {
    expect(() =>
      cancelQueuedRecipe({
        state: {
          ...INITIAL_FARM,
          buildings: {
            Bakery: [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
                crafting: [
                  {
                    name: "Carrot Cake",
                    readyAt: 0,
                    amount: 1,
                  },
                ],
              },
            ],
          },
        },
        action: {
          type: "recipe.cancelled",
          buildingName: "Bakery",
          buildingId: "1",
          queueItem: {
            name: "Sunflower Cake",
            readyAt: 1000,
            amount: 1,
          },
        },
      }),
    ).toThrow("Recipe does not exist");
  });

  it("throws an error if the recipe is currently being cooked", () => {
    const now = new Date("2025-01-01").getTime();
    const carrotCakeReadyAt = now + 60 * 1000;
    const queueItem = {
      name: "Carrot Cake",
      readyAt: carrotCakeReadyAt,
      amount: 1,
    } as BuildingProduct;

    expect(() =>
      cancelQueuedRecipe({
        state: {
          ...INITIAL_FARM,
          buildings: {
            Bakery: [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
                crafting: [
                  {
                    name: "Cornbread",
                    readyAt: now - 1000,
                    amount: 1,
                  },
                  queueItem,
                ],
              },
            ],
          },
        },
        action: {
          type: "recipe.cancelled",
          buildingName: "Bakery",
          buildingId: "1",
          queueItem,
        },
        createdAt: now,
      }),
    ).toThrow(
      `Recipe ${queueItem.name} with readyAt ${carrotCakeReadyAt} is currently being cooked`,
    );
  });

  it("cancels the recipe", () => {
    const now = new Date("2025-01-01").getTime();
    const carrotCakeReadyAt = now + 60 * 1000;
    const queueItem = {
      name: "Carrot Cake",
      readyAt: carrotCakeReadyAt,
      amount: 1,
    } as BuildingProduct;

    const state = cancelQueuedRecipe({
      state: {
        ...INITIAL_FARM,
        buildings: {
          Bakery: [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
              crafting: [
                {
                  name: "Honey Cake",
                  readyAt: now - 1000,
                  amount: 1,
                },
                {
                  name: "Cornbread",
                  readyAt: now + 1000,
                  amount: 1,
                },
                {
                  name: "Carrot Cake",
                  readyAt: carrotCakeReadyAt,
                  amount: 1,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cancelled",
        buildingName: "Bakery",
        buildingId: "1",
        queueItem,
      },
      createdAt: now,
    });

    expect(state.buildings?.Bakery?.[0]?.crafting).toEqual([
      {
        name: "Honey Cake",
        readyAt: now - 1000,
        amount: 1,
      },
      {
        name: "Cornbread",
        readyAt: now + 1000,
        amount: 1,
      },
    ]);
  });

  it("increments the cancelled count for recipe", () => {
    const now = new Date("2025-01-01").getTime();
    const carrotCakeReadyAt = now + 60 * 1000;
    const queueItem = {
      name: "Carrot Cake",
      readyAt: carrotCakeReadyAt,
      amount: 1,
    } as BuildingProduct;

    const state = cancelQueuedRecipe({
      state: {
        ...INITIAL_FARM,
        buildings: {
          Bakery: [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
              crafting: [
                {
                  name: "Cornbread",
                  readyAt: now + 1000,
                  amount: 1,
                },
                queueItem,
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cancelled",
        buildingName: "Bakery",
        buildingId: "1",
        queueItem,
      },
      createdAt: now,
    });

    expect(state.buildings?.Bakery?.[0]?.cancelled).toEqual({
      "Carrot Cake": {
        count: 1,
        cancelledAt: now,
      },
    });
  });
});

describe("getCurrentCookingItem", () => {
  it("returns the current cooking item", () => {
    const now = new Date("2025-01-01").getTime();
    const cornbreadReadyAt = now - 1000;
    const carrotCakeOneReadyAt = now + 60 * 1000;
    const carrotCakeTwoReadyAt = now + 120 * 1000;

    const building: PlacedItem = {
      id: "1",
      coordinates: { x: 0, y: 0 },
      readyAt: 0,
      createdAt: 0,
      crafting: [
        {
          name: "Cornbread" as CookableName,
          readyAt: cornbreadReadyAt,
          amount: 1,
        },
        {
          name: "Carrot Cake" as CookableName,
          readyAt: carrotCakeOneReadyAt,
          amount: 1,
        },
        {
          name: "Carrot Cake" as CookableName,
          readyAt: carrotCakeTwoReadyAt,
          amount: 1,
        },
      ],
    };
    const item = getCurrentCookingItem({
      building,
      createdAt: now,
    });

    expect(item).toEqual({
      name: "Carrot Cake",
      readyAt: carrotCakeOneReadyAt,
      amount: 1,
    });
  });
});
