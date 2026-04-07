import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import { getPrimeAgedChance } from "features/game/types/agingFormulas";
import type { Skills } from "features/game/types/game";
import { collectAgedFish } from "./collectAgedFish";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;

/** Used with {@link collectAgedFish} prime-age roll: itemId = Aged fish, criticalHitName = Prime Aged name. */
const PRIME_AGED_PRNG_FIXTURE = {
  farmId: 1,
  fish: "Anchovy" as const,
  agedItemId: KNOWN_IDS["Aged Anchovy"],
  primeName: "Prime Aged Anchovy" as const,
};

function stateWithAgingSlots(
  slots: { fish: string; readyAt: number }[],
  extra: Record<string, unknown> = {},
) {
  return createFermentationTestState({
    agingShed: {
      ...createInitialAgingShed(),
      level: 6,
      racks: {
        ...createInitialAgingShed().racks,
        aging: slots.map((s, i) => ({
          id: `slot-${i}`,
          fish: s.fish as "Anchovy",
          startedAt: createdAt - 10000,
          readyAt: s.readyAt,
        })),
      },
    },
    ...extra,
  });
}

describe("collectAgedFish", () => {
  it("throws when no aged slots exist", () => {
    expect(() =>
      collectAgedFish({
        state: createFermentationTestState(),
        action: { type: "agingRack.collected" },
        farmId: 1,
        createdAt,
      }),
    ).toThrow();
  });

  it("throws when all slots are still in progress", () => {
    const future = createdAt + 999999;
    expect(() =>
      collectAgedFish({
        state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: future }]),
        action: { type: "agingRack.collected" },
        farmId: 1,
        createdAt,
      }),
    ).toThrow();
  });

  it("adds Aged Fish to inventory", () => {
    const past = createdAt - 1;
    const state = collectAgedFish({
      state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: past }]),
      action: { type: "agingRack.collected" },
      farmId: 1,
      createdAt,
    });

    const hasAged = (state.inventory["Aged Anchovy"] ?? new Decimal(0)).gte(1);
    const hasPrime = (
      state.inventory["Prime Aged Anchovy"] ?? new Decimal(0)
    ).gte(1);

    expect(hasAged || hasPrime).toBe(true);
  });

  it("removes ready slots and keeps in-progress ones", () => {
    const past = createdAt - 1;
    const future = createdAt + 999999;
    const state = collectAgedFish({
      state: stateWithAgingSlots([
        { fish: "Anchovy", readyAt: past },
        { fish: "Sea Bass", readyAt: future },
      ]),
      action: { type: "agingRack.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.aging).toHaveLength(1);
    expect(state.agingShed.racks.aging[0].fish).toBe("Sea Bass");
  });

  it("collects multiple ready slots at once", () => {
    const past = createdAt - 1;
    const state = collectAgedFish({
      state: stateWithAgingSlots([
        { fish: "Anchovy", readyAt: past },
        { fish: "Sea Bass", readyAt: past },
      ]),
      action: { type: "agingRack.collected" },
      farmId: 1,
      createdAt,
    });

    expect(state.agingShed.racks.aging).toHaveLength(0);
  });

  it("tracks farm activity", () => {
    const past = createdAt - 1;
    const state = collectAgedFish({
      state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: past }]),
      action: { type: "agingRack.collected" },
      farmId: 1,
      createdAt,
    });

    const agedActivity = state.farmActivity["Aged Anchovy Collected"] ?? 0;
    const primeActivity =
      state.farmActivity["Prime Aged Anchovy Collected"] ?? 0;

    expect(agedActivity + primeActivity).toBeGreaterThanOrEqual(1);
  });

  it("applies Ager skill to grant 2 items per slot", () => {
    const past = createdAt - 1;
    const state = collectAgedFish({
      state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: past }], {
        bumpkin: { ...INITIAL_BUMPKIN, skills: { Ager: 1 } },
      }),
      action: { type: "agingRack.collected" },
      farmId: 1,
      createdAt,
    });

    const aged = state.inventory["Aged Anchovy"]?.toNumber() ?? 0;
    const prime = state.inventory["Prime Aged Anchovy"]?.toNumber() ?? 0;

    expect(aged + prime).toBe(2);
  });

  describe("prime aged PRNG", () => {
    const { farmId, agedItemId, primeName } = PRIME_AGED_PRNG_FIXTURE;

    it("documents baseline 10% miss at counter 0 for farmId 1 (Anchovy)", () => {
      expect(
        prngChance({
          farmId,
          itemId: agedItemId,
          counter: 0,
          chance: getPrimeAgedChance({} as Skills),
          criticalHitName: primeName,
        }),
      ).toBe(false);
    });

    it("documents baseline 10% hit at counter 9 for farmId 1 (Anchovy)", () => {
      expect(
        prngChance({
          farmId,
          itemId: agedItemId,
          counter: 9,
          chance: getPrimeAgedChance({} as Skills),
          criticalHitName: primeName,
        }),
      ).toBe(true);
    });

    it("yields Prime Aged fish when prior collection count primes the roll (counter 9)", () => {
      const past = createdAt - 1;
      const state = collectAgedFish({
        state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: past }], {
          farmActivity: { "Aged Anchovy Collected": 9 },
        }),
        action: { type: "agingRack.collected" },
        farmId,
        createdAt,
      });

      expect(state.inventory["Prime Aged Anchovy"]?.toNumber()).toBe(1);
      expect(state.inventory["Aged Anchovy"]?.toNumber() ?? 0).toBe(0);
      expect(state.agingShed.lastAgingCollect).toEqual([
        { item: "Prime Aged Anchovy", primeAged: true },
      ]);
    });

    it("yields Aged (not Prime) at counter 10 with 10% chance, Prime with Fish Smoking (20%)", () => {
      const past = createdAt - 1;
      const baseActivity = { "Aged Anchovy Collected": 10 };

      const withoutSmoking = collectAgedFish({
        state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: past }], {
          farmActivity: baseActivity,
        }),
        action: { type: "agingRack.collected" },
        farmId,
        createdAt,
      });
      expect(withoutSmoking.inventory["Aged Anchovy"]?.toNumber()).toBe(1);
      expect(
        withoutSmoking.inventory["Prime Aged Anchovy"] ?? new Decimal(0),
      ).toEqual(new Decimal(0));

      const withSmoking = collectAgedFish({
        state: stateWithAgingSlots([{ fish: "Anchovy", readyAt: past }], {
          bumpkin: { ...INITIAL_BUMPKIN, skills: { "Fish Smoking": 1 } },
          farmActivity: baseActivity,
        }),
        action: { type: "agingRack.collected" },
        farmId,
        createdAt,
      });
      expect(withSmoking.inventory["Prime Aged Anchovy"]?.toNumber()).toBe(1);
      expect(withSmoking.inventory["Aged Anchovy"] ?? new Decimal(0)).toEqual(
        new Decimal(0),
      );
    });
  });
});
