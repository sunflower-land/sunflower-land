import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { CaveBatch, GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  resolveCaveTile,
  revealCavePatch,
} from "features/game/types/cavePatch";
import {
  getCaveDrillSquare,
  isCave2x2Square,
} from "features/game/types/caveRecipes";
import { DRILL_CAVE_TILES_ERRORS, drillCaveTiles } from "./drillCaveTiles";
import type { Bud } from "features/game/types/buds";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

// The Cave building, placed and finished: every cave.* event requires it.
const READY_CAVE = {
  id: "cave",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
};

const NOW = new Date("2026-09-23T00:00:00.000Z").getTime();

// Each drill draws its own board from the seed and its `createdAt`, keyed on
// the square's top-left tile (revealCavePatch). On this seed and the Mushroom
// mix, the FIRST drill at NOW finds:
//   square (2,3): (2,3) Mud, (3,3) Mud, (2,4) Green Beetle, (3,4) Wild Mushroom
//   square (2,1): (2,1) Mud, (3,1) Mud, (2,2) Magic Mushroom, (3,2) Wild
// and square (2,3) at NOW + 32: (2,4) Pink Beetle, (3,4) Green Beetle, rest Mud.
const SEED = "00112233445566778899aabbccddeeff";

type Coords = { x: number; y: number }[];

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
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
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
    farmId = 1,
  }: { machineId?: string; createdAt?: number; farmId?: number } = {},
) =>
  drillCaveTiles({
    state,
    action: { type: "cave.drilled", machineId, coords },
    createdAt,
    farmId,
  });

/** The board a drill of the square at (x, y) draws for the state's batch. */
const boardFor = (state: GameState, x: number, y: number, createdAt = NOW) =>
  revealCavePatch({
    batch: state.cave!.machines["1"].batch!,
    createdAt,
    x,
    y,
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
  it("throws while the Cave building is under construction", () => {
    const state = readyState();

    expect(() =>
      drill({
        ...state,
        buildings: {
          ...state.buildings,
          Cave: [{ ...READY_CAVE, readyAt: Number.MAX_SAFE_INTEGER }],
        },
      }),
    ).toThrow(DRILL_CAVE_TILES_ERRORS.NO_CAVE);
  });

  it("spends one Sand Drill and no Sand Shovels", () => {
    const next = drill(readyState({ drills: 3, shovels: 5 }));
    expect(next.inventory["Sand Drill"]?.toNumber()).toBe(2);
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(5);
  });

  it("awards all four tiles of the square", () => {
    const next = drill(readyState());
    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1);
    expect(next.inventory["Green Beetle"]?.toNumber()).toBe(1);
    expect(next.inventory["Pink Beetle"]).toBeUndefined();
    expect(next.inventory.Mud?.toNumber()).toBe(2);
  });

  it("awards a drilled Magic Mushroom tile alongside Wild ones", () => {
    // (2,1) Mud, (3,1) Mud, (2,2) Magic, (3,2) Wild
    const next = drill(readyState(), getCaveDrillSquare(2, 1));
    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1);
    expect(next.inventory["Magic Mushroom"]?.toNumber()).toBe(1);
    expect(next.inventory.Mud?.toNumber()).toBe(2);
  });

  it("awards exactly what the drill's board says for every square", () => {
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        const before = readyState();
        const coords = getCaveDrillSquare(x, y);
        const layout = boardFor(before, x, y);
        const next = drill(before, coords);

        const expected: Partial<Record<keyof GameState["inventory"], number>> =
          {};
        for (const tile of coords) {
          const { items } = resolveCaveTile(layout, tile.x, tile.y);
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

  it("records all four tiles as dug, with what they held and showed", () => {
    const board = boardFor(readyState(), 2, 3);
    const next = drill(readyState());
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "2,3": { dugAt: NOW, tile: board["2,3"], clue: 2 },
      "3,3": { dugAt: NOW, tile: board["3,3"], clue: 1 },
      "2,4": { dugAt: NOW, tile: board["2,4"] },
      "3,4": { dugAt: NOW, tile: board["3,4"], clue: 2 },
    });
    expect(board["2,4"].type).toBe("Beetle");
  });

  it("draws the same board whichever order the square's coords are sent in", () => {
    const next = drill(readyState());
    const reversed = drill(readyState(), [...BEETLE_SQUARE].reverse());
    expect(reversed.cave?.machines["1"].batch?.dug).toEqual(
      next.cave?.machines["1"].batch?.dug,
    );
    expect(reversed.inventory).toEqual(next.inventory);
  });

  it("draws one board for the whole square, so its clues agree", () => {
    const next = drill(readyState());
    const dug = next.cave?.machines["1"].batch?.dug ?? {};
    // (2,3) borders (2,4) Beetle, (3,3) Mud and whatever (1,3) and (2,2) hold;
    // (3,3) borders (2,3) Mud, (3,4) Mushroom, (3,2) and (4,3).
    expect(dug["2,3"].clue).toBe(2);
    expect(dug["3,3"].clue).toBe(1);
    expect(dug["3,4"].clue).toBe(2);
    expect(dug["2,4"].clue).toBeUndefined();
    expect(next.cave?.machines["1"].batch?.seed).toBe(SEED);
  });

  it("skips tiles that were already dug and still spends the drill", () => {
    const state = readyState({
      drills: 3,
      batch: {
        dug: {
          "3,3": { dugAt: 1, tile: { type: "Mud", amount: 1 }, clue: 1 },
          "2,4": { dugAt: 1, tile: { type: "Mud", amount: 1 }, clue: 0 },
        },
      },
    });
    const board = boardFor(state, 2, 3);
    const next = drill(state);

    expect(next.inventory["Sand Drill"]?.toNumber()).toBe(2);
    expect(next.farmActivity["Cave Tile Dug"]).toBe(2);
    const expected = [
      resolveCaveTile(board, 2, 3),
      resolveCaveTile(board, 3, 4),
    ];
    for (const { items } of expected) {
      for (const [name, amount] of Object.entries(items)) {
        const item = name as keyof GameState["inventory"];
        expect(next.inventory[item]?.toNumber()).toBe(
          expected
            .map((tile) => tile.items[item] ?? 0)
            .reduce((sum, n) => sum + n, 0) || amount,
        );
      }
    }
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "3,3": { dugAt: 1, tile: { type: "Mud", amount: 1 }, clue: 1 },
      "2,4": { dugAt: 1, tile: { type: "Mud", amount: 1 }, clue: 0 },
      "2,3": {
        dugAt: NOW,
        tile: board["2,3"],
        ...(expected[0].clue === undefined ? {} : { clue: expected[0].clue }),
      },
      "3,4": {
        dugAt: NOW,
        tile: board["3,4"],
        ...(expected[1].clue === undefined ? {} : { clue: expected[1].clue }),
      },
    });
  });

  it("keeps the recorded tiles out of the drill's board", () => {
    // Records dug before boards were sampled are read from the seed's board.
    const state = readyState({
      batch: { dug: { "3,3": { dugAt: 1 }, "2,4": { dugAt: 1 } } },
    });
    const next = drill(state);
    const dug = next.cave?.machines["1"].batch?.dug ?? {};
    expect(dug["3,3"]).toEqual({ dugAt: 1 });
    expect(dug["2,4"]).toEqual({ dugAt: 1 });
    expect(dug["2,3"].tile).toBeDefined();
    expect(dug["3,4"].tile).toBeDefined();
    expect(next.farmActivity["Cave Tile Dug"]).toBe(2);
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

    it("is unlocked by holding a Beta Pass", () => {
      const state = readyState();
      expect(() =>
        drill({
          ...state,
          inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
        }),
      ).not.toThrow();
    });
  });
});

// A placed Bud with the Mushroom stem, whose only boost is +0.3 Wild Mushroom.
const mushroomBud = (overrides: Partial<Bud> = {}): Bud => ({
  type: "Plaza",
  colour: "Blue",
  ears: "No Ears",
  aura: "No Aura",
  stem: "Mushroom",
  coordinates: { x: 0, y: 0 },
  ...overrides,
});

describe("drillCaveTiles: Mushroom Bud", () => {
  it("awards a drilled Mushroom tile's Wild Mushrooms with the Bud bonus", () => {
    const next = drill({ ...readyState(), buds: { 1: mushroomBud() } });

    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1.3);
    expect(next.inventory.Mud?.toNumber()).toBe(2);
    expect(next.boostsUsedAt?.["Bud #1"]).toBe(NOW);
  });
});

describe("drillCaveTiles: Cave skills", () => {
  const FARM_ID = 7;

  const withSkills = (
    skills: GameState["bumpkin"]["skills"],
    state = readyState(),
  ): GameState => ({ ...state, bumpkin: { ...state.bumpkin, skills } });

  const withTilesDug = (state: GameState, count: number): GameState => ({
    ...state,
    farmActivity: { ...state.farmActivity, "Cave Tile Dug": count },
  });

  it("counts each tile the drill digs in the farm activity", () => {
    const next = drill(readyState());
    expect(next.farmActivity["Cave Tile Dug"]).toBe(4);
  });

  it("applies Muddy Bounty and Fungal Harvest to drilled tiles", () => {
    const next = drill(withSkills({ "Muddy Bounty": 3, "Fungal Harvest": 3 }));
    // (3,4) Mushroom; (2,3) and (3,3) Mud.
    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1.4);
    expect(next.inventory.Mud?.toNumber()).toBe(2.6);
  });

  it("Sturdy Drill keeps the Sand Drill exactly when its roll hits", () => {
    let hits = 0;
    for (let counter = 0; counter < 40; counter += 1) {
      const hit = prngChance({
        farmId: FARM_ID,
        itemId: KNOWN_IDS["Sand Drill"],
        counter,
        chance: 40,
        criticalHitName: "Sturdy Drill",
      });
      if (hit) hits += 1;

      const next = drill(
        withTilesDug(withSkills({ "Sturdy Drill": 3 }), counter),
        BEETLE_SQUARE,
        { farmId: FARM_ID },
      );
      expect(next.inventory["Sand Drill"]?.toNumber()).toBe(hit ? 10 : 9);
      expect(next.boostsUsedAt?.["Sturdy Drill"]).toBe(hit ? NOW : undefined);
    }
    expect(hits).toBeGreaterThan(0);
    expect(hits).toBeLessThan(40);
  });

  it("Twin Beetles rolls once for each drilled Beetle", () => {
    // At NOW + 32, BEETLE_SQUARE digs (2,3), (3,3), (2,4) Pink, (3,4) Green in
    // that order, so the two Beetles roll on the 3rd and 4th tile's counter.
    const roll = (beetle: "Green Beetle" | "Pink Beetle", counter: number) =>
      prngChance({
        farmId: FARM_ID,
        itemId: KNOWN_IDS[beetle],
        counter,
        chance: 15,
        criticalHitName: "Twin Beetles",
      });

    let hits = 0;
    for (let start = 0; start < 60; start += 1) {
      const pink = roll("Pink Beetle", start + 2);
      const green = roll("Green Beetle", start + 3);
      hits += Number(green) + Number(pink);

      const next = drill(
        withTilesDug(withSkills({ "Twin Beetles": 3 }), start),
        BEETLE_SQUARE,
        { farmId: FARM_ID, createdAt: NOW + 32 },
      );
      expect(next.inventory["Green Beetle"]?.toNumber()).toBe(green ? 2 : 1);
      expect(next.inventory["Pink Beetle"]?.toNumber()).toBe(pink ? 2 : 1);
    }
    expect(hits).toBeGreaterThan(0);
  });
});
