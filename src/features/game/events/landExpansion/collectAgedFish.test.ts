import Decimal from "decimal.js-light";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import { collectAgedFish } from "./collectAgedFish";
import {
  createFermentationTestState,
  FERMENTATION_TEST_NOW,
} from "./fermentationTestHelpers";

const createdAt = FERMENTATION_TEST_NOW;

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
});
