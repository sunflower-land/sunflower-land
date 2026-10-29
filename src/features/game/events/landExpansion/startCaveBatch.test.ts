import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { CaveDugTile, GameState } from "features/game/types/game";
import {
  CAVE_BATCH_DURATION_MS,
  CAVE_MUD_CROPS,
} from "features/game/types/caveRecipes";
import { getKeys } from "lib/object";
import { getCavePatchComposition } from "features/game/types/cavePatch";
import {
  START_CAVE_BATCH_ERRORS,
  type StartCaveBatchAction,
  startCaveBatch,
} from "./startCaveBatch";

// The Cave building, placed and finished: every cave.* event requires it.
const READY_CAVE = {
  id: "cave",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
};

// A farm that has never started a Myco Bin batch.
const newCaveState = (): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  island: { ...TEST_FARM.island, type: "spring" },
  inventory: {
    ...TEST_FARM.inventory,
    Carrot: new Decimal(100),
    Egg: new Decimal(100),
    Wood: new Decimal(100),
    Sunflower: new Decimal(1000),
    Potato: new Decimal(100),
    Rice: new Decimal(10),
  },
  cave: { builtAt: 1, tier: 1, machines: { "1": {} } },
});

// A farm that has dug in the Cave before, so its batches are past the first.
const caveState = (): GameState => ({
  ...newCaveState(),
  farmActivity: { ...TEST_FARM.farmActivity, "Cave Tile Dug": 1 },
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

const startMud = (state: GameState, crop?: string) =>
  startCaveBatch({
    state,
    action: {
      type: "cave.batchStarted",
      machineId: "1",
      recipe: "Mud",
      crop,
    } as StartCaveBatchAction,
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
  it("throws while the Cave building is under construction", () => {
    const state = caveState();

    expect(() =>
      start({
        ...state,
        buildings: {
          ...state.buildings,
          Cave: [{ ...READY_CAVE, readyAt: Number.MAX_SAFE_INTEGER }],
        },
      }),
    ).toThrow(START_CAVE_BATCH_ERRORS.NO_CAVE);
  });

  it("charges 10 Wood for a Mushroom batch", () => {
    const next = start(caveState(), "1", "Mushroom");
    expect(next.inventory.Wood?.toNumber()).toBe(90);
    expect(next.inventory.Carrot?.toNumber()).toBe(100);
  });

  it("charges 30 Eggs for a Beetle batch", () => {
    const next = start(caveState(), "1", "Beetle");
    expect(next.inventory.Egg?.toNumber()).toBe(70);
  });

  it.each([
    ["Sunflower", 500],
    ["Potato", 80],
    ["Carrot", 10],
    ["Rice", 1],
  ])("charges %s x%i for a Mud batch, and nothing else", (crop, amount) => {
    const before = caveState();
    const next = startMud(before, crop);
    const name = crop as keyof GameState["inventory"];
    expect(next.inventory[name]?.toNumber()).toBe(
      before.inventory[name]!.toNumber() - amount,
    );
    expect(next.inventory.Wood?.toNumber()).toBe(100);
    expect(next.cave?.machines["1"].batch?.recipe).toBe("Mud");
  });

  it("charges every table crop its listed amount on a Mud batch", () => {
    for (const crop of getKeys(CAVE_MUD_CROPS)) {
      const state: GameState = {
        ...caveState(),
        inventory: { [crop]: new Decimal(CAVE_MUD_CROPS[crop]) },
      };
      expect(startMud(state, crop).inventory[crop]?.toNumber()).toBe(0);
    }
  });

  it("lists the 25 crops of the equivalency table", () => {
    expect(getKeys(CAVE_MUD_CROPS)).toHaveLength(25);
  });

  it("rejects a Mud batch without a crop", () => {
    expect(() => startMud(caveState())).toThrow(
      START_CAVE_BATCH_ERRORS.INVALID_CROP,
    );
  });

  it.each(["Grape", "Wood", "Wild Mushroom", "constructor", "toString"])(
    "rejects %s as a Mud batch crop",
    (crop) => {
      const state: GameState = {
        ...caveState(),
        inventory: { ...caveState().inventory, Grape: new Decimal(100) },
      };
      expect(() => startMud(state, crop)).toThrow(
        START_CAVE_BATCH_ERRORS.INVALID_CROP,
      );
    },
  );

  it.each(["Mushroom", "Beetle"] as const)(
    "rejects a crop on a %s batch",
    (recipe) => {
      expect(() =>
        startCaveBatch({
          state: caveState(),
          action: {
            type: "cave.batchStarted",
            machineId: "1",
            recipe,
            crop: "Carrot",
          } as StartCaveBatchAction,
        }),
      ).toThrow(START_CAVE_BATCH_ERRORS.INVALID_CROP);
    },
  );

  it("rejects a Mud batch without enough of the chosen crop", () => {
    const state: GameState = {
      ...caveState(),
      inventory: { ...caveState().inventory, Sunflower: new Decimal(499) },
    };
    expect(() => startMud(state, "Sunflower")).toThrow(
      START_CAVE_BATCH_ERRORS.INSUFFICIENT_INGREDIENTS,
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
        inventory: { ...caveState().inventory, Wood: new Decimal(0) },
      }),
    ).toThrow(START_CAVE_BATCH_ERRORS.INSUFFICIENT_INGREDIENTS);
  });

  it("does not consume ingredients when rejected", () => {
    const before = {
      ...caveState(),
      inventory: { ...caveState().inventory, Wood: new Decimal(0) },
    };
    expect(() => start(before)).toThrow();
    expect(before.inventory.Wood?.toNumber()).toBe(0);
    expect(before.cave?.machines["1"].batch).toBeUndefined();
  });
});

describe("startCaveBatch: Cave skills", () => {
  const NOW = new Date("2026-10-15T00:00:00.000Z").getTime();

  const skilled = (
    skills: GameState["bumpkin"]["skills"],
    inventory: GameState["inventory"] = {},
  ): GameState => {
    const state = caveState();
    return {
      ...state,
      bumpkin: { ...state.bumpkin, skills },
      inventory: { ...state.inventory, ...inventory },
    };
  };

  const batchOf = (state: GameState) => state.cave?.machines["1"].batch;

  it.each([
    [1, 9.5],
    [2, 9],
    [3, 8.5],
  ])(
    "Lean Compost rank %s charges %s Wood for a Mushroom batch",
    (rank, wood) => {
      const next = start(
        skilled({ "Lean Compost": rank }),
        "1",
        "Mushroom",
        NOW,
      );
      expect(next.inventory.Wood?.toNumber()).toBe(100 - wood);
    },
  );

  it.each([
    [1, 475],
    [2, 450],
    [3, 425],
  ])(
    "Lean Compost rank %s charges %s Sunflowers for a Mud batch",
    (rank, n) => {
      const next = startMud(skilled({ "Lean Compost": rank }), "Sunflower");
      expect(next.inventory.Sunflower?.toNumber()).toBe(1000 - n);
    },
  );

  it("Lean Compost lets a batch start with only the reduced ingredients", () => {
    const state = skilled({ "Lean Compost": 3 }, { Wood: new Decimal(8.5) });
    const next = start(state, "1", "Mushroom", NOW);
    expect(next.inventory.Wood?.toNumber()).toBe(0);
  });

  it.each([
    [1, 684],
    [2, 648],
    [3, 612],
  ])("Rapid Mycelium rank %s grows a batch in %s minutes", (rank, minutes) => {
    const next = start(skilled({ "Rapid Mycelium": rank }), "1", "Beetle", NOW);
    expect(batchOf(next)?.readyAt).toBe(NOW + minutes * 60 * 1000);
  });

  it("snapshots the board-shaping skills onto the batch", () => {
    const next = start(
      skilled({ "Mushroom Bloom": 2, "Beetle Nest": 3, "Rare Breeds": 1 }),
      "1",
      "Mushroom",
      NOW,
    );
    expect(batchOf(next)?.skills).toEqual({
      extraMushroomTiles: 2,
      extraBeetleTiles: 3,
      beetleRarity: {
        "Green Beetle": 35,
        "Blue Beetle": 35,
        "Pink Beetle": 15,
        "Amber Beetle": 15,
      },
    });
  });

  it("snapshots only the board-shaping skills the player has", () => {
    const next = start(skilled({ "Beetle Nest": 1 }), "1", "Mushroom", NOW);
    expect(batchOf(next)?.skills).toEqual({ extraBeetleTiles: 1 });
  });

  it("stores no skills on a batch started without any", () => {
    const next = start(skilled({ "Lean Compost": 1 }), "1", "Mushroom", NOW);
    expect(batchOf(next)).not.toHaveProperty("skills");
  });

  it("records the Cave skills used to start a batch", () => {
    const next = start(
      skilled({
        "Lean Compost": 1,
        "Rapid Mycelium": 1,
        "Mushroom Bloom": 1,
        "Beetle Nest": 1,
        "Rare Breeds": 1,
      }),
      "1",
      "Mushroom",
      NOW,
    );
    expect(next.boostsUsedAt).toMatchObject({
      "Lean Compost": NOW,
      "Rapid Mycelium": NOW,
      "Mushroom Bloom": NOW,
      "Beetle Nest": NOW,
      "Rare Breeds": NOW,
    });
  });

  it("keeps every patch at 25 tiles with at least one Mud at max ranks", () => {
    const next = start(
      skilled({ "Mushroom Bloom": 3, "Beetle Nest": 3 }),
      "1",
      "Mushroom",
      NOW,
    );
    for (const recipe of ["Mushroom", "Beetle", "Mud"] as const) {
      const composition = getCavePatchComposition(
        recipe,
        batchOf(next)?.skills,
      );
      expect(Object.values(composition).reduce((a, b) => a + b, 0)).toBe(25);
      expect(composition.Mud).toBeGreaterThan(0);
    }
  });
});

describe("startCaveBatch: first batch", () => {
  const NOW = new Date("2026-10-20T00:00:00.000Z").getTime();

  it("grows a farm's first batch in 10 minutes", () => {
    const next = start(newCaveState(), "1", "Mushroom", NOW);
    expect(next.cave?.machines["1"].batch?.readyAt).toBe(NOW + 10 * 60 * 1000);
  });

  it("rejects a Beetle first batch", () => {
    expect(() => start(newCaveState(), "1", "Beetle", NOW)).toThrow(
      START_CAVE_BATCH_ERRORS.FIRST_BATCH_MUSHROOM_ONLY,
    );
  });

  it("rejects a Mud first batch", () => {
    expect(() => startMud(newCaveState(), "Carrot")).toThrow(
      START_CAVE_BATCH_ERRORS.FIRST_BATCH_MUSHROOM_ONLY,
    );
  });

  it("ignores Rapid Mycelium on the first batch", () => {
    const state = newCaveState();
    const next = start(
      {
        ...state,
        bumpkin: { ...state.bumpkin, skills: { "Rapid Mycelium": 3 } },
      },
      "1",
      "Mushroom",
      NOW,
    );
    expect(next.cave?.machines["1"].batch?.readyAt).toBe(NOW + 10 * 60 * 1000);
    expect(next.boostsUsedAt?.["Rapid Mycelium"]).toBeUndefined();
  });

  it("still stamps the board-shaping skills onto the first batch", () => {
    const state = newCaveState();
    const next = start(
      {
        ...state,
        bumpkin: {
          ...state.bumpkin,
          skills: { "Mushroom Bloom": 2, "Beetle Nest": 3, "Rare Breeds": 1 },
        },
      },
      "1",
      "Mushroom",
      NOW,
    );
    expect(next.cave?.machines["1"].batch?.skills).toEqual({
      extraMushroomTiles: 2,
      extraBeetleTiles: 3,
      beetleRarity: {
        "Green Beetle": 35,
        "Blue Beetle": 35,
        "Pink Beetle": 15,
        "Amber Beetle": 15,
      },
    });
  });

  it("grows 12h once another Myco Bin has a batch, even before any dig", () => {
    const state = newCaveState();
    const next = start(
      {
        ...state,
        cave: {
          builtAt: 1,
          tier: 2,
          machines: {
            "1": {
              batch: { recipe: "Mushroom", startedAt: NOW, readyAt: NOW + 1 },
            },
            "2": {},
          },
        },
      },
      "2",
      "Beetle",
      NOW,
    );
    expect(next.cave?.machines["2"].batch?.readyAt).toBe(
      NOW + 12 * 60 * 60 * 1000,
    );
  });

  it("grows 12h once the farm has dug in the Cave", () => {
    const next = start(caveState(), "1", "Beetle", NOW);
    expect(next.cave?.machines["1"].batch?.readyAt).toBe(
      NOW + 12 * 60 * 60 * 1000,
    );
  });
});
