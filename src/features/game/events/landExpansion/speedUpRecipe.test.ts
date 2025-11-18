// 1: Less than 1 minute
// 2: Less than 5 minutes
// 3: Less than 10 minutes
// 4: Less than 30 minutes
// 5: Less than 1 hr
// 8: Less than 2 hrs
// 10: Less than 4 hrs
// 12: Less than 6 hrs
// 12: Less than 12 hrs
// 14: Less than 24 hrs
// 16: Less than 36 hrs
// 20: Less than 48 hrs

import { INITIAL_FARM } from "features/game/lib/constants";
import { getInstantGems, speedUpRecipe } from "./speedUpRecipe";
import Decimal from "decimal.js-light";
import { BAKERY_COOKABLES, COOKABLES } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import { supplyCookingOil } from "./supplyCookingOil";
import { cook, getCookingOilBoost } from "./cook";

describe("instantCook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-07-01T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const farmId = 1;

  it("requires item is cooking", () => {
    expect(() =>
      speedUpRecipe({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fire Pit",
          type: "recipe.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("Nothing is cooking");
  });

  it("requires player has the gems", () => {
    expect(() =>
      speedUpRecipe({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fire Pit",
          type: "recipe.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(0) },
          buildings: {
            "Fire Pit": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                crafting: [
                  {
                    name: "Mashed Potato",
                    readyAt: Date.now() + 30000,
                  },
                ],
              },
            ],
          },
        },
      }),
    ).toThrow("Insufficient gems");
  });

  it("charges gems for a mashed potato", () => {
    const state = speedUpRecipe({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Mashed Potato",
                  readyAt: Date.now() + 30000,
                },
              ],
            },
          ],
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(99));
  });

  it("charges gems for a radish cake", () => {
    const now = Date.now();
    const state = speedUpRecipe({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Radish Cake",
                  readyAt:
                    now + BAKERY_COOKABLES["Radish Cake"].cookingSeconds * 1000,
                },
              ],
            },
          ],
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(60));
  });

  it("charges half the gems for a half finished radish cake", () => {
    const now = Date.now();
    const state = speedUpRecipe({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Radish Cake",
                  readyAt:
                    now +
                    (BAKERY_COOKABLES["Radish Cake"].cookingSeconds / 2) * 1000,
                },
              ],
            },
          ],
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(75));
  });

  it("gives the player the food", () => {
    const now = Date.now();
    const state = speedUpRecipe({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Mashed Potato",
                  readyAt: now + 30000,
                },
              ],
            },
          ],
        },
        createdAt: now,
      },
    });

    expect(state.inventory["Mashed Potato"]).toEqual(new Decimal(1));
    expect(state.buildings["Fire Pit"]?.[0].crafting).toEqual([]);
  });

  it("only speeds up the recipe that is currently cooking", () => {
    const now = Date.now();
    const state = speedUpRecipe({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Mashed Potato",
                  readyAt: now + 30000,
                },
                {
                  name: "Radish Cake",
                  readyAt: now + 30000 + 2000,
                },
              ],
            },
          ],
        },
        createdAt: now,
      },
    });

    const building = state.buildings["Fire Pit"]?.[0];

    expect(building?.crafting).toMatchObject([
      {
        name: "Radish Cake",
        readyAt: expect.any(Number),
      },
    ]);
  });

  it("updates all the recipes readyAt times correctly", () => {
    const now = Date.now();
    const TOFU_TIME = COOKABLES["Fried Tofu"].cookingSeconds * 1000;
    const POTATO_TIME = COOKABLES["Mashed Potato"].cookingSeconds * 1000;
    const RHUBARB_TIME = COOKABLES["Rhubarb Tart"].cookingSeconds * 1000;

    const state = speedUpRecipe({
      farmId,
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Fried Tofu",
                  readyAt: now + TOFU_TIME,
                },
                {
                  name: "Rhubarb Tart",
                  readyAt: now + TOFU_TIME + RHUBARB_TIME,
                },
                {
                  name: "Fried Tofu",
                  readyAt: now + TOFU_TIME + RHUBARB_TIME + TOFU_TIME,
                },
                {
                  name: "Mashed Potato",
                  readyAt:
                    now + TOFU_TIME + RHUBARB_TIME + TOFU_TIME + POTATO_TIME,
                },
              ],
            },
          ],
        },
      },
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
      createdAt: now,
    });

    const building = state.buildings["Fire Pit"]?.[0];
    const queue = building?.crafting;

    // The first fried tofu should be ready now and is removed from the queue
    // Remaining recipes should have their readyAt times updated
    expect(queue?.[0].readyAt).toBe(now + RHUBARB_TIME);
    expect(queue?.[1].readyAt).toBe(now + RHUBARB_TIME + TOFU_TIME);
    expect(queue?.[2].readyAt).toBe(
      now + RHUBARB_TIME + TOFU_TIME + POTATO_TIME,
    );
  });

  it("does not change the queued items oil boosts", () => {
    const now = Date.now();
    const twentyMinutesMs = 20 * 60 * 1000;

    // Have a milk already cooking
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        Oil: new Decimal(100),
        Tuna: new Decimal(100),
        "Lifetime Farmer Banner": new Decimal(1),
        Gem: new Decimal(100),
      },
      buildings: {
        Deli: [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            crafting: [
              {
                name: "Cheese",
                readyAt: now + twentyMinutesMs, // 20 minutes
              },
            ],
          },
        ],
      },
    };

    // Add 10 oil to the deli
    const afterOilAddedState = supplyCookingOil({
      state,
      action: {
        type: "cookingOil.supplied",
        building: "Deli",
        buildingId: "123",
        oilQuantity: 10,
      },
      createdAt: Date.now(),
    });

    expect(afterOilAddedState.buildings["Deli"]?.[0].oil).toBe(10);

    const boostedCookingTime = getCookingOilBoost(
      "Fermented Fish",
      afterOilAddedState,
      "123",
    );

    const afterFermentedFishCookedState = cook({
      state: afterOilAddedState,
      action: {
        type: "recipe.cooked",
        item: "Fermented Fish",
        buildingId: "123",
      },
      createdAt: now,
    });

    const sixteenHours = 16 * 60 * 60;
    const sixteenHoursInMs = sixteenHours * 1000;
    const fishShouldBeReadyAt = now + twentyMinutesMs + sixteenHoursInMs;

    // Fermented fish should be ready 16 hours after 10 oil consumption
    expect(boostedCookingTime.timeToCook).toEqual(sixteenHours); // 16 hours;
    expect(afterFermentedFishCookedState.buildings["Deli"]?.[0].oil).toBe(0);
    expect(
      afterFermentedFishCookedState.buildings["Deli"]?.[0].crafting?.[1]
        .readyAt,
    ).toBe(fishShouldBeReadyAt);

    // Speed up the recipe
    const afterSpeedUpCheeseState = speedUpRecipe({
      farmId,
      state: afterFermentedFishCookedState,
      action: {
        type: "recipe.spedUp",
        buildingId: "123",
        buildingName: "Deli",
      },
      createdAt: now,
    });

    const result =
      afterSpeedUpCheeseState.buildings["Deli"]?.[0].crafting?.[0].readyAt;

    // Ready at for the fish should now be minus the milk cooking time
    expect(result).toBe(fishShouldBeReadyAt - twentyMinutesMs);
  });
});

describe("getInstantGems", () => {
  const farmId = 1;
  it("returns the correct amount of gems for a 1 hour recipe", () => {
    expect(
      getInstantGems({
        readyAt: Date.now() + 1 * 60 * 60 * 1000,
        game: INITIAL_FARM,
      }),
    ).toEqual(5);
  });

  it("returns the 20% more when player has spent 100 gems in a day", () => {
    const now = new Date("2024-01-01T03:00:00Z");
    expect(
      getInstantGems({
        readyAt: now.getTime() + 1 * 60 * 60 * 1000,
        game: {
          ...INITIAL_FARM,
          gems: {
            history: {
              "2024-01-01": { spent: 100 },
            },
          },
        },
        now: now.getTime(),
      }),
    ).toEqual(6);
  });

  it("returns the 40% more when player has spent 200 gems in a day", () => {
    const now = new Date("2024-01-01T03:00:00Z");
    expect(
      getInstantGems({
        readyAt: now.getTime() + 1 * 60 * 60 * 1000,
        game: {
          ...INITIAL_FARM,
          gems: {
            history: {
              "2024-01-01": { spent: 200 },
            },
          },
        },
        now: now.getTime(),
      }),
    ).toEqual(7);
  });

  it("returns the 100% more when player has spent 500 gems in a day", () => {
    const now = new Date("2024-01-01T03:00:00Z");
    expect(
      getInstantGems({
        readyAt: now.getTime() + 1 * 60 * 60 * 1000,
        game: {
          ...INITIAL_FARM,
          gems: {
            history: {
              "2024-01-01": { spent: 500 },
            },
          },
        },
        now: now.getTime(),
      }),
    ).toEqual(10);
  });

  it("doesn't remove other ready recipes when speeding up the current recipe", () => {
    const now = Date.now();

    const state = speedUpRecipe({
      farmId,
      state: {
        ...INITIAL_FARM,
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  name: "Mashed Potato", // Ready recipe
                  readyAt: now - 1000,
                },
                {
                  name: "Radish Cake",
                  readyAt: now + 30000 + 2000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipe.spedUp",
        buildingId: "123",
        buildingName: "Fire Pit",
      },
      createdAt: now,
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting).toMatchObject([
      {
        name: "Mashed Potato",
        readyAt: expect.any(Number),
      },
    ]);
    expect(state.inventory["Radish Cake"]).toEqual(new Decimal(1));
  });
});
