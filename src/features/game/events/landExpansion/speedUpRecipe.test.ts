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

describe("instantCook", () => {
  it("requires item is cooking", () => {
    expect(() =>
      speedUpRecipe({
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
                    amount: 1,
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
                  amount: 1,
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
                  amount: 1,
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
                  amount: 1,
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
                  amount: 1,
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
                  amount: 1,
                },
                {
                  name: "Radish Cake",
                  readyAt: now + 30000 + 2000,
                  amount: 1,
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
        amount: 1,
      },
    ]);
  });

  it("updates all the recipes readyAt times correctly", () => {
    const now = Date.now();
    const POTATO_TIME = COOKABLES["Mashed Potato"].cookingSeconds * 1000;
    const RHUBARB_TIME = COOKABLES["Rhubarb Tart"].cookingSeconds * 1000;

    const state = speedUpRecipe({
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
                  readyAt: now,
                  amount: 1,
                },
                {
                  name: "Rhubarb Tart",
                  readyAt: now + RHUBARB_TIME,
                  amount: 1,
                },
                {
                  name: "Rhubarb Tart",
                  readyAt: now + RHUBARB_TIME * 2,
                  amount: 1,
                },
                {
                  name: "Mashed Potato",
                  readyAt: now + RHUBARB_TIME * 2 + POTATO_TIME,
                  amount: 1,
                },
              ],
            },
          ],
        },
        createdAt: now,
      },
      action: {
        buildingId: "123",
        buildingName: "Fire Pit",
        type: "recipe.spedUp",
      },
    });

    const building = state.buildings["Fire Pit"]?.[0];
    const queue = building?.crafting;

    // Finished recipe
    expect(queue?.[0].readyAt).toBe(now);
    // Upcoming recipes
    expect(queue?.[1].readyAt).toBeCloseTo(now + RHUBARB_TIME);
    expect(queue?.[2].readyAt).toBeCloseTo(now + RHUBARB_TIME + POTATO_TIME);
  });
});

describe("getInstantGems", () => {
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
});
