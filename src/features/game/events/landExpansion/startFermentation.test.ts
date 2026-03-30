import Decimal from "decimal.js-light";
import { INITIAL_AGING_SHED } from "features/game/lib/constants";
import { startFermentation } from "./startFermentation";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;

describe("startFermentation", () => {
  it("throws when Aging Shed is not placed", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({ buildings: {} }),
        action: {
          type: "fermentation.started",
          recipe: "pickled_radish",
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
          recipe: "pickled_radish",
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
            ...INITIAL_AGING_SHED,
            level: 1,
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
          inventory: {
            Radish: new Decimal(100),
            Salt: new Decimal(50),
          },
        }),
        action: {
          type: "fermentation.started",
          recipe: "pickled_zucchini",
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
            ...INITIAL_AGING_SHED,
            level: 3,
            racks: {
              ...INITIAL_AGING_SHED.racks,
              fermentation: [
                {
                  id: "1",
                  recipe: "salt_from_seaweed",
                  startedAt: past,
                  readyAt: past,
                },
                {
                  id: "2",
                  recipe: "salt_from_seaweed",
                  startedAt: past,
                  readyAt: past,
                },
                {
                  id: "3",
                  recipe: "salt_from_seaweed",
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
          recipe: "salt_from_seaweed",
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("allows two parallel jobs when level is 2", () => {
    let state = createFermentationTestState({
      agingShed: { ...INITIAL_AGING_SHED, level: 2 },
      inventory: {
        Radish: new Decimal(20),
        Zucchini: new Decimal(20),
        Salt: new Decimal(20),
      },
    });

    state = startFermentation({
      state,
      action: { type: "fermentation.started", recipe: "pickled_radish" },
      farmId: 1,
      createdAt,
    });

    state = startFermentation({
      state,
      action: { type: "fermentation.started", recipe: "pickled_zucchini" },
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

  it("throws when ingredients are insufficient (crop)", () => {
    expect(() =>
      startFermentation({
        state: createFermentationTestState({
          inventory: { Radish: new Decimal(5), Salt: new Decimal(5) },
        }),
        action: {
          type: "fermentation.started",
          recipe: "pickled_radish",
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
          recipe: "pickled_radish",
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
        recipe: "pickled_radish",
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Radish?.toNumber()).toEqual(0);
    expect(state.inventory.Salt?.toNumber()).toEqual(0);

    const jobs = state.agingShed.racks.fermentation;

    expect(jobs).toHaveLength(1);
    expect(jobs[0].recipe).toEqual("pickled_radish");
    expect(jobs[0].startedAt).toEqual(createdAt);
    expect(jobs[0].readyAt).toEqual(createdAt + 60 * 60 * 1000);
  });

  it("queues pickled tomato with 2 refined salt", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Tomato: new Decimal(10), "Refined Salt": new Decimal(2) },
      }),
      action: { type: "fermentation.started", recipe: "pickled_tomato" },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Tomato?.toNumber()).toEqual(0);
    expect(state.inventory["Refined Salt"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "pickled_tomato",
    );
  });

  it("instant salt recipe has readyAt equal to createdAt", () => {
    const state = startFermentation({
      state: createFermentationTestState({
        inventory: { Seaweed: new Decimal(1) },
      }),
      action: {
        type: "fermentation.started",
        recipe: "salt_from_seaweed",
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
        recipe: "salt_from_old_bottle",
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory["Old Bottle"]?.toNumber()).toEqual(0);
    expect(state.agingShed.racks.fermentation[0].recipe).toEqual(
      "salt_from_old_bottle",
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
          // @ts-expect-error — invalid recipe id for runtime guard
          recipe: "not_a_valid_fermentation_recipe",
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Invalid fermentation recipe");
  });
});
