import Decimal from "decimal.js-light";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  getFermentationRecipe,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
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

  it("throws when rack is full at level 3 with three jobs including one ready but uncollected", () => {
    const past = createdAt - 1;

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
                  recipe: "Salt from Seaweed",
                  startedAt: past,
                  readyAt: past,
                },
                {
                  id: "2",
                  recipe: "Salt from Seaweed",
                  startedAt: past,
                  readyAt: past,
                },
                {
                  id: "3",
                  recipe: "Salt from Seaweed",
                  startedAt: past,
                  readyAt: past,
                },
              ],
            },
          },
          inventory: { Seaweed: new Decimal(1) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "Salt from Seaweed",
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
        Zucchini: new Decimal(20),
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

  it("queues pickled tomato with 2 refined salt", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Tomato: new Decimal(10), "Refined Salt": new Decimal(2) },
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
    expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "Pickled Tomato",
    );
  });

  it("instant salt recipe has readyAt equal to createdAt", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Seaweed: new Decimal(1) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Salt from Seaweed",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.fermentation[0].readyAt).toEqual(createdAt);
  });

  it("starts salt_from_old_bottle and deducts bottle", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { "Old Bottle": new Decimal(1) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Salt from Old Bottle",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Old Bottle"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "Salt from Old Bottle",
    );
  });

  it("exercises runtime recipe guard when type is widened", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          inventory: { Radish: new Decimal(10), Salt: new Decimal(5) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "not_a_valid_fermentation_recipe" as FermentationRecipeName,
          jobId: TEST_JOB_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Invalid fermentation recipe");
  });

  it("starts Greenhouse Glow: Pickled Radish and deducts ingredients", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: {
          "Refined Salt": new Decimal(2),
          "Pickled Radish": new Decimal(1),
        },
      }),
      action: {
        type: "fermentation.started",
        recipe: "Greenhouse Glow: Pickled Radish",
        jobId: TEST_JOB_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(0);
    expect(state.inventory["Pickled Radish"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "Greenhouse Glow: Pickled Radish",
    );
  });

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
      `Capsule Bait (Aged ${fishName}, Pickled Zucchini)` as FermentationRecipeName;

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

  it("Prime Aged basic bait recipe outputs 3 Capsule Bait", () => {
    const fishName = getFishNamesByTier("basic")[0];
    const recipe =
      `Capsule Bait (Prime Aged ${fishName}, Pickled Zucchini)` as FermentationRecipeName;

    expect(getFermentationRecipe(recipe).outputs["Capsule Bait"]).toEqual(
      new Decimal(3),
    );
  });

  it("starts Capsule Bait recipe with Prime Aged fish", () => {
    const fishName = getFishNamesByTier("basic")[0];
    const primeAgedFish = `Prime Aged ${fishName}` as const;
    const recipe =
      `Capsule Bait (Prime Aged ${fishName}, Pickled Zucchini)` as FermentationRecipeName;

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
});
