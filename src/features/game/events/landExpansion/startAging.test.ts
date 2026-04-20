import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import { getAgingSaltCost, getFishBaseXP } from "features/game/types/aging";
import {
  getAgingTimeMs,
  getBoostedAgingTimeMs,
} from "features/game/types/agingFormulas";
import { startAging } from "./startAging";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;
const TEST_SLOT_ID = "a1b2c3d4";
const TEST_SLOT_ID_2 = "b2c3d4e5";
const TEST_SLOT_ID_3 = "c3d4e5f6";

const anchovySaltCost = getAgingSaltCost(getFishBaseXP("Anchovy"));
const seaBassSaltCost = getAgingSaltCost(getFishBaseXP("Sea Bass"));

describe("startAging", () => {
  it("throws when Aging Shed is not placed", () => {
    expect(() =>
      startAging({
        state: createFermentationTestState({ buildings: {} }),
        action: {
          type: "agingRack.started",
          fish: "Anchovy",
          slotId: TEST_SLOT_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Required building does not exist");
  });

  it("throws when slots are full", () => {
    expect(() =>
      startAging({
        state: createFermentationTestState({
          agingShed: {
            ...createInitialAgingShed(),
            level: 1,
            racks: {
              ...createInitialAgingShed().racks,
              aging: [
                {
                  id: "existing",
                  fish: "Anchovy",
                  startedAt: createdAt,
                  readyAt: createdAt + 1000,
                },
              ],
            },
          },
          inventory: {
            Anchovy: new Decimal(1),
            Salt: new Decimal(100),
          },
        }),
        action: {
          type: "agingRack.started",
          fish: "Anchovy",
          slotId: TEST_SLOT_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("throws when fish not in inventory", () => {
    expect(() =>
      startAging({
        state: createFermentationTestState({
          inventory: { Salt: new Decimal(100) },
        }),
        action: {
          type: "agingRack.started",
          fish: "Anchovy",
          slotId: TEST_SLOT_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Insufficient fish");
  });

  it("throws when salt is one below required for Anchovy (boundary)", () => {
    expect(() =>
      startAging({
        state: createFermentationTestState({
          inventory: {
            Anchovy: new Decimal(1),
            Salt: new Decimal(Math.max(anchovySaltCost - 1, 0)),
          },
        }),
        action: {
          type: "agingRack.started",
          fish: "Anchovy",
          slotId: TEST_SLOT_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Insufficient Salt");
  });

  it("succeeds when salt equals exactly the required amount for Anchovy", () => {
    const state = startAging({
      state: createFermentationTestState({
        inventory: {
          Anchovy: new Decimal(1),
          Salt: new Decimal(anchovySaltCost),
        },
      }),
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Salt?.toNumber()).toBe(0);
  });

  it("deducts 1 fish from inventory", () => {
    const state = startAging({
      state: createFermentationTestState({
        inventory: { Anchovy: new Decimal(5), Salt: new Decimal(100) },
      }),
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Anchovy?.toNumber()).toBe(4);
  });

  it(`deducts ${anchovySaltCost} salt for Anchovy (100 starting Salt)`, () => {
    const startSalt = 100;
    const state = startAging({
      state: createFermentationTestState({
        inventory: { Anchovy: new Decimal(1), Salt: new Decimal(startSalt) },
      }),
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Salt?.toNumber()).toBe(startSalt - anchovySaltCost);
  });

  it(`deducts ${seaBassSaltCost} salt for Sea Bass (100 starting Salt)`, () => {
    const startSalt = 100;
    const state = startAging({
      state: createFermentationTestState({
        inventory: { "Sea Bass": new Decimal(1), Salt: new Decimal(startSalt) },
      }),
      action: {
        type: "agingRack.started",
        fish: "Sea Bass",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.inventory.Salt?.toNumber()).toBe(startSalt - seaBassSaltCost);
  });

  it("pushes slot with correct readyAt for Anchovy", () => {
    const state = startAging({
      state: createFermentationTestState({
        inventory: { Anchovy: new Decimal(1), Salt: new Decimal(100) },
      }),
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    const slots = state.agingShed.racks.aging;
    expect(slots).toHaveLength(1);
    expect(slots[0].fish).toBe("Anchovy");
    expect(slots[0].id).toBe(TEST_SLOT_ID);
    expect(slots[0].startedAt).toBe(createdAt);
    expect(slots[0].readyAt).toBe(
      createdAt + getAgingTimeMs(getFishBaseXP("Anchovy")),
    );
  });

  it("allows multiple slots up to max for shed level", () => {
    let state = createFermentationTestState({
      agingShed: { ...createInitialAgingShed(), level: 2 },
      inventory: { Anchovy: new Decimal(5), Salt: new Decimal(100) },
    });

    state = startAging({
      state,
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    state = startAging({
      state,
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID_2,
      },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.aging).toHaveLength(2);
  });

  it("throws when level-2 shed already has max slots (third startAging)", () => {
    let state = createFermentationTestState({
      agingShed: { ...createInitialAgingShed(), level: 2 },
      inventory: { Anchovy: new Decimal(5), Salt: new Decimal(100) },
    });

    state = startAging({
      state,
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    state = startAging({
      state,
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID_2,
      },
      farmId: 1,
      createdAt,
    });

    expect(() =>
      startAging({
        state,
        action: {
          type: "agingRack.started",
          fish: "Anchovy",
          slotId: TEST_SLOT_ID_3,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("No available slots");
  });

  it("applies Speedy Aging skill to reduce readyAt by 10%", () => {
    const state = startAging({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Speedy Aging": 1 } },
        inventory: { Anchovy: new Decimal(1), Salt: new Decimal(100) },
      }),
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    const baseTime = getAgingTimeMs(getFishBaseXP("Anchovy"));
    const slot = state.agingShed.racks.aging[0];
    expect(slot.readyAt).toBe(createdAt + baseTime * 0.9);
  });

  it("sets readyAt from boosted aging time for Tuna without skills", () => {
    const baseState = createFermentationTestState({
      inventory: { Tuna: new Decimal(1), Salt: new Decimal(100) },
    });
    const state = startAging({
      state: baseState,
      action: {
        type: "agingRack.started",
        fish: "Tuna",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    const baseXP = getFishBaseXP("Tuna");
    const slot = state.agingShed.racks.aging[0];
    expect(slot.readyAt).toBe(
      createdAt + getBoostedAgingTimeMs(baseXP, baseState),
    );
  });

  it("applies Ager skill to double salt and fish cost", () => {
    const state = startAging({
      state: createFermentationTestState({
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
        inventory: { Anchovy: new Decimal(5), Salt: new Decimal(100) },
      }),
      action: {
        type: "agingRack.started",
        fish: "Anchovy",
        slotId: TEST_SLOT_ID,
      },
      farmId: 1,
      createdAt,
    });

    const baseSaltCost = getAgingSaltCost(getFishBaseXP("Anchovy"));
    expect(state.inventory.Salt?.toNumber()).toBe(100 - baseSaltCost * 2);
    expect(state.inventory.Anchovy?.toNumber()).toBe(3);
  });

  it("throws when Ager requires 2 fish but only 1 available", () => {
    expect(() =>
      startAging({
        state: createFermentationTestState({
          bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
          inventory: { Anchovy: new Decimal(1), Salt: new Decimal(100) },
        }),
        action: {
          type: "agingRack.started",
          fish: "Anchovy",
          slotId: TEST_SLOT_ID,
        },
        farmId: 1,
        createdAt,
      }),
    ).toThrow("Insufficient fish");
  });
});
