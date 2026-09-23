import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  CAVE_BATCH_DURATION_MS,
  CAVE_RECIPES,
} from "features/game/types/caveRecipes";
import { START_CAVE_BATCH_ERRORS, startCaveBatch } from "./startCaveBatch";

const caveState = (): GameState => ({
  ...TEST_FARM,
  island: { ...TEST_FARM.island, type: "spring" },
  inventory: {
    ...TEST_FARM.inventory,
    Carrot: new Decimal(100),
    Egg: new Decimal(100),
    Wood: new Decimal(100),
  },
  cave: { builtAt: 1, tier: 1, machines: { "1": {} } },
});

const start = (
  state: GameState,
  machineId = "1",
  recipe: "Mushroom" | "Beetle" | "Mud" = "Mushroom",
  createdAt = Date.now(),
) =>
  startCaveBatch({
    state,
    action: { type: "cave.batchStarted", machineId, recipe },
    createdAt,
  });

describe("startCaveBatch (cave.batchStarted)", () => {
  it("consumes the recipe ingredients", () => {
    const before = caveState();
    const next = start(before, "1", "Mushroom");
    const cost = CAVE_RECIPES.Mushroom.ingredients.Carrot!;
    expect(next.inventory.Carrot?.toNumber()).toBe(
      before.inventory.Carrot!.minus(cost).toNumber(),
    );
  });

  it("sets a 12h timer with only public fields (no hidden layout)", () => {
    const now = 1_700_000_000_000;
    const next = start(caveState(), "1", "Beetle", now);
    expect(next.cave?.machines["1"].batch).toEqual({
      recipe: "Beetle",
      startedAt: now,
      readyAt: now + CAVE_BATCH_DURATION_MS,
    });
  });

  it("rejects an unknown machine", () => {
    expect(() => start(caveState(), "9")).toThrow(
      START_CAVE_BATCH_ERRORS.NO_MACHINE,
    );
  });

  it("rejects a machine that already has a batch", () => {
    const once = start(caveState(), "1", "Mushroom");
    expect(() => start(once, "1", "Mushroom")).toThrow(
      START_CAVE_BATCH_ERRORS.BATCH_IN_PROGRESS,
    );
  });

  it("rejects when the player lacks the ingredients", () => {
    expect(() =>
      start({
        ...caveState(),
        inventory: { ...caveState().inventory, Carrot: new Decimal(0) },
      }),
    ).toThrow(START_CAVE_BATCH_ERRORS.INSUFFICIENT_INGREDIENTS);
  });

  it("does not consume ingredients when rejected", () => {
    const before = {
      ...caveState(),
      inventory: { ...caveState().inventory, Carrot: new Decimal(0) },
    };
    expect(() => start(before)).toThrow();
    expect(before.inventory.Carrot?.toNumber()).toBe(0);
    expect(before.cave?.machines["1"].batch).toBeUndefined();
  });
});
