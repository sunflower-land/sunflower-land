import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveBatch,
  CaveMachine,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import { hasIdleCaveMachine, isCaveBuildingReady } from "./cave";
import { CAVE_PATCH_WIDTH } from "features/game/types/caveRecipes";

const now = 1_000_000;

const withCave = (cave?: PlacedItem): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, ...(cave ? { Cave: [cave] } : {}) },
});

describe("isCaveBuildingReady", () => {
  it("is ready once a placed Cave has finished construction", () => {
    expect(
      isCaveBuildingReady(
        withCave({
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          readyAt: now,
        }),
        now,
      ),
    ).toBe(true);
  });

  it("is not ready without a Cave building", () => {
    expect(isCaveBuildingReady(withCave(), now)).toBe(false);
  });

  it("is not ready while the Cave is under construction", () => {
    expect(
      isCaveBuildingReady(
        withCave({
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          readyAt: now + 1,
        }),
        now,
      ),
    ).toBe(false);
  });

  it("is not ready while the Cave is in the chest", () => {
    expect(
      isCaveBuildingReady(withCave({ id: "1", createdAt: 0, readyAt: 0 }), now),
    ).toBe(false);
  });
});

describe("hasIdleCaveMachine", () => {
  const growing: CaveBatch = {
    recipe: "Mushroom",
    startedAt: 0,
    readyAt: now + 1,
  };
  const ready: CaveBatch = { ...growing, readyAt: now };
  const cleared: CaveBatch = {
    ...ready,
    dug: Object.fromEntries(
      Array.from({ length: CAVE_PATCH_WIDTH ** 2 }, (_, i) => [
        `${i % CAVE_PATCH_WIDTH},${Math.floor(i / CAVE_PATCH_WIDTH)}`,
        { dugAt: now, tile: { type: "Mud", amount: 1 } },
      ]),
    ),
  };
  const withMachines = (
    machines: Record<string, CaveMachine>,
  ): GameState["cave"] => ({ builtAt: 0, tier: 1, machines });

  it("is false without a Cave", () => {
    expect(hasIdleCaveMachine(undefined)).toBe(false);
  });

  it("is true when a Myco Bin has no batch", () => {
    expect(hasIdleCaveMachine(withMachines({ "1": {} }))).toBe(true);
  });

  it("is false while every Myco Bin is composting", () => {
    expect(hasIdleCaveMachine(withMachines({ "1": { batch: growing } }))).toBe(
      false,
    );
  });

  it("is false while a patch is ready but not yet dug out", () => {
    expect(hasIdleCaveMachine(withMachines({ "1": { batch: ready } }))).toBe(
      false,
    );
  });

  it("is true once a patch has been dug out and waits for a new mix", () => {
    expect(hasIdleCaveMachine(withMachines({ "1": { batch: cleared } }))).toBe(
      true,
    );
  });

  it("is true when any one of several Myco Bins is idle", () => {
    expect(
      hasIdleCaveMachine(
        withMachines({ "1": { batch: growing }, "2": { batch: cleared } }),
      ),
    ).toBe(true);
  });
});
