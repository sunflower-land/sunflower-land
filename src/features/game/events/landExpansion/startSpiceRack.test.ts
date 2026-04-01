import Decimal from "decimal.js-light";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import type { SpiceRackRecipeName } from "features/game/types/spiceRack";
import { getSpiceRackRecipe } from "features/game/types/spiceRack";
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

  it("throws on invalid recipe id", () => {
    expect(() =>
      startSpiceRack({
        state: createFermentationTestState({
          inventory: { Salt: new Decimal(10) },
        }),
        action: {
          type: "spiceRack.started",
          recipe: "not_a_valid_recipe" as SpiceRackRecipeName,
          jobId: TEST_JOB_ID,
        },
        createdAt,
      }),
    ).toThrow("Invalid spice rack recipe");
  });

  it("sets readyAt from durationSeconds", () => {
    const recipe: SpiceRackRecipeName = "Salt Lick";
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
});
