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
  type CavePatchLayout,
} from "features/game/types/cavePatch";
import { getCaveDigAllGems } from "features/game/lib/cave";
import { BEETLES } from "features/game/types/beetles";
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

// Every Mushroom and Beetle dug: 6 + 2 on the Mushroom mix, 17 Mud left
// (free: Mud costs no Gems).
const ALL_FOUND = recordsFor([...keysOf("Mushroom"), ...keysOf("Beetle")]);
const MUD_LEFT = 17;

const TODAY = new Date(NOW).toISOString().substring(0, 10);

const readyState = ({
  batch = {},
  shovels = 30,
  gems = 1000,
  gemsSpentToday,
}: {
  batch?: Partial<CaveBatch>;
  shovels?: number;
  gems?: number;
  gemsSpentToday?: number;
} = {}): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  island: { ...TEST_FARM.island, type: "spring" },
  inventory: {
    ...TEST_FARM.inventory,
    "Sand Shovel": new Decimal(shovels),
    Gem: new Decimal(gems),
  },
  gems:
    gemsSpentToday === undefined
      ? {}
      : { history: { [TODAY]: { spent: gemsSpentToday } } },
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

/** How many of `items` the dig added to the inventory. */
const gained = (before: GameState, after: GameState, items: string[]) =>
  items.reduce(
    (total, item) =>
      total +
      (after.inventory[item as keyof GameState["inventory"]]?.toNumber() ?? 0) -
      (before.inventory[item as keyof GameState["inventory"]]?.toNumber() ?? 0),
    0,
  );

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
    expect(next.inventory["Sand Shovel"]).toEqual(new Decimal(30 - MUD_LEFT));
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
      new Decimal(30 - (MUD_LEFT - 5)),
    );
    expect(next.farmActivity["Cave Tile Dug"]).toBe(MUD_LEFT - 5);
  });

  it("digs only Mud for free, recording no Gems spent", () => {
    const next = digAll(readyState());

    expect(next.inventory.Gem).toEqual(new Decimal(1000));
    expect(next.gems.history?.[TODAY]).toBeUndefined();
    expect(next.farmActivity["Instant Gems Spent"]).toBeUndefined();
  });

  it("digs only Mud without owning any Gems", () => {
    const state = readyState();
    const next = digAll({
      ...state,
      inventory: { ...state.inventory, Gem: undefined },
    });

    expect(isCavePatchCleared(next.cave!.machines["1"].batch!)).toBe(true);
    expect(next.inventory.Gem).toBeUndefined();
  });

  it("digs a fresh patch for 3 Gems a Beetle and 2 a Mushroom", () => {
    const state = readyState({ batch: { dug: undefined } });
    const next = digAll(state);

    // Mushroom mix: 2 Beetles, 6 Mushrooms, 17 Mud.
    expect(next.inventory.Gem).toEqual(new Decimal(1000 - (6 + 12)));
    expect(next.gems.history?.[TODAY]?.spent).toBe(18);
    expect(next.farmActivity["Instant Gems Spent"]).toBe(18);
    expect(next.inventory["Sand Shovel"]).toEqual(new Decimal(30 - 25));
    expect(isCavePatchCleared(next.cave!.machines["1"].batch!)).toBe(true);
    expect(gained(state, next, [...BEETLES])).toBe(2);
    expect(gained(state, next, ["Wild Mushroom", "Magic Mushroom"])).toBe(6);
    expect(gained(state, next, ["Mud"])).toBe(17);
  });

  it("records one board whose clues all count right", () => {
    const next = digAll(readyState({ batch: { dug: undefined } }));
    const dug = next.cave!.machines["1"].batch!.dug!;

    const layout: CavePatchLayout = {};
    for (const [key, record] of Object.entries(dug)) layout[key] = record.tile!;

    for (const [key, record] of Object.entries(dug)) {
      const [x, y] = key.split(",").map(Number);
      expect(record.dugAt).toBe(NOW);
      if (record.tile!.type === "Beetle") {
        expect(record.clue).toBeUndefined();
      } else {
        expect(record.clue).toBe(getCaveTileClue(layout, x, y));
      }
    }
  });

  it("prices a part-dug patch by what is still buried", () => {
    const [beetle] = keysOf("Beetle");
    const [mushroom] = keysOf("Mushroom");
    const dug = { ...ALL_FOUND };
    delete dug[beetle];
    delete dug[mushroom];

    const state = readyState({ batch: { dug } });
    const next = digAll(state);

    expect(next.inventory.Gem).toEqual(new Decimal(1000 - (3 + 2)));
    expect(gained(state, next, [...BEETLES])).toBe(1);
    expect(gained(state, next, ["Wild Mushroom", "Magic Mushroom"])).toBe(1);
  });

  it("scales the price by the Gems spent today", () => {
    const next = digAll(
      readyState({ batch: { dug: undefined }, gemsSpentToday: 100 }),
    );

    // 18 x 1.15 = 20.7, rounded to 21.
    expect(next.inventory.Gem).toEqual(new Decimal(1000 - 21));
    expect(next.gems.history?.[TODAY]?.spent).toBe(121);
  });

  it("ignores Gems spent on earlier days", () => {
    const state = readyState({ batch: { dug: undefined } });
    const next = digAll({
      ...state,
      gems: { history: { "2026-09-22": { spent: 1000 } } },
    });

    expect(next.inventory.Gem).toEqual(new Decimal(1000 - 18));
  });

  it("throws without enough Gems", () => {
    expect(() =>
      digAll(readyState({ batch: { dug: undefined }, gems: 17 })),
    ).toThrow(DIG_ALL_CAVE_TILES_ERRORS.INSUFFICIENT_GEMS);
  });

  it("throws without any Gems while a Beetle or Mushroom is buried", () => {
    const state = readyState({ batch: { dug: undefined } });
    expect(() =>
      digAll({ ...state, inventory: { ...state.inventory, Gem: undefined } }),
    ).toThrow(DIG_ALL_CAVE_TILES_ERRORS.INSUFFICIENT_GEMS);
  });

  it("digs only Mud with 0 Gems", () => {
    expect(() => digAll(readyState({ gems: 0 }))).not.toThrow();
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

describe("getCaveDigAllGems", () => {
  const price = (batch: Partial<CaveBatch>, gemsSpentToday?: number) =>
    getCaveDigAllGems({
      batch: readyState({ batch }).cave!.machines["1"].batch!,
      game: readyState({ gemsSpentToday }),
      now: NOW,
    });

  it.each<[CaveBatch["recipe"], number]>([
    ["Mushroom", 2 * 3 + 6 * 2],
    ["Beetle", 5 * 3 + 3 * 2],
    ["Mud", 2 * 3 + 3 * 2],
  ])("prices a fresh %s patch at %s Gems", (recipe, gems) => {
    expect(price({ recipe, dug: undefined })).toBe(gems);
  });

  it("prices the extra Beetle and Mushroom tiles a batch's skills add", () => {
    expect(
      price({
        dug: undefined,
        skills: { extraBeetleTiles: 1, extraMushroomTiles: 1 },
      }),
    ).toBe(18 + 3 + 2);
  });

  it("is 0 when only Mud is left", () => {
    expect(price({})).toBe(0);
    expect(price({}, 1000)).toBe(0);
  });

  it("is 0 once every tile is dug", () => {
    const cleared = digAll(readyState()).cave!.machines["1"].batch!;
    expect(price(cleared)).toBe(0);
  });

  it.each([
    [0, 18],
    [100, 21],
    [500, 36],
    [1000, 73],
  ])(
    "with %s Gems spent today, a fresh Mushroom mix costs %s",
    (spent, gems) => {
      expect(price({ dug: undefined }, spent)).toBe(gems);
    },
  );
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
      new Decimal(30 - MUD_LEFT + kept),
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
