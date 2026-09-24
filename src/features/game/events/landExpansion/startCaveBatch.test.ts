import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { CaveDugTile, GameState } from "features/game/types/game";
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

/** A dug map covering the first `count` tiles of the 5x5 patch. */
const dugTiles = (count: number): Record<string, CaveDugTile> =>
  Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `${index % 5},${Math.floor(index / 5)}`,
      { dugAt: 1 },
    ]),
  );

const dugOutState = (count: number): GameState => ({
  ...caveState(),
  cave: {
    builtAt: 1,
    tier: 1,
    machines: {
      "1": {
        batch: {
          recipe: "Mud",
          startedAt: 0,
          readyAt: 1,
          dug: dugTiles(count),
        },
      },
    },
  },
});

/** A ready Mushroom batch on a known board with the given tiles dug. */
const beetleHuntState = (dugKeys: string[]): GameState => ({
  ...caveState(),
  cave: {
    builtAt: 1,
    tier: 1,
    machines: {
      "1": {
        batch: {
          recipe: "Mushroom",
          startedAt: 0,
          readyAt: 1,
          seed: "00112233445566778899aabbccddeeff",
          dug: Object.fromEntries(dugKeys.map((key) => [key, { dugAt: 2 }])),
        },
      },
    },
  },
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

  it("restarts a machine once every tile of its patch has been dug", () => {
    const now = 1_700_000_000_000;
    const next = start(dugOutState(25), "1", "Beetle", now);
    expect(next.cave?.machines["1"].batch).toEqual({
      recipe: "Beetle",
      startedAt: now,
      readyAt: now + CAVE_BATCH_DURATION_MS,
    });
  });

  it("restarts a patch once every Beetle is found, discarding the rest", () => {
    // Beetles at (3,3) and (3,4) on this seed's Mushroom board.
    const state = beetleHuntState(["3,3", "3,4"]);
    const next = start(state, "1", "Beetle");
    expect(next.cave?.machines["1"].batch?.recipe).toBe("Beetle");
    expect(next.cave?.machines["1"].batch?.dug).toBeUndefined();
  });

  it("rejects restarting while a Beetle is still buried", () => {
    expect(() => start(beetleHuntState(["3,3"]), "1", "Beetle")).toThrow(
      START_CAVE_BATCH_ERRORS.BATCH_IN_PROGRESS,
    );
  });

  it("rejects restarting a patch that still has undug tiles", () => {
    expect(() => start(dugOutState(24), "1", "Beetle")).toThrow(
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
