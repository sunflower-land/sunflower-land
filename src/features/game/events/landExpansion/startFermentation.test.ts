import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  BAIT_FERMENTATION_RECIPE_IDS,
  getFermentationRecipe,
  GREENHOUSE_FERMENTATION_STARTABLE_IDS,
  LEGACY_FERMENTATION_RECIPE_IDS,
  RETIRED_BAIT_FERMENTATION_RECIPE_IDS,
  type BaitFermentationRecipeName,
  type FermentationRecipeName,
  type LegacyFermentationRecipeName,
  type RetiredBaitFermentationRecipeName,
  type StartableFermentationRecipeName,
} from "features/game/types/fermentation";
import { getObjectEntries } from "lib/object";
import { getFishNamesByTier } from "features/game/types/fishing";
import { startFermentation } from "./startFermentation";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;

/** Stable 8-char ids (required on action; mirrors client `crypto.randomUUID().slice(0, 8)`). */
const TEST_JOB_ID = "a1b2c3d4";
const TEST_JOB_ID_2 = "b2c3d4e5";
const INSTANT_FERMENTATION_RECIPES = [
  "Salt from Seaweed",
  "Salt from Old Bottle",
  "Salt from Crab",
  "Salt from Bones",
] as const;

describe("startFermentation", () => {
  it("throws when Aging Shed is not placed", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({ buildings: {} }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Radish",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow(`Required building does not exist`);
  });

  it("throws when Aging Shed exists but has no coordinates", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          buildings: {
            "Aging Shed": [
              {
                id: "aging-shed-1",
                createdAt,
              },
            ],
          },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Radish",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow(`Required building does not exist`);
  });

  it("throws when there are no available slots for level 1", () => {
    const readyAt = createdAt + 60_000;

    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            level: 1,
            racks: {
              ...createInitialAgingShed().racks,
              fermentation: [
                {
                  id: "job-1",
                  recipe: "Pickled Radish",
                  startedAt: createdAt,
                  readyAt,
                },
              ],
            },
          },
          inventory: {
            Radish: new Decimal(100),
            Salt: new Decimal(50),
          },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Zucchini",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("throws when rack is full at level 3 and starting a timed recipe", () => {
    const past = createdAt - 1;
    const future = createdAt + 60 * 60 * 1000;

    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            level: 3,
            racks: {
              ...createInitialAgingShed().racks,
              fermentation: [
                {
                  id: "1",
                  recipe: "Pickled Radish",
                  startedAt: past,
                  readyAt: future,
                },
                {
                  id: "2",
                  recipe: "Pickled Radish",
                  startedAt: past,
                  readyAt: future,
                },
                {
                  id: "3",
                  recipe: "Pickled Radish",
                  startedAt: past,
                  readyAt: future,
                },
              ],
            },
          },
          inventory: { Tomato: new Decimal(10), Salt: new Decimal(5) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Tomato",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("allows two parallel jobs when level is 2", () => {
    let state = createFermentationTestState({
      agingShed: { ...createInitialAgingShed(), level: 2 },
      inventory: {
        Radish: new Decimal(20),
        Zucchini: new Decimal(75),
        Salt: new Decimal(20),
      },
    });

    state = startFermentation({
      state,
      action: {
        type: "fermentation.started",
        recipe: "Pickled Radish",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    state = startFermentation({
      state,
      action: {
        type: "fermentation.started",
        recipe: "Pickled Zucchini",
        jobId: TEST_JOB_ID_2,
      },
      farmId: 1,
      createdAt,
    });

    const jobs = state.agingShed.racks.fermentation;

    expect(jobs).toHaveLength(2);
    expect(jobs[0].startedAt).toEqual(createdAt);
    expect(jobs[1].startedAt).toEqual(createdAt);
    expect(jobs[1].readyAt).toEqual(createdAt + 60 * 60 * 1000);
    expect(jobs[0].readyAt).toEqual(createdAt + 60 * 60 * 1000);
    expect(jobs[0].id).not.toEqual(jobs[1].id);
  });

  it("stores action jobId on the fermentation job", () => {
    const recipe: FermentationRecipeName = "Pickled Radish";
    const jobId = "feedface";
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          Radish: new Decimal(100),
          Salt: new Decimal(50),
        },
      }),
      action: { type: "fermentation.started", recipe, jobId },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.fermentation).toHaveLength(1);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipe);
    expect(state.agingShed.racks.fermentation[0].id).toEqual(jobId);
  });

  it("throws when ingredients are insufficient (crop)", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          inventory: { Radish: new Decimal(5), Salt: new Decimal(5) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Radish",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Insufficient ingredient: Radish");
  });

  it("throws when ingredients are insufficient (salt)", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          inventory: { Radish: new Decimal(10), Salt: new Decimal(4) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Radish",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Insufficient ingredient: Salt");
  });

  it("deducts ingredients and queues pickled radish", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Radish: new Decimal(10), Salt: new Decimal(5) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Pickled Radish",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Radish?.toNumber()).toEqual(0);
    expect(state.inventory.Salt?.toNumber()).toEqual(0);

    const jobs = state.agingShed.racks.fermentation;

    expect(jobs).toHaveLength(1);
    expect(jobs[0].recipe).toEqual("Pickled Radish");
    expect(jobs[0].startedAt).toEqual(createdAt);
    expect(jobs[0].readyAt).toEqual(createdAt + 60 * 60 * 1000);
  });

  it("queues pickled tomato with salt", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Tomato: new Decimal(15), Salt: new Decimal(5) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Pickled Tomato",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Tomato?.toNumber()).toEqual(0);
    expect(state.inventory.Salt?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "Pickled Tomato",
    );
  });

  it.each(INSTANT_FERMENTATION_RECIPES)(
    "instant recipe %s grants output without enqueueing",
    (recipe) => {
      const def = getFermentationRecipe(recipe);
      const inventory: Record<string, Decimal> = {};
      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      const state = startFermentation({
        state: createFermentationTestState({ inventory }),
        action: {
          type: "fermentation.started",
          recipe,
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      });

      expect(state.agingShed.racks.fermentation).toHaveLength(0);
      for (const [item, qty] of getObjectEntries(def.outputs)) {
        expect(state.inventory[item]?.toNumber()).toEqual(qty?.toNumber());
      }
      for (const [ing] of getObjectEntries(def.ingredients)) {
        expect(state.inventory[ing]?.toNumber() ?? 0).toEqual(0);
      }
    },
  );

  it.each(INSTANT_FERMENTATION_RECIPES)(
    "allows zero-duration recipe %s when fermentation rack is full",
    (recipe) => {
      const past = createdAt - 1;
      const future = createdAt + 60 * 60 * 1000;
      const newJobId = "instant01";
      const def = getFermentationRecipe(recipe);
      const inventory: Record<string, Decimal> = {};

      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      const state = startFermentation({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            level: 3,
            racks: {
              ...createInitialAgingShed().racks,
              fermentation: [
                {
                  id: "1",
                  recipe: "Pickled Radish",
                  startedAt: past,
                  readyAt: future,
                },
                {
                  id: "2",
                  recipe: "Pickled Radish",
                  startedAt: past,
                  readyAt: future,
                },
                {
                  id: "3",
                  recipe: "Pickled Radish",
                  startedAt: past,
                  readyAt: future,
                },
              ],
            },
          },
          inventory,
        }),
        action: {
          type: "fermentation.started",
          recipe,
          jobId: newJobId,
        },
        farmId: 1,
        createdAt,
      });

      expect(state.agingShed.racks.fermentation).toHaveLength(3);
      expect(state.agingShed.racks.fermentation.map((j) => j.id)).not.toContain(
        newJobId,
      );

      for (const [item, qty] of getObjectEntries(def.outputs)) {
        expect(state.inventory[item]?.toNumber()).toEqual(qty?.toNumber());
      }
      for (const [ing] of getObjectEntries(def.ingredients)) {
        expect(state.inventory[ing]?.toNumber() ?? 0).toEqual(0);
      }
    },
  );

  it("exercises runtime recipe guard when type is widened", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          inventory: { Radish: new Decimal(10), Salt: new Decimal(5) },
        }),
        action: {
          type: "fermentation.started",
          recipe:
            "not_a_valid_fermentation_recipe" as StartableFermentationRecipeName,
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Invalid fermentation recipe");
  });

  it.each(LEGACY_FERMENTATION_RECIPE_IDS)(
    "rejects legacy fermentation recipe so it cannot be started (%s)",
    (recipeId: LegacyFermentationRecipeName) => {
      const def = getFermentationRecipe(recipeId);
      const inventory: Record<string, Decimal> = {};
      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      expect(() =>
        startFermentation({
          state: createFermentationTestState({ inventory }),
          action: {
            type: "fermentation.started",
            recipe: recipeId as StartableFermentationRecipeName,
            jobId: TEST_JOB_ID,
          },
          farmId: 1,
          createdAt,
        }),
      ).toThrow("This fermentation recipe is no longer available.");
    },
  );

  it.each(RETIRED_BAIT_FERMENTATION_RECIPE_IDS)(
    "rejects retired bait fermentation recipe so it cannot be started (%s)",
    (recipeId: RetiredBaitFermentationRecipeName) => {
      const def = getFermentationRecipe(recipeId);
      const inventory: Record<string, Decimal> = {};
      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      expect(() =>
        startFermentation({
          state: createFermentationTestState({ inventory }),
          action: {
            type: "fermentation.started",
            recipe: recipeId as StartableFermentationRecipeName,
            jobId: TEST_JOB_ID,
          },
          farmId: 1,
          createdAt,
        }),
      ).toThrow("This fermentation recipe is no longer available.");
    },
  );

  it.each([...GREENHOUSE_FERMENTATION_STARTABLE_IDS])(
    "starts %s with Refined Salt and deducts all ingredients",
    (recipeId) => {
      const def = getFermentationRecipe(recipeId);
      expect(def.ingredients["Refined Salt"]?.eq(1)).toBe(true);

      const inventory: Record<string, Decimal> = {};
      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      const state = startFermentation({
        state: createFermentationTestState({ inventory }),
        action: {
          type: "fermentation.started",
          recipe: recipeId,
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      });

      for (const [ing] of getObjectEntries(def.ingredients)) {
        expect(state.inventory[ing]?.toNumber() ?? 0).toEqual(0);
      }
      expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipeId);
    },
  );

  it.each(BAIT_FERMENTATION_RECIPE_IDS)(
    "starts bait fermentation recipe and deducts ingredients (%s)",
    (recipeId: BaitFermentationRecipeName) => {
      const def = getFermentationRecipe(recipeId);
      const inventory: Record<string, Decimal> = {};
      for (const [ing, qty] of getObjectEntries(def.ingredients)) {
        inventory[ing] = qty ?? new Decimal(0);
      }

      const state = startFermentation({
        state: createFermentationTestState({ inventory }),
        action: {
          type: "fermentation.started",
          recipe: recipeId,
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      });

      for (const [ing] of getObjectEntries(def.ingredients)) {
        expect(state.inventory[ing]?.toNumber() ?? 0).toEqual(0);
      }
      expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipeId);
    },
  );

  it("starts Sproutroot Surprise and deducts ingredients", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          "Refined Salt": new Decimal(2),
          "Sprout Mix": new Decimal(5),
          "Rapid Root": new Decimal(5),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Sproutroot Surprise",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Sprout Mix"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "Sproutroot Surprise",
    );
  });

  it("starts Capsule Bait recipe for first basic-tier fish (Aged)", () => {
    const fishName = getFishNamesByTier("basic")[0];
    const agedFish = `Aged ${fishName}` as const;
    const recipe =
      `Capsule Bait (Aged ${fishName}, Pickled Zucchini)` as StartableFermentationRecipeName;

    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          [agedFish]: new Decimal(1),
          "Pickled Zucchini": new Decimal(1),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe,
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory[agedFish]?.toNumber()).toEqual(0);
    expect(state.inventory["Pickled Zucchini"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipe);
  });

  it("Prime Aged basic bait recipe outputs 6 Capsule Bait", () => {
    const fishName = getFishNamesByTier("basic")[0];
    const recipe =
      `Capsule Bait (Prime Aged ${fishName}, Pickled Zucchini)` as FermentationRecipeName;

    expect(getFermentationRecipe(recipe).outputs["Capsule Bait"]).toEqual(
      new Decimal(6),
    );
  });

  it("starts Capsule Bait recipe with Prime Aged fish", () => {
    const fishName = getFishNamesByTier("basic")[0];
    const primeAgedFish = `Prime Aged ${fishName}` as const;
    const recipe =
      `Capsule Bait (Prime Aged ${fishName}, Pickled Zucchini)` as StartableFermentationRecipeName;

    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          [primeAgedFish]: new Decimal(1),
          "Pickled Zucchini": new Decimal(1),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe,
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory[primeAgedFish]?.toNumber()).toEqual(0);
    expect(state.inventory["Pickled Zucchini"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipe);
  });

  it("starts Capsule Bait with Pickled Tomato for first basic-tier fish (Aged)", () => {
    const fishName = getFishNamesByTier("basic")[0];
    const agedFish = `Aged ${fishName}` as const;
    const recipe =
      `Capsule Bait (Aged ${fishName}, Pickled Tomato)` as StartableFermentationRecipeName;

    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          [agedFish]: new Decimal(1),
          "Pickled Tomato": new Decimal(1),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe,
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory[agedFish]?.toNumber()).toEqual(0);
    expect(state.inventory["Pickled Tomato"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipe);
  });

  it("starts Umbrella Bait with Pickled Pepper for first advanced-tier fish (Aged)", () => {
    const fishName = getFishNamesByTier("advanced")[0];
    const agedFish = `Aged ${fishName}` as const;
    const recipe =
      `Umbrella Bait (Aged ${fishName}, Pickled Pepper)` as StartableFermentationRecipeName;

    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          [agedFish]: new Decimal(1),
          "Pickled Pepper": new Decimal(1),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe,
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory[agedFish]?.toNumber()).toEqual(0);
    expect(state.inventory["Pickled Pepper"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipe);
  });

  it("starts Crimson Baitfish with Pickled Radish for first expert-tier fish (Aged)", () => {
    const fishName = getFishNamesByTier("expert")[0];
    const agedFish = `Aged ${fishName}` as const;
    const recipe =
      `Crimson Baitfish (Aged ${fishName}, Pickled Radish)` as StartableFermentationRecipeName;

    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          [agedFish]: new Decimal(1),
          "Pickled Radish": new Decimal(1),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe,
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory[agedFish]?.toNumber()).toEqual(0);
    expect(state.inventory["Pickled Radish"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(recipe);
  });

  it("applies Ager skill to double ingredient costs", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        inventory: { Radish: new Decimal(20), Salt: new Decimal(10) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Pickled Radish",
        jobId: "ager-test",
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Radish?.toNumber()).toBe(0);
    expect(state.inventory.Salt?.toNumber()).toBe(0);
  });

  it("throws when Ager doubles cost beyond available ingredients", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
          inventory: { Radish: new Decimal(10), Salt: new Decimal(5) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Radish",
          jobId: "ager-fail",
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Insufficient ingredient");
  });
});
