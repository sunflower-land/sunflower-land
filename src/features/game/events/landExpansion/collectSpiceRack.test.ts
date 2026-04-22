import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  getSpiceRackRecipe,
  LEGACY_SPICE_RACK_RECIPE_IDS,
  spiceRackCollectedActivity,
  type LegacySpiceRackRecipeName,
} from "features/game/types/spiceRack";
import { getObjectEntries } from "lib/object";
import { collectSpiceRack } from "./collectSpiceRack";
import { startSpiceRack } from "./startSpiceRack";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;

describe("collectSpiceRack", () => {
  it("throws when Aging Shed is not placed", () => {
    expect(() =>
      collectSpiceRack({
        state: createFermentationTestState({ buildings: {} }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      }),
    ).toThrow("Required building does not exist");
  });

  it("throws when spice queue is empty", () => {
    expect(() =>
      collectSpiceRack({
        state: createFermentationTestState(),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      }),
    ).toThrow(`Building is not cooking anything`);
  });

  it("throws when nothing is ready", () => {
    const readyAt = createdAt + 60 * 60 * 1000;

    expect(() =>
      collectSpiceRack({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              spice: [
                {
                  id: "job-1",
                  recipe: "Refined Salt",
                  startedAt: createdAt,
                  readyAt,
                },
              ],
            },
          },
        }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      }),
    ).toThrow(`No recipes are ready`);
  });

  it("collects all ready jobs and leaves unready jobs", () => {
    const past = createdAt - 1;
    const future = createdAt + 60 * 60 * 1000;

    const state = collectSpiceRack({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          level: 3,
          racks: {
            ...createInitialAgingShed().racks,
            spice: [
              {
                id: "a",
                recipe: "Refined Salt",
                startedAt: past,
                readyAt: past,
              },
              {
                id: "b",
                recipe: "Salt Lick",
                startedAt: createdAt,
                readyAt: future,
              },
            ],
          },
        },
      }),
      action: { type: "spiceRack.collected" },
      createdAt,
      farmId: 1,
    });

    expect(state.agingShed.racks.spice).toHaveLength(1);
    expect(state.agingShed.racks.spice[0].id).toEqual("b");
    const out = getSpiceRackRecipe("Refined Salt").outputs;
    expect(
      state.inventory["Refined Salt"]?.toNumber() ?? 0,
    ).toBeGreaterThanOrEqual(Number(out["Refined Salt"] ?? 0));
  });

  it("integrates with startSpiceRack end-to-end", () => {
    let state = startSpiceRack({
      state: createFermentationTestState({
        agingShed: { ...createInitialAgingShed(), level: 2 },
        inventory: { Salt: new Decimal(10) },
      }),
      action: {
        type: "spiceRack.started",
        recipe: "Refined Salt",
        jobId: "job1abcd",
      },
      createdAt,
    });

    const readyAt = state.agingShed.racks.spice[0].readyAt;

    state = collectSpiceRack({
      state,
      action: { type: "spiceRack.collected" },
      createdAt: readyAt,
      farmId: 1,
    });

    expect(state.agingShed.racks.spice).toHaveLength(0);
    expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(1);
  });

  it.each(LEGACY_SPICE_RACK_RECIPE_IDS)(
    "collects retired spice rack job still in the queue (%s)",
    (recipeId: LegacySpiceRackRecipeName) => {
      const past = createdAt - 1;
      const def = getSpiceRackRecipe(recipeId);
      const outputEntries = getObjectEntries(def.outputs);
      expect(outputEntries).toHaveLength(1);
      const [outputItem, outputQty] = outputEntries[0]!;
      expect(outputQty?.eq(1)).toBe(true);

      const state = collectSpiceRack({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              spice: [
                {
                  id: `legacy-${recipeId}`,
                  recipe: recipeId,
                  startedAt: past,
                  readyAt: past,
                },
              ],
            },
          },
        }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      });

      expect(state.agingShed.racks.spice).toHaveLength(0);
      expect(state.inventory[outputItem]?.toNumber()).toEqual(1);
      const activityName = spiceRackCollectedActivity(recipeId);
      expect(state.farmActivity[activityName]).toEqual(1);
    },
  );

  it("applies Ager skill to double spice rack output when stamped", () => {
    const past = createdAt - 1;

    const state = collectSpiceRack({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            spice: [
              {
                id: "ager-test",
                recipe: "Salt Lick",
                startedAt: past,
                readyAt: past,
                skills: { Ager: true },
              },
            ],
          },
        },
      }),
      action: { type: "spiceRack.collected" },
      createdAt,
      farmId: 1,
    });

    expect(state.inventory["Salt Lick"]?.toNumber()).toEqual(10);
  });

  it("ignores Ager skill activated after starting (exploit guard)", () => {
    // Job was queued without Ager (1x input paid); activating Ager after
    // must not double the output.
    const past = createdAt - 1;

    const state = collectSpiceRack({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            spice: [
              {
                id: "ager-exploit",
                recipe: "Salt Lick",
                startedAt: past,
                readyAt: past,
                skills: { Ager: false },
              },
            ],
          },
        },
      }),
      action: { type: "spiceRack.collected" },
      createdAt,
      farmId: 1,
    });

    expect(state.inventory["Salt Lick"]?.toNumber()).toEqual(5);
  });

  describe("Refiner skill (Refined Salt output)", () => {
    const past = createdAt - 1;
    const refinedRecipeActivity = spiceRackCollectedActivity("Refined Salt");

    it("does not grant Refiner bonus without the skill at a hit counter", () => {
      const state = collectSpiceRack({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              spice: [
                {
                  id: "refiner-miss-skill",
                  recipe: "Refined Salt",
                  startedAt: past,
                  readyAt: past,
                },
              ],
            },
          },
          farmActivity: { [refinedRecipeActivity]: 4 },
        }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      });

      expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(1);
    });

    it("grants +1 Refined Salt on PRNG hit (counter 4) with Refiner", () => {
      const state = collectSpiceRack({
        state: createFermentationTestState({
          bumpkin: { ...INITIAL_BUMPKIN, skills: { Refiner: 1 } },
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              spice: [
                {
                  id: "refiner-hit",
                  recipe: "Refined Salt",
                  startedAt: past,
                  readyAt: past,
                },
              ],
            },
          },
          farmActivity: { [refinedRecipeActivity]: 4 },
        }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      });

      expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(2);
    });

    it("does not grant Refiner +1 on PRNG miss (counter 0) with Refiner", () => {
      const state = collectSpiceRack({
        state: createFermentationTestState({
          bumpkin: { ...INITIAL_BUMPKIN, skills: { Refiner: 1 } },
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              spice: [
                {
                  id: "refiner-miss-roll",
                  recipe: "Refined Salt",
                  startedAt: past,
                  readyAt: past,
                },
              ],
            },
          },
          farmActivity: { [refinedRecipeActivity]: 0 },
        }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      });

      expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(1);
    });

    it("stacks Ager 2× with Refiner bonus on PRNG hit", () => {
      const state = collectSpiceRack({
        state: createFermentationTestState({
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: { Ager: 1, Refiner: 1 },
          },
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              spice: [
                {
                  id: "ager-refiner-hit",
                  recipe: "Refined Salt",
                  startedAt: past,
                  readyAt: past,
                  skills: { Ager: true },
                },
              ],
            },
          },
          farmActivity: { [refinedRecipeActivity]: 4 },
        }),
        action: { type: "spiceRack.collected" },
        createdAt,
        farmId: 1,
      });

      expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(3);
    });
  });
});
