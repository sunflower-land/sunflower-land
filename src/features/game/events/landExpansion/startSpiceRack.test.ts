import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import type {
  LegacySpiceRackRecipeName,
  StartableSpiceRackRecipeName,
} from "features/game/types/spiceRack";
import {
  getSpiceRackRecipe,
  LEGACY_SPICE_RACK_RECIPE_IDS,
} from "features/game/types/spiceRack";
import { getObjectEntries } from "lib/object";
import { startSpiceRack } from "./startSpiceRack";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;
const TEST_JOB_ID = "a1b2c3d4";

describe("startSpiceRack", () => {
  it("throws when Aging Shed is not placed", () => {
    expect(() =>
      startSpiceRack({
        state: createFermentationTestState({ buildings: {} }),
        action: {
          type: "spiceRack.started",
          recipe: "Refined Salt",
          jobId: TEST_JOB_ID,
        },
        createdAt,
      }),
    ).toThrow(`Required building does not exist`);
  });

  it("throws when there are no available slots for level 1", () => {
    const readyAt = createdAt + 60_000;

    expect(() =>
      startSpiceRack({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            level: 1,
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
          inventory: {
            Salt: new Decimal(100),
          },
        }),
        action: {
          type: "spiceRack.started",
          recipe: "Salt Lick",
          jobId: TEST_JOB_ID,
        },
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("deducts ingredients and appends a job", () => {
    const state = startSpiceRack({
      state: createFermentationTestState({
        agingShed: { ...createInitialAgingShed(), level: 2 },
        inventory: {
          Salt: new Decimal(10),
        },
      }),
      action: {
        type: "spiceRack.started",
        recipe: "Refined Salt",
        jobId: TEST_JOB_ID,
      },
      createdAt,
    });

    expect(state.inventory.Salt?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.spice).toHaveLength(1);
    expect(state.agingShed.racks.spice[0].recipe).toEqual("Refined Salt");
    expect(state.agingShed.racks.spice[0].id).toEqual(TEST_JOB_ID);
  });

  it("throws when jobId is already queued", () => {
    const base = createFermentationTestState({
      agingShed: { ...createInitialAgingShed(), level: 2 },
      inventory: {
        Salt: new Decimal(20),
      },
    });

    const afterFirst = startSpiceRack({
      state: base,
      action: {
        type: "spiceRack.started",
        recipe: "Refined Salt",
        jobId: TEST_JOB_ID,
      },
      createdAt,
    });

    expect(afterFirst.inventory.Salt?.toNumber()).toEqual(10);
    expect(afterFirst.agingShed.racks.spice).toHaveLength(1);

    expect(() =>
      startSpiceRack({
        state: afterFirst,
        action: {
          type: "spiceRack.started",
          recipe: "Refined Salt",
          jobId: TEST_JOB_ID,
        },
        createdAt,
      }),
    ).toThrow("Job already exists");
  });

  it("throws on invalid recipe id", () => {
    expect(() =>
      startSpiceRack({
        state: createFermentationTestState({
          inventory: { Salt: new Decimal(10) },
        }),
        action: {
          type: "spiceRack.started",
          recipe: "not_a_valid_recipe" as StartableSpiceRackRecipeName,
          jobId: TEST_JOB_ID,
        },
        createdAt,
      }),
    ).toThrow("Invalid spice rack recipe");
  });

  it.each(LEGACY_SPICE_RACK_RECIPE_IDS)(
    "rejects legacy spice rack recipe so it cannot be started (%s)",
    (recipeId: LegacySpiceRackRecipeName) => {
      const def = getSpiceRackRecipe(recipeId);
      const inventory: Record<string, Decimal> = {};
      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      expect(() =>
        startSpiceRack({
          state: createFermentationTestState({ inventory }),
          action: {
            type: "spiceRack.started",
            recipe: recipeId as StartableSpiceRackRecipeName,
            jobId: TEST_JOB_ID,
          },
          createdAt,
        }),
      ).toThrow("This spice rack recipe is no longer available.");
    },
  );

  it("sets readyAt from durationSeconds", () => {
    const recipe: StartableSpiceRackRecipeName = "Salt Lick";
    const def = getSpiceRackRecipe(recipe);

    const state = startSpiceRack({
      state: createFermentationTestState({
        agingShed: { ...createInitialAgingShed(), level: 2 },
        inventory: {
          "Refined Salt": new Decimal(5),
        },
      }),
      action: {
        type: "spiceRack.started",
        recipe,
        jobId: TEST_JOB_ID,
      },
      createdAt,
    });

    expect(state.agingShed.racks.spice[0].readyAt).toEqual(
      createdAt + def.durationSeconds * 1000,
    );
  });

  it("applies Ager skill to double ingredient costs", () => {
    const state = startSpiceRack({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        agingShed: { ...createInitialAgingShed(), level: 2 },
        inventory: { Salt: new Decimal(20) },
      }),
      action: {
        type: "spiceRack.started",
        recipe: "Refined Salt",
        jobId: TEST_JOB_ID,
      },
      createdAt,
    });

    expect(state.inventory.Salt?.toNumber()).toEqual(0);
  });

  it("stamps Ager=true on the spice rack job when the skill is active", () => {
    const state = startSpiceRack({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        agingShed: { ...createInitialAgingShed(), level: 2 },
        inventory: { Salt: new Decimal(20) },
      }),
      action: {
        type: "spiceRack.started",
        recipe: "Refined Salt",
        jobId: TEST_JOB_ID,
      },
      createdAt,
    });

    expect(state.agingShed.racks.spice[0].skills?.Ager).toBe(true);
  });

  it("stamps Ager=false on the spice rack job when the skill is not active", () => {
    const state = startSpiceRack({
      state: createFermentationTestState({
        agingShed: { ...createInitialAgingShed(), level: 2 },
        inventory: { Salt: new Decimal(10) },
      }),
      action: {
        type: "spiceRack.started",
        recipe: "Refined Salt",
        jobId: TEST_JOB_ID,
      },
      createdAt,
    });

    expect(state.agingShed.racks.spice[0].skills?.Ager).toBe(false);
  });

  it("throws when Ager doubles cost beyond available ingredients", () => {
    expect(() =>
      startSpiceRack({
        state: createFermentationTestState({
          bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
          agingShed: { ...createInitialAgingShed(), level: 2 },
          inventory: { Salt: new Decimal(10) },
        }),
        action: {
          type: "spiceRack.started",
          recipe: "Refined Salt",
          jobId: TEST_JOB_ID,
        },
        createdAt,
      }),
    ).toThrow("Insufficient ingredient");
  });
});
