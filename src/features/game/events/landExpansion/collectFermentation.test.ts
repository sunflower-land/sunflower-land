import Decimal from "decimal.js-light";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import type { FermentationRecipeName } from "features/game/types/fermentation";
import { getFishNamesByTier } from "features/game/types/fishing";
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
    expect(state.inventory.Salt?.toNumber()).toEqual(8);
    expect(state.farmActivity["Salt from Seaweed Fermented"]).toEqual(1);
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
    expect(state.inventory.Salt?.toNumber()).toEqual(16);
    expect(state.farmActivity["Salt from Seaweed Fermented"]).toEqual(1);
    expect(state.farmActivity["Salt from Old Bottle Fermented"]).toEqual(1);
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

    expect(state.inventory.Salt?.toNumber()).toEqual(11);
  });

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

  it("collecting Garden Bait from Aged fish recipe grants 1 Garden Bait", () => {
    const past = createdAt - 1;
    const fishName = getFishNamesByTier("basic")[0];
    const recipe =
      `Garden Bait (Aged ${fishName}, Pickled Zucchini)` as FermentationRecipeName;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "aged-bait",
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

    expect(state.inventory["Garden Bait"]?.toNumber()).toEqual(1);
    expect(state.agingShed.racks.fermentation).toHaveLength(0);
    expect(state.farmActivity[`${recipe} Fermented`]).toEqual(1);
  });

  it("collecting Garden Bait from Prime Aged fish recipe grants 3 Garden Bait", () => {
    const past = createdAt - 1;
    const fishName = getFishNamesByTier("basic")[0];
    const recipe =
      `Garden Bait (Prime Aged ${fishName}, Pickled Zucchini)` as FermentationRecipeName;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "prime-bait",
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

    expect(state.inventory["Garden Bait"]?.toNumber()).toEqual(3);
    expect(state.agingShed.racks.fermentation).toHaveLength(0);
    expect(state.farmActivity[`${recipe} Fermented`]).toEqual(1);
  });
});
