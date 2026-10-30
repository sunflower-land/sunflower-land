import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveBatch,
  CaveDugTile,
  GameState,
} from "features/game/types/game";
import {
  generateCavePatch,
  getCaveTileClue,
} from "features/game/types/cavePatch";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import {
  DIG_ALL_CAVE_TILES_ERRORS,
  digAllCaveTiles,
  getUndugCaveTileCoords,
} from "./digAllCaveTiles";
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
const SEED = "00112233445566778899aabbccddeeff";

const BOARD = generateCavePatch({ recipe: "Mushroom", seed: SEED });

/** Records for the seed's board, as if `keys` had been dug one by one. */
const recordsFor = (keys: string[]): Record<string, CaveDugTile> =>
  Object.fromEntries(
    keys.map((key) => {
      const [x, y] = key.split(",").map(Number);
      const tile = BOARD[key];
      return [
        key,
        tile.type === "Beetle"
          ? { dugAt: 1, tile }
          : { dugAt: 1, tile, clue: getCaveTileClue(BOARD, x, y) },
      ];
    }),
  );

const keysOf = (type: string) =>
  Object.keys(BOARD).filter((key) => BOARD[key].type === type);

// Every Mushroom and Beetle dug: 6 + 2 on the Mushroom mix, 17 Mud left.
const ALL_FOUND = recordsFor([...keysOf("Mushroom"), ...keysOf("Beetle")]);
const MUD_LEFT = 17;

const readyState = ({
  batch = {},
  shovels = 20,
}: {
  batch?: Partial<CaveBatch>;
  shovels?: number;
} = {}): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
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
          dug: ALL_FOUND,
          ...batch,
        },
      },
    },
  },
});

const digAll = (
  state: GameState,
  {
    machineId = "1",
    createdAt = NOW,
    farmId = 1,
  }: { machineId?: string; createdAt?: number; farmId?: number } = {},
) =>
  digAllCaveTiles({
    state,
    action: { type: "cave.dugAll", machineId },
    createdAt,
    farmId,
  });

describe("getUndugCaveTileCoords", () => {
  it("lists every tile of an undug patch in row order", () => {
    const coords = getUndugCaveTileCoords();
    expect(coords).toHaveLength(25);
    expect(coords[0]).toEqual({ x: 0, y: 0 });
    expect(coords[5]).toEqual({ x: 0, y: 1 });
  });

  it("skips dug tiles", () => {
    expect(getUndugCaveTileCoords(ALL_FOUND)).toHaveLength(MUD_LEFT);
  });
});

describe("digAllCaveTiles", () => {
  it("digs every remaining tile as Mud, one Sand Shovel each", () => {
    const state = readyState();
    const next = digAll(state);
    const batch = next.cave!.machines["1"].batch!;

    expect(isCavePatchCleared(batch)).toBe(true);
    expect(next.inventory["Sand Shovel"]).toEqual(new Decimal(20 - MUD_LEFT));
    expect(next.inventory.Mud).toEqual(
      (state.inventory.Mud ?? new Decimal(0)).add(MUD_LEFT),
    );
    expect(next.farmActivity["Cave Tile Dug"]).toBe(MUD_LEFT);
  });

  it("records each tile as the Mud and clue the board holds", () => {
    const next = digAll(readyState());
    const dug = next.cave!.machines["1"].batch!.dug!;

    for (const key of keysOf("Mud")) {
      const [x, y] = key.split(",").map(Number);
      expect(dug[key]).toEqual({
        dugAt: NOW,
        tile: { type: "Mud", amount: 1 },
        clue: getCaveTileClue(BOARD, x, y),
      });
    }
    // Tiles dug before are left as they were.
    for (const key of Object.keys(ALL_FOUND)) {
      expect(dug[key]).toEqual(ALL_FOUND[key]);
    }
  });

  it("digs only what is left when some Mud was dug already", () => {
    const mud = keysOf("Mud").slice(0, 5);
    const next = digAll(
      readyState({
        batch: { dug: { ...ALL_FOUND, ...recordsFor(mud) } },
      }),
    );

    expect(next.inventory["Sand Shovel"]).toEqual(
      new Decimal(20 - (MUD_LEFT - 5)),
    );
    expect(next.farmActivity["Cave Tile Dug"]).toBe(MUD_LEFT - 5);
  });

  it("throws while a Beetle is still buried", () => {
    const [beetle] = keysOf("Beetle");
    const dug = { ...ALL_FOUND };
    delete dug[beetle];

    expect(() => digAll(readyState({ batch: { dug } }))).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NOT_ALL_FOUND,
    );
  });

  it("throws while a Mushroom is still buried", () => {
    const [mushroom] = keysOf("Mushroom");
    const dug = { ...ALL_FOUND };
    delete dug[mushroom];

    expect(() => digAll(readyState({ batch: { dug } }))).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NOT_ALL_FOUND,
    );
  });

  it("throws on an undug patch", () => {
    expect(() => digAll(readyState({ batch: { dug: undefined } }))).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NOT_ALL_FOUND,
    );
  });

  it("throws without a Sand Shovel for every tile left", () => {
    expect(() => digAll(readyState({ shovels: MUD_LEFT - 1 }))).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NO_SHOVEL,
    );
  });

  it("throws once every tile is dug", () => {
    const cleared = digAll(readyState());
    expect(() => digAll(cleared)).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.ALREADY_DUG,
    );
  });

  it("throws while the batch is growing", () => {
    expect(() => digAll(readyState({ batch: { readyAt: NOW + 1 } }))).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NOT_READY,
    );
  });

  it("throws without a seed", () => {
    expect(() => digAll(readyState({ batch: { seed: undefined } }))).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NO_SEED,
    );
  });

  it("throws for a missing Myco Bin", () => {
    expect(() => digAll(readyState(), { machineId: "9" })).toThrow(
      DIG_ALL_CAVE_TILES_ERRORS.NO_MACHINE,
    );
  });

  it("throws without a batch", () => {
    const state = readyState();
    expect(() =>
      digAll({
        ...state,
        cave: { ...state.cave!, machines: { "1": {} } },
      }),
    ).toThrow(DIG_ALL_CAVE_TILES_ERRORS.NO_BATCH);
  });

  it("throws before the Cave is built", () => {
    expect(() =>
      digAll({ ...readyState(), buildings: { ...TEST_FARM.buildings } }),
    ).toThrow(DIG_ALL_CAVE_TILES_ERRORS.NO_CAVE);
  });
});

describe("digAllCaveTiles: Cave skills", () => {
  const FARM_ID = 7;

  const withSkills = (
    skills: GameState["bumpkin"]["skills"],
    state = readyState(),
  ): GameState => ({ ...state, bumpkin: { ...state.bumpkin, skills } });

  it("applies Muddy Bounty to every tile", () => {
    const state = withSkills({ "Muddy Bounty": 3 });
    const next = digAll(state);
    expect(next.inventory.Mud).toEqual(
      (state.inventory.Mud ?? new Decimal(0)).add(1.3 * MUD_LEFT),
    );
    expect(next.boostsUsedAt?.["Muddy Bounty"]).toBe(NOW);
  });

  it("rolls Sturdy Shovel once per tile, on the tiles dug before it", () => {
    let kept = 0;
    for (let counter = 0; counter < MUD_LEFT; counter += 1) {
      if (
        prngChance({
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Sand Shovel"],
          counter,
          chance: 30,
          criticalHitName: "Sturdy Shovel",
        })
      ) {
        kept += 1;
      }
    }

    const next = digAll(withSkills({ "Sturdy Shovel": 3 }), {
      farmId: FARM_ID,
    });
    expect(kept).toBeGreaterThan(0);
    expect(next.inventory["Sand Shovel"]).toEqual(
      new Decimal(20 - MUD_LEFT + kept),
    );
    expect(next.boostsUsedAt?.["Sturdy Shovel"]).toBe(NOW);
  });

  it("still needs a Sand Shovel for every tile with Sturdy Shovel", () => {
    expect(() =>
      digAll(
        withSkills(
          { "Sturdy Shovel": 3 },
          readyState({ shovels: MUD_LEFT - 1 }),
        ),
      ),
    ).toThrow(DIG_ALL_CAVE_TILES_ERRORS.NO_SHOVEL);
  });
});
