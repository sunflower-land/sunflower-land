import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  getFermentationRecipe,
  LEGACY_FERMENTATION_RECIPE_IDS,
  type FermentationCollectedActivity,
  type FermentationRecipeName,
  type LegacyFermentationRecipeName,
} from "features/game/types/fermentation";
import { getFishNamesByTier } from "features/game/types/fishing";
import { getObjectEntries } from "lib/object";
import { collectFermentation } from "./collectFermentation";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;

describe("collectFermentation", () => {
  it("throws when Aging Shed is not placed", () => {
    expect(() =>
      collectFermentation({
        state: createFermentationTestState({ buildings: {} }),
        action: { type: "fermentation.collected" },
        farmId: 1,
        createdAt,
      }),
    ).toThrow(`Required building does not exist`);
  });

  it("throws when fermentation queue is empty", () => {
    expect(() =>
      collectFermentation({
        state: createFermentationTestState(),
        action: { type: "fermentation.collected" },
        farmId: 1,
        createdAt,
      }),
    ).toThrow(`Building is not cooking anything`);
  });

  it("throws when nothing is ready", () => {
    const readyAt = createdAt + 60 * 60 * 1000;

    expect(() =>
      collectFermentation({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
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
        }),
        action: { type: "fermentation.collected" },
        farmId: 1,
        createdAt,
      }),
    ).toThrow(`No recipes are ready`);
  });

  it("collects all ready jobs and leaves unready jobs", () => {
    const past = createdAt - 1;
    const future = createdAt + 60 * 60 * 1000;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          level: 3,
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "a",
                recipe: "Salt from Seaweed",
                startedAt: past,
                readyAt: past,
              },
              {
                id: "b",
                recipe: "Pickled Radish",
                startedAt: createdAt,
                readyAt: future,
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.fermentation).toHaveLength(1);
    expect(state.agingShed.racks.fermentation[0].id).toEqual("b");
    expect(state.inventory.Salt?.toNumber()).toEqual(15);
    expect(state.farmActivity["Salt Fermented"]).toEqual(15);
  });

  it("collects multiple ready jobs at once", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          level: 2,
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "a",
                recipe: "Salt from Seaweed",
                startedAt: past,
                readyAt: past,
              },
              {
                id: "b",
                recipe: "Salt from Old Bottle",
                startedAt: past,
                readyAt: past,
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.fermentation).toHaveLength(0);
    expect(state.inventory.Salt?.toNumber()).toEqual(24);
    expect(state.farmActivity["Salt Fermented"]).toEqual(24);
  });

  it("stacks inventory when collecting output that already exists", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        inventory: { Salt: new Decimal(3) },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "a",
                recipe: "Salt from Seaweed",
                startedAt: past,
                readyAt: past,
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Salt?.toNumber()).toEqual(18);
  });

  it.each(LEGACY_FERMENTATION_RECIPE_IDS)(
    "collects retired fermentation job still in the queue (%s)",
    (recipeId: LegacyFermentationRecipeName) => {
      const past = createdAt - 1;
      const def = getFermentationRecipe(recipeId);
      const outputEntries = getObjectEntries(def.outputs);
      expect(outputEntries).toHaveLength(1);
      const [outputItem, outputQty] = outputEntries[0]!;
      expect(outputQty?.eq(1)).toBe(true);

      const state = collectFermentation({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            racks: {
              ...createInitialAgingShed().racks,
              fermentation: [
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
        action: { type: "fermentation.collected" },
        farmId: 1,
        createdAt,
      });

      expect(state.agingShed.racks.fermentation).toHaveLength(0);
      expect(state.inventory[outputItem]?.toNumber()).toEqual(1);
      const activityName =
        `${String(outputItem)} Fermented` as FermentationCollectedActivity;
      expect(state.farmActivity[activityName]).toEqual(1);
    },
  );

  it("increments farm activity each time the same recipe is collected", () => {
    const past = createdAt - 1;

    let state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "a",
                recipe: "Pickled Cabbage",
                startedAt: past,
                readyAt: past,
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.farmActivity["Pickled Cabbage Fermented"]).toEqual(1);

    state = collectFermentation({
      state: {
        ...state,
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "b",
                recipe: "Pickled Cabbage",
                startedAt: past,
                readyAt: past,
              },
            ],
          },
        },
      },
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.farmActivity["Pickled Cabbage Fermented"]).toEqual(2);
  });

  it("collects pickled radish output", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "x",
                recipe: "Pickled Radish",
                startedAt: past,
                readyAt: past,
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Pickled Radish"]?.toNumber()).toEqual(1);
    expect(state.agingShed.racks.fermentation).toHaveLength(0);
  });

  describe.each([
    {
      family: "Capsule Bait" as const,
      tier: "basic" as const,
      activePickle: "Pickled Zucchini",
      retiredPickle: "Pickled Pepper",
    },
    {
      family: "Umbrella Bait" as const,
      tier: "advanced" as const,
      activePickle: "Pickled Cabbage",
      retiredPickle: "Pickled Onion",
    },
    {
      family: "Crimson Baitfish" as const,
      tier: "expert" as const,
      activePickle: "Pickled Radish",
      retiredPickle: "Pickled Tomato",
    },
  ])(
    "$family fermentation output",
    ({ family, tier, activePickle, retiredPickle }) => {
      it.each([
        { prefix: "Aged" as const, expected: 5 },
        { prefix: "Prime Aged" as const, expected: 10 },
      ])(
        `grants $expected ${family} from $prefix fish`,
        ({ prefix, expected }) => {
          const past = createdAt - 1;
          const fishName = getFishNamesByTier(tier)[0];
          const recipe =
            `${family} (${prefix} ${fishName}, ${activePickle})` as FermentationRecipeName;

          const state = collectFermentation({
            state: createFermentationTestState({
              agingShed: {
                ...createInitialAgingShed(),
                racks: {
                  ...createInitialAgingShed().racks,
                  fermentation: [
                    {
                      id: `${family}-${prefix}`,
                      recipe,
                      startedAt: past,
                      readyAt: past,
                    },
                  ],
                },
              },
            }),
            action: { type: "fermentation.collected" },
            farmId: 1,
            createdAt,
          });

          expect(state.inventory[family]?.toNumber()).toEqual(expected);
          expect(state.agingShed.racks.fermentation).toHaveLength(0);
          expect(state.farmActivity[`${family} Fermented`]).toEqual(expected);
        },
      );

      it(`retired ${retiredPickle} recipe still grants 5 bait from Aged fish`, () => {
        const past = createdAt - 1;
        const fishName = getFishNamesByTier(tier)[0];
        const recipe =
          `${family} (Aged ${fishName}, ${retiredPickle})` as FermentationRecipeName;

        const state = collectFermentation({
          state: createFermentationTestState({
            agingShed: {
              ...createInitialAgingShed(),
              racks: {
                ...createInitialAgingShed().racks,
                fermentation: [
                  {
                    id: `${family}-retired`,
                    recipe,
                    startedAt: past,
                    readyAt: past,
                  },
                ],
              },
            },
          }),
          action: { type: "fermentation.collected" },
          farmId: 1,
          createdAt,
        });

        expect(state.inventory[family]?.toNumber()).toEqual(5);
        expect(state.agingShed.racks.fermentation).toHaveLength(0);
        expect(state.farmActivity[`${family} Fermented`]).toEqual(5);
      });
    },
  );

  it("applies Ager skill to double fermentation output when stamped", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "ager-test",
                recipe: "Pickled Radish",
                startedAt: past,
                readyAt: past,
                skills: { Ager: true },
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Pickled Radish"]?.toNumber()).toEqual(2);
  });

  it("ignores Ager skill activated after starting (exploit guard)", () => {
    // Job was queued without the Ager stamp (1x input); activating Ager after
    // must not double the output.
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "ager-exploit",
                recipe: "Pickled Radish",
                startedAt: past,
                readyAt: past,
                skills: { Ager: false },
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Pickled Radish"]?.toNumber()).toEqual(1);
  });

  it("honours Ager stamp even when skill is deactivated after starting", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: {} },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "ager-stamped",
                recipe: "Pickled Radish",
                startedAt: past,
                readyAt: past,
                skills: { Ager: true },
              },
            ],
          },
        },
      }),
      action: { type: "fermentation.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Pickled Radish"]?.toNumber()).toEqual(2);
  });
});
