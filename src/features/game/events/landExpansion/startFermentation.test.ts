import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  BAIT_FERMENTATION_RECIPE_IDS,
  BAIT_OUTPUT_AGED,
  BAIT_OUTPUT_PRIME,
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
  "Pickled Cabbage to Broccoli",
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

  describe.each([
    {
      family: "Capsule Bait" as const,
      tier: "basic" as const,
      activePickles: ["Pickled Zucchini", "Pickled Tomato"] as const,
      retiredPickle: "Pickled Pepper" as const,
    },
    {
      family: "Umbrella Bait" as const,
      tier: "advanced" as const,
      activePickles: ["Pickled Broccoli", "Pickled Pepper"] as const,
      retiredPickle: "Pickled Cabbage" as const,
    },
    {
      family: "Crimson Baitfish" as const,
      tier: "expert" as const,
      activePickles: ["Pickled Radish", "Pickled Onion"] as const,
      retiredPickle: "Pickled Tomato" as const,
    },
  ])(
    "$family fermentation start (tier $tier)",
    ({ family, tier, activePickles, retiredPickle }) => {
      describe.each([
        { prefix: "Aged" as const, expected: BAIT_OUTPUT_AGED },
        { prefix: "Prime Aged" as const, expected: BAIT_OUTPUT_PRIME },
      ])("$prefix fish", ({ prefix, expected }) => {
        it.each(activePickles)(
          `starts with %s, deducts ingredients, and recipe outputs ${family} matching centralised constant`,
          (pickle) => {
            const fishName = getFishNamesByTier(tier)[0];
            const fishKey = `${prefix} ${fishName}` as const;
            const recipe =
              `${family} (${prefix} ${fishName}, ${pickle})` as StartableFermentationRecipeName;

            const state = startFermentation({
              state: createFermentationTestState({
                inventory: {
                  [fishKey]: new Decimal(1),
                  [pickle]: new Decimal(1),
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

            expect(state.inventory[fishKey]?.toNumber()).toEqual(0);
            expect(state.inventory[pickle]?.toNumber()).toEqual(0);
            expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
              recipe,
            );
            expect(
              getFermentationRecipe(recipe).outputs[family]?.toNumber(),
            ).toEqual(expected.toNumber());
          },
        );
      });

      it(`retired ${retiredPickle} recipe output still matches centralised constants`, () => {
        const fishName = getFishNamesByTier(tier)[0];
        for (const { prefix, expected } of [
          { prefix: "Aged" as const, expected: BAIT_OUTPUT_AGED },
          { prefix: "Prime Aged" as const, expected: BAIT_OUTPUT_PRIME },
        ]) {
          const recipe =
            `${family} (${prefix} ${fishName}, ${retiredPickle})` as FermentationRecipeName;
          expect(
            getFermentationRecipe(recipe).outputs[family]?.toNumber(),
          ).toEqual(expected.toNumber());
        }
      });
    },
  );

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

  it("stamps Ager=true on the fermentation job when the skill is active", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        inventory: { Radish: new Decimal(20), Salt: new Decimal(10) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Pickled Radish",
        jobId: "ager-stamp",
      },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.fermentation[0].skills?.Ager).toBe(true);
  });

  it("stamps Ager=false on the fermentation job when the skill is not active", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Radish: new Decimal(10), Salt: new Decimal(5) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Pickled Radish",
        jobId: "no-ager-stamp",
      },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.fermentation[0].skills?.Ager).toBe(false);
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

  describe("rejects retired Pickled Cabbage recipes", () => {
    it.each(["Pickled Cabbage", "Greenhouse Glow: Pickled Cabbage"] as const)(
      "throws when attempting to start %s",
      (recipe) => {
        expect(() =>
          startFermentation({
            state: createFermentationTestState({
              inventory: {
                Cabbage: new Decimal(100),
                Salt: new Decimal(100),
                "Refined Salt": new Decimal(10),
                "Pickled Cabbage": new Decimal(10),
              },
            }),
            action: {
              type: "fermentation.started",
              recipe: recipe as StartableFermentationRecipeName,
              jobId: TEST_JOB_ID,
            },
            farmId: 1,
            createdAt,
          }),
        ).toThrow(/no longer available/);
      },
    );

    it("throws when attempting to start a retired Umbrella Bait (Pickled Cabbage) variant", () => {
      const fishName = getFishNamesByTier("advanced")[0];
      const recipe = `Umbrella Bait (Aged ${fishName}, Pickled Cabbage)`;

      expect(() =>
        startFermentation({
          state: createFermentationTestState({
            inventory: {
              [`Aged ${fishName}`]: new Decimal(1),
              "Pickled Cabbage": new Decimal(1),
            },
          }),
          action: {
            type: "fermentation.started",
            recipe: recipe as StartableFermentationRecipeName,
            jobId: TEST_JOB_ID,
          },
          farmId: 1,
          createdAt,
        }),
      ).toThrow(/no longer available/);
    });
  });

  describe("Pickled Cabbage to Broccoli conversion", () => {
    it("converts 1 Pickled Cabbage into 1 Pickled Broccoli instantly", () => {
      const state = startFermentation({
        state: createFermentationTestState({
          inventory: { "Pickled Cabbage": new Decimal(3) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Pickled Cabbage to Broccoli",
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      });

      expect(state.inventory["Pickled Cabbage"]?.toNumber()).toEqual(2);
      expect(state.inventory["Pickled Broccoli"]?.toNumber()).toEqual(1);
      expect(state.agingShed.racks.fermentation).toHaveLength(0);
    });

    it("throws when the player has no Pickled Cabbage", () => {
      expect(() =>
        startFermentation({
          state: createFermentationTestState({ inventory: {} }),
          action: {
            type: "fermentation.started",
            recipe: "Pickled Cabbage to Broccoli",
            jobId: TEST_JOB_ID,
          },
          farmId: 1,
          createdAt,
        }),
      ).toThrow("Insufficient ingredient");
    });
  });
});
