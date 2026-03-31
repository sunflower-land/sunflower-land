import Decimal from "decimal.js-light";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import { getSpiceRackRecipe } from "features/game/types/spiceRack";
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
      farmId: 1,
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
});
