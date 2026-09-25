import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { CaveBatch, GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  generateCavePatch,
  resolveCaveTile,
} from "features/game/types/cavePatch";
import {
  getCaveDrillSquare,
  isCave2x2Square,
} from "features/game/types/caveRecipes";
import { DRILL_CAVE_TILES_ERRORS, drillCaveTiles } from "./drillCaveTiles";

// Inside the Ascension Age chapter, whose artefact is the Otter Pebble.
const NOW = new Date("2026-09-23T00:00:00.000Z").getTime();

// This seed on the Mushroom mix (golden board in cavePatch.test.ts):
//   y0 DMDMD
//   y1 MMMDD
//   y2 DDDDD
//   y3 DDMbD   (3,3) Brown Beetle
//   y4 DDDuX   (3,4) Blue Beetle, (4,4) Artefact
const SEED = "00112233445566778899aabbccddeeff";

type Coords = { x: number; y: number }[];

// (2,3) Mushroom, (3,3) Brown Beetle, (2,4) Mud, (3,4) Blue Beetle.
const BEETLE_SQUARE: Coords = [
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 4 },
];

const readyState = ({
  batch = {},
  drills = 10,
  shovels = 10,
}: {
  batch?: Partial<CaveBatch>;
  drills?: number;
  shovels?: number;
} = {}): GameState => ({
  ...TEST_FARM,
  island: { ...TEST_FARM.island, type: "spring" },
  inventory: {
    ...TEST_FARM.inventory,
    "Sand Drill": new Decimal(drills),
    "Sand Shovel": new Decimal(shovels),
  },
  cave: {
    builtAt: 1,
    tier: 1,
    machines: {
      "1": {
        batch: {
          recipe: "Mushroom",
          startedAt: 0,
          readyAt: 1,
          seed: SEED,
          ...batch,
        },
      },
    },
  },
});

const drill = (
  state: GameState,
  coords: Coords = BEETLE_SQUARE,
  {
    machineId = "1",
    createdAt = NOW,
  }: { machineId?: string; createdAt?: number } = {},
) =>
  drillCaveTiles({
    state,
    action: { type: "cave.drilled", machineId, coords },
    createdAt,
  });

describe("isCave2x2Square", () => {
  it("accepts a 2x2 square in any order", () => {
    expect(
      isCave2x2Square([
        { x: 1, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ]),
    ).toBe(true);
  });

  it.each<[string, Coords]>([
    [
      "a line",
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
    ],
    [
      "a gap",
      [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 2, y: 1 },
      ],
    ],
    [
      "duplicated corners",
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
    ],
    [
      "three tiles",
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
  ])("rejects %s", (_, coords) => {
    expect(isCave2x2Square(coords)).toBe(false);
  });
});

describe("getCaveDrillSquare", () => {
  it("anchors the square on the tile's top-left", () => {
    expect(getCaveDrillSquare(1, 2)).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ]);
  });

  it("keeps the square inside the patch at the edges", () => {
    expect(getCaveDrillSquare(4, 4)).toEqual([
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ]);
  });
});

describe("drillCaveTiles (cave.drilled)", () => {
  it("spends one Sand Drill and no Sand Shovels", () => {
    const next = drill(readyState({ drills: 3, shovels: 5 }));
    expect(next.inventory["Sand Drill"]?.toNumber()).toBe(2);
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(5);
  });

  it("awards all four tiles of the square", () => {
    const next = drill(readyState());
    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1);
    expect(next.inventory["Brown Beetle"]?.toNumber()).toBe(1);
    expect(next.inventory["Blue Beetle"]?.toNumber()).toBe(1);
    expect(next.inventory.Mud?.toNumber()).toBe(1);
  });

  it("awards exactly what the board says for every square", () => {
    const layout = generateCavePatch({ recipe: "Mushroom", seed: SEED });
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        const before = readyState();
        const coords = getCaveDrillSquare(x, y);
        const next = drill(before, coords);

        const expected: Partial<Record<keyof GameState["inventory"], number>> =
          {};
        for (const tile of coords) {
          const { items } = resolveCaveTile(layout, tile.x, tile.y, NOW);
          for (const [name, amount] of Object.entries(items)) {
            const item = name as keyof GameState["inventory"];
            expected[item] = (expected[item] ?? 0) + (amount ?? 0);
          }
        }

        for (const [name, amount] of Object.entries(expected)) {
          const item = name as keyof GameState["inventory"];
          expect(next.inventory[item]?.toNumber()).toBe(
            (before.inventory[item]?.toNumber() ?? 0) + (amount ?? 0),
          );
        }
      }
    }
  });

  it("awards the artefact of the chapter active at dig time", () => {
    const pawPrints = new Date("2025-12-10T00:00:00.000Z").getTime();
    const next = drill(readyState(), getCaveDrillSquare(3, 3), {
      createdAt: pawPrints,
    });
    expect(next.inventory["Moon Crystal"]?.toNumber()).toBe(1);
    expect(next.inventory["Otter Pebble"]).toBeUndefined();
  });

  it("records all four tiles as dug", () => {
    const next = drill(readyState());
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "2,3": { dugAt: NOW },
      "3,3": { dugAt: NOW },
      "2,4": { dugAt: NOW },
      "3,4": { dugAt: NOW },
    });
  });

  it("keeps the clues of the drilled tiles", () => {
    const layout = generateCavePatch({ recipe: "Mushroom", seed: SEED });
    const next = drill(readyState());
    expect(next.cave?.machines["1"].batch?.seed).toBe(SEED);
    expect(resolveCaveTile(layout, 2, 3, NOW).clue).toBe(1);
    expect(resolveCaveTile(layout, 2, 4, NOW).clue).toBe(1);
  });

  it("skips tiles that were already dug and still spends the drill", () => {
    const state = readyState({
      drills: 3,
      batch: { dug: { "3,3": { dugAt: 1 }, "2,4": { dugAt: 1 } } },
    });
    const next = drill(state);

    expect(next.inventory["Sand Drill"]?.toNumber()).toBe(2);
    expect(next.inventory["Brown Beetle"]).toBeUndefined();
    expect(next.inventory.Mud).toBeUndefined();
    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1);
    expect(next.inventory["Blue Beetle"]?.toNumber()).toBe(1);
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "3,3": { dugAt: 1 },
      "2,4": { dugAt: 1 },
      "2,3": { dugAt: NOW },
      "3,4": { dugAt: NOW },
    });
  });

  it("rejects a square whose tiles were all dug", () => {
    const once = drill(readyState());
    expect(() => drill(once)).toThrow(DRILL_CAVE_TILES_ERRORS.ALREADY_DUG);
  });

  it("rejects coords that are not a 2x2 square", () => {
    expect(() =>
      drill(readyState(), [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ]),
    ).toThrow(DRILL_CAVE_TILES_ERRORS.NOT_A_SQUARE);
  });

  it("rejects duplicated coords", () => {
    expect(() =>
      drill(readyState(), [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ]),
    ).toThrow(DRILL_CAVE_TILES_ERRORS.NOT_A_SQUARE);
  });

  it("rejects fewer than four coords", () => {
    expect(() => drill(readyState(), BEETLE_SQUARE.slice(0, 3))).toThrow(
      DRILL_CAVE_TILES_ERRORS.NOT_A_SQUARE,
    );
  });

  it.each<[string, Coords]>([
    [
      "past the right edge",
      [
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 4, y: 1 },
        { x: 5, y: 1 },
      ],
    ],
    [
      "past the bottom edge",
      [
        { x: 0, y: 4 },
        { x: 1, y: 4 },
        { x: 0, y: 5 },
        { x: 1, y: 5 },
      ],
    ],
    [
      "past the top-left corner",
      [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
      ],
    ],
  ])("rejects a square %s of the patch", (_, coords) => {
    expect(() => drill(readyState(), coords)).toThrow(
      DRILL_CAVE_TILES_ERRORS.INVALID_TILE,
    );
  });

  it("rejects without a Sand Drill, even holding Sand Shovels", () => {
    expect(() => drill(readyState({ drills: 0, shovels: 10 }))).toThrow(
      DRILL_CAVE_TILES_ERRORS.NO_DRILL,
    );
  });

  it("rejects before the batch is ready", () => {
    const state = readyState({ batch: { readyAt: NOW + 1 } });
    expect(() => drill(state)).toThrow(DRILL_CAVE_TILES_ERRORS.NOT_READY);
  });

  it("rejects a batch without its seed", () => {
    const state = readyState({ batch: { seed: undefined } });
    expect(() => drill(state)).toThrow(DRILL_CAVE_TILES_ERRORS.NO_SEED);
  });

  it("rejects a batch whose seed is not a 128-bit hex seed", () => {
    const state = readyState({
      batch: { seed: 12345 as unknown as string },
    });
    expect(() => drill(state)).toThrow(DRILL_CAVE_TILES_ERRORS.NO_SEED);
  });

  it("rejects a machine without a batch", () => {
    const state = readyState();
    expect(() =>
      drill({ ...state, cave: { ...state.cave!, machines: { "1": {} } } }),
    ).toThrow(DRILL_CAVE_TILES_ERRORS.NO_BATCH);
  });

  it("rejects an unknown machine", () => {
    expect(() =>
      drill(readyState(), BEETLE_SQUARE, { machineId: "9" }),
    ).toThrow(DRILL_CAVE_TILES_ERRORS.NO_MACHINE);
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => drill({ ...readyState(), cave: undefined })).toThrow(
      DRILL_CAVE_TILES_ERRORS.NO_CAVE,
    );
  });

  it("does not spend a drill when rejected", () => {
    const once = drill(readyState({ drills: 3 }));
    expect(() => drill(once)).toThrow();
    expect(once.inventory["Sand Drill"]?.toNumber()).toBe(2);
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the CAVE feature flag", () => {
      expect(() => drill(readyState())).toThrow(
        DRILL_CAVE_TILES_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is not unlocked by holding a Beta Pass", () => {
      const state = readyState();
      expect(() =>
        drill({
          ...state,
          inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
        }),
      ).toThrow(DRILL_CAVE_TILES_ERRORS.NO_FEATURE_ACCESS);
    });
  });
});
