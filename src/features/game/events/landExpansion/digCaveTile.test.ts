import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveBatch,
  CaveRecipeName,
  GameState,
} from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  generateCavePatch,
  resolveCaveTile,
} from "features/game/types/cavePatch";
import { DIG_CAVE_TILE_ERRORS, digCaveTile } from "./digCaveTile";

// Inside the Ascension Age chapter, whose artefact is the Otter Pebble.
const NOW = new Date("2026-09-23T00:00:00.000Z").getTime();

// Seed 12345 on the Mushroom mix (golden board in cavePatch.test.ts):
//   y0 MDDDM
//   y1 DMDMM
//   y2 DDDDD
//   y3 DDDMu   (4,3) Blue Beetle
//   y4 DDDbX   (3,4) Brown Beetle, (4,4) Artefact
const SEED = 12345;

const readyState = ({
  batch = {},
  shovels = 10,
}: { batch?: Partial<CaveBatch>; shovels?: number } = {}): GameState => ({
  ...TEST_FARM,
  island: { ...TEST_FARM.island, type: "spring" },
  inventory: {
    ...TEST_FARM.inventory,
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

const dig = (
  state: GameState,
  x: number,
  y: number,
  {
    machineId = "1",
    createdAt = NOW,
  }: { machineId?: string; createdAt?: number } = {},
) =>
  digCaveTile({
    state,
    action: { type: "cave.dug", machineId, x, y },
    createdAt,
  });

describe("digCaveTile (cave.dug)", () => {
  it("spends one Sand Shovel per dig", () => {
    const next = dig(readyState({ shovels: 3 }), 1, 0);
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(2);
  });

  it("still spends a Sand Shovel with the Ancient Shovel equipped", () => {
    const state = readyState({ shovels: 3 });
    const next = dig(
      {
        ...state,
        bumpkin: {
          ...state.bumpkin,
          equipped: { ...state.bumpkin.equipped, tool: "Ancient Shovel" },
        },
      },
      1,
      0,
    );
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(2);
  });

  it("records only when the tile was dug", () => {
    const next = dig(readyState(), 1, 0);
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "1,0": { dugAt: NOW },
    });
  });

  it.each([
    [0, 0, "Wild Mushroom", 1],
    [4, 3, "Blue Beetle", 1],
    [3, 4, "Brown Beetle", 1],
    [1, 0, "Mud", 1],
    [4, 4, "Otter Pebble", 1],
  ] as const)("awards tile %s,%s: %s x%s", (x, y, item, amount) => {
    const next = dig(readyState(), x, y);
    expect(next.inventory[item]?.toNumber()).toBe(amount);
  });

  it("awards exactly what the board says for every tile", () => {
    const layout = generateCavePatch({ recipe: "Mushroom", seed: SEED });
    for (let x = 0; x < 5; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        const before = readyState();
        const next = dig(before, x, y);
        const { items } = resolveCaveTile(layout, x, y, NOW);
        for (const [name, amount] of Object.entries(items)) {
          const item = name as keyof GameState["inventory"];
          expect(next.inventory[item]?.toNumber()).toBe(
            (before.inventory[item]?.toNumber() ?? 0) + (amount ?? 0),
          );
        }
      }
    }
  });

  it("awards double Mud on a Mud mix patch", () => {
    const recipe: CaveRecipeName = "Mud";
    const layout = generateCavePatch({ recipe, seed: SEED });
    const mudKey = Object.keys(layout).find(
      (key) => layout[key].type === "Mud",
    )!;
    const [x, y] = mudKey.split(",").map(Number);
    const next = dig(readyState({ batch: { recipe } }), x, y);
    expect(next.inventory.Mud?.toNumber()).toBe(2);
  });

  it("awards the artefact of the chapter active at dig time", () => {
    const pawPrints = new Date("2025-12-10T00:00:00.000Z").getTime();
    const next = dig(readyState(), 4, 4, { createdAt: pawPrints });
    expect(next.inventory["Moon Crystal"]?.toNumber()).toBe(1);
    expect(next.inventory["Otter Pebble"]).toBeUndefined();
  });

  it("keeps a tile's clue after a neighbouring Beetle is dug", () => {
    const layout = generateCavePatch({ recipe: "Mushroom", seed: SEED });
    const clueBefore = resolveCaveTile(layout, 3, 3, NOW).clue;
    const afterBeetle = dig(readyState(), 3, 4);
    const next = dig(afterBeetle, 3, 3);
    expect(clueBefore).toBe(2);
    expect(next.cave?.machines["1"].batch?.seed).toBe(SEED);
    expect(resolveCaveTile(layout, 3, 3, NOW).clue).toBe(clueBefore);
  });

  it("rejects a tile that was already dug", () => {
    const once = dig(readyState(), 1, 0);
    expect(() => dig(once, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.ALREADY_DUG);
  });

  it("rejects without a Sand Shovel", () => {
    expect(() => dig(readyState({ shovels: 0 }), 1, 0)).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_SHOVEL,
    );
  });

  it("rejects before the batch is ready", () => {
    const state = readyState({ batch: { readyAt: NOW + 1 } });
    expect(() => dig(state, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NOT_READY);
  });

  it("rejects a batch without its seed", () => {
    const state = readyState({ batch: { seed: undefined } });
    expect(() => dig(state, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NO_SEED);
  });

  it.each([
    [5, 0],
    [0, 5],
    [-1, 0],
    [1.5, 0],
  ])("rejects the out-of-patch tile %s,%s", (x, y) => {
    expect(() => dig(readyState(), x, y)).toThrow(
      DIG_CAVE_TILE_ERRORS.INVALID_TILE,
    );
  });

  it("rejects a machine without a batch", () => {
    const state = readyState();
    expect(() =>
      dig({ ...state, cave: { ...state.cave!, machines: { "1": {} } } }, 1, 0),
    ).toThrow(DIG_CAVE_TILE_ERRORS.NO_BATCH);
  });

  it("rejects an unknown machine", () => {
    expect(() => dig(readyState(), 1, 0, { machineId: "9" })).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_MACHINE,
    );
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => dig({ ...readyState(), cave: undefined }, 1, 0)).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_CAVE,
    );
  });

  it("does not spend a shovel when rejected", () => {
    const once = dig(readyState({ shovels: 3 }), 1, 0);
    expect(() => dig(once, 1, 0)).toThrow();
    expect(once.inventory["Sand Shovel"]?.toNumber()).toBe(2);
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
      expect(() => dig(readyState(), 1, 0)).toThrow(
        DIG_CAVE_TILE_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is not unlocked by holding a Beta Pass", () => {
      const state = readyState();
      expect(() =>
        dig(
          {
            ...state,
            inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
          },
          1,
          0,
        ),
      ).toThrow(DIG_CAVE_TILE_ERRORS.NO_FEATURE_ACCESS);
    });
  });
});
