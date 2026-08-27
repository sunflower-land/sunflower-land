import { TEST_FARM } from "features/game/lib/constants";
import type {
  CriticalHitName,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import { collectRecipe } from "./collectRecipe";
import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import type { CookableName } from "features/game/types/consumables";
import { prngChance } from "lib/prng";
import { getCookingQueueReadyAts } from "features/game/lib/cookingReadiness";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: { ...TEST_FARM.inventory, "Boiled Eggs": new Decimal(0) },
};

describe("collect Recipes", () => {
  const farmId = 1;
  const dateNow = Date.now();

  // A boost placed since the last save pulls a recipe's ready time forward. The
  // stored `readyAt` is only a cache of the derived value, so collecting has to ask
  // the chain, not the cache — otherwise the player watches a finished recipe sit
  // there until some other event happens to rewrite the queue.
  it("collects a recipe whose DERIVED ready time has passed", () => {
    const now = dateNow;
    const HOUR = 60 * 60 * 1000;

    const state = collectRecipe({
      farmId,
      state: {
        ...GAME_STATE,
        collectibles: {
          ...GAME_STATE.collectibles,
          "Gourmet Hourglass": [
            {
              id: "1",
              coordinates: { x: 1, y: 1 },
              createdAt: now - 2 * HOUR,
              readyAt: now - 2 * HOUR,
            },
          ],
        },
        buildings: {
          "Fire Pit": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  id: "abc",
                  name: "Boiled Eggs",
                  startedAt: now - 2 * HOUR,
                  baseDurationMs: 3 * HOUR,
                  // Cache written before the hourglass was placed: still 1h away.
                  readyAt: now + 1 * HOUR,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "1",
      },
      createdAt: now,
    });

    // 2h at 2x = 3h of work done, so it finished exactly now.
    expect(state.inventory["Boiled Eggs"]).toEqual(new Decimal(1));
    expect(state.buildings["Fire Pit"]?.[0].crafting).toEqual([]);
  });
  // Collecting the head takes the recipe behind it OUT of the chain: it was queued
  // with no `startedAt` because its start WAS the head's derived ready time, and once
  // the head is gone there is nothing left to chain off. Its start has to be stamped
  // on the way out, or the resolver has to invent one - and the only value it can
  // invent (`readyAt - baseDurationMs`) takes the unboosted duration off an already
  // boosted ready time, handing the player the boost a second time.
  it("does not move the next recipe's ready time when the head is collected", () => {
    const now = dateNow;
    const HOUR = 60 * 60 * 1000;

    const state = collectRecipe({
      farmId,
      state: {
        ...GAME_STATE,
        collectibles: {
          ...GAME_STATE.collectibles,
          "Gourmet Hourglass": [
            {
              id: "1",
              coordinates: { x: 1, y: 1 },
              createdAt: now - 1 * HOUR,
              readyAt: now - 1 * HOUR,
            },
          ],
        },
        buildings: {
          "Fire Pit": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                // 2h of work at 2x - finishes exactly now.
                {
                  id: "head",
                  name: "Boiled Eggs",
                  startedAt: now - 1 * HOUR,
                  baseDurationMs: 2 * HOUR,
                  readyAt: now,
                },
                // Queued behind it, so no `startedAt`: 6h of work at 2x from now.
                {
                  id: "tail",
                  name: "Mashed Potato",
                  baseDurationMs: 6 * HOUR,
                  readyAt: now + 3 * HOUR,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "1",
      },
      createdAt: now,
    });

    const queue = state.buildings["Fire Pit"]?.[0].crafting ?? [];

    expect(queue).toHaveLength(1);
    // Anchored on the head's derived finish - exactly where it was already cooking
    // from, so no progress is invented or lost.
    expect(queue[0].startedAt).toEqual(now);
    expect(queue[0].readyAt).toEqual(now + 3 * HOUR);
    expect(getCookingQueueReadyAts({ crafting: queue, game: state })).toEqual([
      now + 3 * HOUR,
    ]);
  });

  // Every event that rewrites the queue persists the derived time, so a resolver
  // that moved it would move it again on every save - compounding towards instant.
  it("leaves the collected-behind recipe stable across a cache rewrite", () => {
    const now = dateNow;
    const HOUR = 60 * 60 * 1000;

    const state = collectRecipe({
      farmId,
      state: {
        ...GAME_STATE,
        collectibles: {
          ...GAME_STATE.collectibles,
          "Gourmet Hourglass": [
            {
              id: "1",
              coordinates: { x: 1, y: 1 },
              createdAt: now - 1 * HOUR,
              readyAt: now - 1 * HOUR,
            },
          ],
        },
        buildings: {
          "Fire Pit": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              crafting: [
                {
                  id: "head",
                  name: "Boiled Eggs",
                  startedAt: now - 1 * HOUR,
                  baseDurationMs: 2 * HOUR,
                  readyAt: now,
                },
                {
                  id: "tail",
                  name: "Mashed Potato",
                  baseDurationMs: 6 * HOUR,
                  readyAt: now + 3 * HOUR,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "recipes.collected",
        building: "Fire Pit",
        buildingId: "1",
      },
      createdAt: now,
    });

    const queue = state.buildings["Fire Pit"]?.[0].crafting ?? [];
    const derived = getCookingQueueReadyAts({ crafting: queue, game: state });
    const rewritten = queue.map((recipe, index) => ({
      ...recipe,
      readyAt: derived[index],
    }));

    expect(
      getCookingQueueReadyAts({ crafting: rewritten, game: state }),
    ).toEqual(derived);
  });

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

  it("adds +3 food when the recipe was cooked with Double Nom rank 3", () => {
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
                  skills: { "Double Nom": 3 },
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

    // 1 base + 3 (Double Nom rank 3)
    expect(state.inventory["Boiled Eggs"]).toEqual(new Decimal(4));
  });

  it("returns 2 with Fiery Jackpot rank 3 landing on its 30% chance", () => {
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
          skills: { "Fiery Jackpot": 3 },
        },
        farmActivity: {
          "Boiled Eggs Cooked": getPrngCounter(
            "Boiled Eggs",
            "Fiery Jackpot",
            30,
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

  describe("boostsUsedAt tracking", () => {
    it("records Double Nom in boostsUsedAt when it adds yield", () => {
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
        },
        action: {
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: dateNow,
      });

      expect(state.boostsUsedAt?.["Double Nom"]).toBe(dateNow);
    });

    it("records Fiery Jackpot in boostsUsedAt on a deterministic prng hit", () => {
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
          } as GameState["bumpkin"],
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

      expect(state.boostsUsedAt?.["Fiery Jackpot"]).toBe(dateNow);
    });

    it("leaves boostsUsedAt undefined when no cooking boost fires", () => {
      const fresh: GameState = { ...GAME_STATE, boostsUsedAt: undefined };

      const state = collectRecipe({
        farmId,
        state: {
          ...fresh,
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
        },
        action: {
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "123",
        },
        createdAt: dateNow,
      });

      expect(state.boostsUsedAt).toBeUndefined();
    });
  });
});
