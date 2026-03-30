import Decimal from "decimal.js-light";
import { INITIAL_AGING_SHED } from "features/game/lib/constants";
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
            ...INITIAL_AGING_SHED,
            racks: {
              ...INITIAL_AGING_SHED.racks,
              fermentation: [
                {
                  id: "job-1",
                  recipe: "pickled_radish",
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
          ...INITIAL_AGING_SHED,
          level: 3,
          racks: {
            ...INITIAL_AGING_SHED.racks,
            fermentation: [
              {
                id: "a",
                recipe: "salt_from_seaweed",
                startedAt: past,
                readyAt: past,
              },
              {
                id: "b",
                recipe: "pickled_radish",
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
    expect(state.farmActivity["salt_from_seaweed Fermented"]).toEqual(1);
  });

  it("collects multiple ready jobs at once", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...INITIAL_AGING_SHED,
          level: 2,
          racks: {
            ...INITIAL_AGING_SHED.racks,
            fermentation: [
              {
                id: "a",
                recipe: "salt_from_seaweed",
                startedAt: past,
                readyAt: past,
              },
              {
                id: "b",
                recipe: "salt_from_old_bottle",
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
    expect(state.farmActivity["salt_from_seaweed Fermented"]).toEqual(1);
    expect(state.farmActivity["salt_from_old_bottle Fermented"]).toEqual(1);
  });

  it("stacks inventory when collecting output that already exists", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        inventory: { Salt: new Decimal(3) },
        agingShed: {
          ...INITIAL_AGING_SHED,
          racks: {
            ...INITIAL_AGING_SHED.racks,
            fermentation: [
              {
                id: "a",
                recipe: "salt_from_seaweed",
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
          ...INITIAL_AGING_SHED,
          racks: {
            ...INITIAL_AGING_SHED.racks,
            fermentation: [
              {
                id: "a",
                recipe: "pickled_cabbage",
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

    expect(state.farmActivity["pickled_cabbage Fermented"]).toEqual(1);

    state = collectFermentation({
      state: {
        ...state,
        agingShed: {
          ...INITIAL_AGING_SHED,
          racks: {
            ...INITIAL_AGING_SHED.racks,
            fermentation: [
              {
                id: "b",
                recipe: "pickled_cabbage",
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

    expect(state.farmActivity["pickled_cabbage Fermented"]).toEqual(2);
  });

  it("collects pickled radish output", () => {
    const past = createdAt - 1;

    const state = collectFermentation({
      state: createFermentationTestState({
        agingShed: {
          ...INITIAL_AGING_SHED,
          racks: {
            ...INITIAL_AGING_SHED.racks,
            fermentation: [
              {
                id: "x",
                recipe: "pickled_radish",
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
});
