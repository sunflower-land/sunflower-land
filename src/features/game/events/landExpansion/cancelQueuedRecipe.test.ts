import { INITIAL_FARM } from "features/game/lib/constants";
import {
  cancelQueuedRecipe,
  getCurrentCookingItem,
} from "./cancelQueuedRecipe";
import {
  BuildingProduct,
  GameState,
  Inventory,
  PlacedItem,
} from "features/game/types/game";
import { CookableName, COOKABLES } from "features/game/types/consumables";
import { cook, getOilConsumption } from "./cook";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { choseSkill } from "./choseSkill";
import Decimal from "decimal.js-light";

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
                },
                {
                  name: "Cornbread",
                  readyAt: now + 1000,
                },
                {
                  name: "Carrot Cake",
                  readyAt: carrotCakeReadyAt,
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

    expect(state.buildings?.Bakery?.[0]?.crafting).toMatchObject([
      {
        name: "Honey Cake",
        readyAt: expect.any(Number),
      },
      {
        name: "Cornbread",
        readyAt: expect.any(Number),
      },
    ]);
  });

  it("returns the oil consumed by the queued recipe", () => {
    const now = new Date("2025-01-01").getTime();
    const itemName = "Carrot Cake" as CookableName;
    const oil = 1000;
    const oilConsumed = getOilConsumption("Bakery", itemName);

    const item: BuildingProduct = {
      name: itemName,
      readyAt: now + 2 * 60 * 1000,

      boost: { Oil: oilConsumed },
    };

    const state = cancelQueuedRecipe({
      state: {
        ...INITIAL_FARM,
        vip: {
          bundles: [{ name: "1_MONTH", boughtAt: Date.now() }],
          expiresAt: Date.now() + 31 * 24 * 60 * 60 * 1000,
        },
        buildings: {
          Bakery: [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
              oil,
              crafting: [
                {
                  name: "Sunflower Cake",
                  readyAt: now + 60 * 1000,
                },
                item,
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cancelled",
        buildingId: "1",
        queueItem: item,
        buildingName: "Bakery",
      },
      createdAt: now,
    });

    expect(state.buildings?.Bakery?.[0]?.oil).toEqual(oil + oilConsumed);
  });

  it("returns resources consumed by the recipe", () => {
    const now = new Date("2025-01-01").getTime();
    const carrotCakeReadyAt = now + 60 * 1000;
    const queueItem = {
      name: "Carrot Cake",
      readyAt: carrotCakeReadyAt,
    } as BuildingProduct;

    const state = cancelQueuedRecipe({
      state: {
        ...INITIAL_FARM,
        inventory: {},
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

    expect(state.inventory).toEqual<Inventory>({
      Egg: new Decimal(30),
      Wheat: new Decimal(10),
      Carrot: new Decimal(120),
    });
  });

  it("recalculates the ready times of the recipes queued after the cancelled recipe", () => {
    const now = Date.now();
    const POTATO_TIME = COOKABLES["Mashed Potato"].cookingSeconds * 1000;
    const EGG_TIME = COOKABLES["Boiled Eggs"].cookingSeconds * 1000;

    const state = cancelQueuedRecipe({
      state: {
        ...INITIAL_FARM,
        buildings: {
          "Fire Pit": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
              crafting: [
                {
                  name: "Mashed Potato",
                  readyAt: now + POTATO_TIME,
                },
                {
                  name: "Boiled Eggs",
                  readyAt: now + POTATO_TIME + EGG_TIME,
                },
                {
                  name: "Mashed Potato",
                  readyAt: now + POTATO_TIME + EGG_TIME + POTATO_TIME,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cancelled",
        buildingName: "Fire Pit",
        buildingId: "1",
        queueItem: {
          name: "Boiled Eggs",
          readyAt: now + POTATO_TIME + EGG_TIME,
        },
      },
      createdAt: now,
    });

    const queue = state.buildings?.["Fire Pit"]?.[0]?.crafting;

    // First recipe unchanged
    expect(queue?.[0].readyAt).toBe(now + POTATO_TIME);

    // Third recipe moved up by EGG_TIME
    expect(queue?.[1].readyAt).toBe(now + POTATO_TIME + POTATO_TIME);
  });

  it("applies boost when recipe start time shifts to before Gourmet Hourglass expiry", () => {
    const now = Date.now();
    const POTATO_TIME = COOKABLES["Mashed Potato"].cookingSeconds * 1000;
    const EGG_TIME = COOKABLES["Boiled Eggs"].cookingSeconds * 1000;
    const BOOST_COOLDOWN = EXPIRY_COOLDOWNS["Gourmet Hourglass"] as number;

    const state = cancelQueuedRecipe({
      state: {
        ...INITIAL_FARM,
        collectibles: {
          "Gourmet Hourglass": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: now - BOOST_COOLDOWN + 60 * 1000, // Expires in 1 minute
            },
          ],
        },
        buildings: {
          "Fire Pit": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
              crafting: [
                {
                  name: "Mashed Potato",
                  readyAt: now + POTATO_TIME / 2, // Boosted
                },
                {
                  name: "Boiled Eggs",
                  readyAt: now + POTATO_TIME / 2 + EGG_TIME / 2, // Boosted
                },
                {
                  name: "Mashed Potato",
                  readyAt: now + POTATO_TIME + EGG_TIME + POTATO_TIME, // Not boosted
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.cancelled",
        buildingName: "Fire Pit",
        buildingId: "1",
        queueItem: {
          name: "Boiled Eggs",
          readyAt: now + POTATO_TIME / 2 + EGG_TIME / 2,
        },
      },
      createdAt: now,
    });

    const building = state.buildings?.["Fire Pit"]?.[0];
    const queue = building?.crafting;

    expect(queue?.[1].readyAt).toBe(now + POTATO_TIME / 2 + POTATO_TIME / 2);
  });

  it("has the correct ready at times when recipes are cancelled", () => {
    const now = Date.now();
    const POTATO_TIME = COOKABLES["Mashed Potato"].cookingSeconds * 1000;

    const startState: GameState = {
      ...INITIAL_FARM,
      buildings: {
        "Fire Pit": [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
            crafting: [
              {
                name: "Mashed Potato",
                readyAt: now,
              },
              {
                name: "Mashed Potato",
                readyAt: now + POTATO_TIME,
              },
              {
                name: "Mashed Potato",
                readyAt: now + POTATO_TIME * 2,
              },
              {
                name: "Mashed Potato",
                readyAt: now + POTATO_TIME * 3,
              },
            ],
          },
        ],
      },
    };

    const afterFirstCancel = cancelQueuedRecipe({
      state: startState,
      action: {
        type: "recipe.cancelled",
        buildingName: "Fire Pit",
        buildingId: "1",
        queueItem: {
          name: "Mashed Potato",
          readyAt: now + POTATO_TIME * 3,
        },
      },
      createdAt: now,
    });

    const afterSecondCancel = cancelQueuedRecipe({
      state: afterFirstCancel,
      action: {
        type: "recipe.cancelled",
        buildingName: "Fire Pit",
        buildingId: "1",
        queueItem: {
          name: "Mashed Potato",
          readyAt: now + POTATO_TIME * 2,
        },
      },
      createdAt: now + 1000,
    });

    // Third recipe should now be cooking and should have a readyAt of now + POTATO_TIME
    const building = afterSecondCancel.buildings?.["Fire Pit"]?.[0];
    const queue = building?.crafting;
    expect(queue).toHaveLength(2);
    expect(queue?.[0].readyAt).toBe(now);
    expect(queue?.[1].readyAt).toBeCloseTo(now + POTATO_TIME); // 1 second to account for the call to cancelQueuedRecipe
  });

  it("has the correct ready at times when recipes are cancelled", () => {
    const now = Date.now();
    const POTATO_TIME = COOKABLES["Mashed Potato"].cookingSeconds * 1000;

    const startState: GameState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_FARM.bumpkin,
      },
      buildings: {
        "Fire Pit": [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
            crafting: [
              {
                name: "Mashed Potato",
                readyAt: now,
              },
              {
                name: "Mashed Potato",
                readyAt: now + POTATO_TIME,
              },
              {
                name: "Mashed Potato",
                readyAt: now + POTATO_TIME * 2,
              },
              {
                name: "Mashed Potato",
                readyAt: now + POTATO_TIME * 3,
              },
            ],
          },
        ],
      },
    };

    const afterFirstCancel = cancelQueuedRecipe({
      state: startState,
      action: {
        type: "recipe.cancelled",
        buildingName: "Fire Pit",
        buildingId: "1",
        queueItem: {
          name: "Mashed Potato",
          readyAt: now + POTATO_TIME * 3,
        },
      },
      createdAt: now,
    });

    const afterSecondCancel = cancelQueuedRecipe({
      state: afterFirstCancel,
      action: {
        type: "recipe.cancelled",
        buildingName: "Fire Pit",
        buildingId: "1",
        queueItem: {
          name: "Mashed Potato",
          readyAt: now + POTATO_TIME * 2,
        },
      },
      createdAt: now + 1000,
    });

    // Third recipe should now be cooking and should have a readyAt of now + POTATO_TIME
    const building = afterSecondCancel.buildings?.["Fire Pit"]?.[0];
    const queue = building?.crafting;
    expect(queue).toHaveLength(2);
    expect(queue?.[0].readyAt).toBe(now);
    expect(queue?.[1].readyAt).toBeCloseTo(now + POTATO_TIME); // 1 second to account for the call to cancelQueuedRecipe
  });

  it("does not return double the ingredients when double nom skill is applied after the items are already queued", () => {
    const now = new Date("2025-01-01").getTime();

    // ingredients: {
    //   Cheese: new Decimal(1),
    //   Tomato: new Decimal(25),
    //   Kale: new Decimal(20),
    // },

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        Cheese: new Decimal(1),
        Tomato: new Decimal(25),
        Kale: new Decimal(20),
        "Lifetime Farmer Banner": new Decimal(1),
      },
      bumpkin: {
        ...INITIAL_FARM.bumpkin,
        experience: 1000000,
        skills: {
          "Fast Feasts": 1,
          "Nom Nom": 1,
          "Frosted Cakes": 1,
          "Juicy Boost": 1,
          "Turbo Fry": 1,
        },
      },
      buildings: {
        Kitchen: [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
            crafting: [
              {
                name: "Caprese Salad",
                readyAt: now + 60 * 1000,
              },
            ],
          },
        ],
      },
    };

    const stateAfterCapreseSaladQueued = cook({
      state,
      action: {
        type: "recipe.cooked",
        buildingId: "1",
        item: "Caprese Salad",
      },
      createdAt: now,
    });

    const stateAfterDoubleNomClaimed = choseSkill({
      state: stateAfterCapreseSaladQueued,
      action: {
        type: "skill.chosen",
        skill: "Double Nom",
      },
      createdAt: now,
    });

    const queuedItem =
      stateAfterDoubleNomClaimed.buildings?.Kitchen?.[0]?.crafting?.[1];

    const cancelledState = cancelQueuedRecipe({
      state: stateAfterDoubleNomClaimed,
      action: {
        type: "recipe.cancelled",
        buildingName: "Kitchen",
        buildingId: "1",
        queueItem: queuedItem as BuildingProduct,
      },
      createdAt: now,
    });

    expect(cancelledState.inventory.Cheese).toEqual(new Decimal(1));
    expect(cancelledState.inventory.Tomato).toEqual(new Decimal(25));
    expect(cancelledState.inventory.Kale).toEqual(new Decimal(20));
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
        },
        {
          name: "Carrot Cake" as CookableName,
          readyAt: carrotCakeOneReadyAt,
        },
        {
          name: "Carrot Cake" as CookableName,
          readyAt: carrotCakeTwoReadyAt,
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
    });
  });
});
