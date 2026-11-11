import { CAVE_RECIPES, caveTileKey, type CaveRecipeName } from "./caveRecipes";
import type { CaveBatch, CaveDugTile } from "./game";
import {
  CAVE_MAGIC_MUSHROOM_CHANCE,
  CAVE_RECORDS_FIT_NO_BOARD,
  canRestartCaveBatch,
  createCaveDigRandom,
  generateCavePatch,
  getCaveBeetleProgress,
  getCavePatchComposition,
  getRevealedCaveTiles,
  getUndugCaveTiles,
  isCaveSeed,
  getCaveTileClue,
  resolveCaveTile,
  recordCaveDig,
  resolveRevealedCaveTile,
  revealCavePatch,
  sampleCavePatch,
  type CavePatchLayout,
  type CaveTile,
} from "./cavePatch";

// Both repos keep this file byte-identical: the golden layouts below prove the
// FE and BE build the same board from the same seed.

const RECIPES = Object.keys(CAVE_RECIPES) as CaveRecipeName[];

/** A 128-bit seed (32 hex chars) from a small number, for loops. */
const hexSeed = (n: number) => n.toString(16).padStart(32, "0");

const MUSHROOM_SEED = "00112233445566778899aabbccddeeff";
const BEETLE_SEED = "ffeeddccbbaa99887766554433221100";

/** One letter per tile, row by row (y = 0..4): M (Wild Mushroom), G (Magic
 * Mushroom), D (Mud), or the Beetle's initial (b = Brown, u = Blue, p = Pink,
 * a = Amber). */
function toRows(layout: CavePatchLayout): string[] {
  const letter = (tile: CaveTile) => {
    if (tile.type === "Mushroom") {
      return tile.mushroom === "Magic Mushroom" ? "G" : "M";
    }
    if (tile.type === "Mud") return "D";
    return {
      "Green Beetle": "b",
      "Blue Beetle": "u",
      "Pink Beetle": "p",
      "Amber Beetle": "a",
    }[tile.beetle];
  };
  return [0, 1, 2, 3, 4].map((y) =>
    [0, 1, 2, 3, 4].map((x) => letter(layout[`${x},${y}`])).join(""),
  );
}

function countByType(layout: CavePatchLayout) {
  const counts: Record<string, number> = {
    Mushroom: 0,
    Beetle: 0,
    Mud: 0,
  };
  for (const tile of Object.values(layout)) counts[tile.type] += 1;
  return counts;
}

/**
 * Build a layout from 5 rows (y = 0..4) of "B" (Beetle) / "M" (Mushroom) /
 * "." (Mud).
 */
function layoutFromRows(rows: string[]): CavePatchLayout {
  const layout: CavePatchLayout = {};
  rows.forEach((row, y) =>
    row.split("").forEach((cell, x) => {
      if (cell === "B") {
        layout[`${x},${y}`] = { type: "Beetle", beetle: "Green Beetle" };
      } else if (cell === "M") {
        layout[`${x},${y}`] = { type: "Mushroom", mushroom: "Wild Mushroom" };
      } else {
        layout[`${x},${y}`] = { type: "Mud", amount: 1 };
      }
    }),
  );
  return layout;
}

describe("generateCavePatch", () => {
  it("builds the same golden board from the same seed in both repos", () => {
    expect(
      toRows(generateCavePatch({ recipe: "Mushroom", seed: MUSHROOM_SEED })),
    ).toEqual(GOLDEN_MUSHROOM);
    expect(
      toRows(generateCavePatch({ recipe: "Beetle", seed: BEETLE_SEED })),
    ).toEqual(GOLDEN_BEETLE);
  });

  it("is deterministic for a seed", () => {
    expect(generateCavePatch({ recipe: "Mud", seed: hexSeed(7) })).toEqual(
      generateCavePatch({ recipe: "Mud", seed: hexSeed(7) }),
    );
  });

  it("builds a different board for a different seed", () => {
    expect(generateCavePatch({ recipe: "Mud", seed: hexSeed(7) })).not.toEqual(
      generateCavePatch({ recipe: "Mud", seed: hexSeed(8) }),
    );
  });

  it("uses every 32-bit word of the seed", () => {
    const base = "00000000000000000000000000000000";
    const boards = new Set(
      [
        base,
        "10000000000000000000000000000000",
        "00000000100000000000000000000000",
        "00000000000000001000000000000000",
        "00000000000000000000000010000000",
      ].map((seed) =>
        JSON.stringify(generateCavePatch({ recipe: "Beetle", seed })),
      ),
    );
    expect(boards.size).toBe(5);
  });

  it("rejects a seed that is not 32 hex characters", () => {
    expect(() => generateCavePatch({ recipe: "Mud", seed: "12345" })).toThrow();
    expect(() =>
      generateCavePatch({ recipe: "Mud", seed: "z".repeat(32) }),
    ).toThrow();
  });

  it("fills exactly 25 tiles keyed by 0..4 coordinates", () => {
    const layout = generateCavePatch({ recipe: "Beetle", seed: hexSeed(1) });
    expect(Object.keys(layout)).toHaveLength(25);
    for (let x = 0; x < 5; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        expect(layout[`${x},${y}`]).toBeDefined();
      }
    }
  });

  it("buries the #7721 tile counts, with no Chapter Artefact", () => {
    expect(CAVE_RECIPES.Mushroom.composition).toEqual({
      Mushroom: 6,
      Beetle: 2,
      Mud: 17,
    });
    expect(CAVE_RECIPES.Beetle.composition).toEqual({
      Mushroom: 3,
      Beetle: 5,
      Mud: 17,
    });
    expect(CAVE_RECIPES.Mud.composition).toEqual({
      Mushroom: 3,
      Beetle: 2,
      Mud: 20,
    });
  });

  it.each(RECIPES)("matches the recipe composition (%s)", (recipe) => {
    for (let seed = 1; seed <= 20; seed += 1) {
      expect(
        countByType(generateCavePatch({ recipe, seed: hexSeed(seed) })),
      ).toEqual(CAVE_RECIPES[recipe].composition);
    }
  });

  it("stamps each Mud tile with the recipe's yield multiplier", () => {
    const layout = generateCavePatch({ recipe: "Mud", seed: hexSeed(3) });
    for (const tile of Object.values(layout)) {
      if (tile.type === "Mud")
        expect(tile.amount).toBe(CAVE_RECIPES.Mud.mudYieldMultiplier);
    }
  });

  it("rolls a Magic Mushroom on close to 10% of Mushroom tiles", () => {
    expect(CAVE_MAGIC_MUSHROOM_CHANCE).toBe(0.1);

    let magic = 0;
    let total = 0;
    // The Mushroom recipe buries 6 per patch; 2000 patches = 12k rolls.
    for (let seed = 1; seed <= 2000; seed += 1) {
      const layout = generateCavePatch({
        recipe: "Mushroom",
        seed: hexSeed(seed),
      });
      for (const tile of Object.values(layout)) {
        if (tile.type !== "Mushroom") continue;
        total += 1;
        if (tile.mushroom === "Magic Mushroom") magic += 1;
        else expect(tile.mushroom).toBe("Wild Mushroom");
      }
    }
    expect(total).toBe(2000 * 6);
    expect((magic / total) * 100).toBeGreaterThan(8);
    expect((magic / total) * 100).toBeLessThan(12);
  });

  it("rolls Beetle rarities close to 40/30/20/10 over many seeds", () => {
    const tally: Record<string, number> = {
      "Green Beetle": 0,
      "Blue Beetle": 0,
      "Pink Beetle": 0,
      "Amber Beetle": 0,
    };
    // The Beetle recipe buries 5 Beetles per patch; 2500 patches ≈ 12.5k rolls.
    for (let seed = 1; seed <= 2500; seed += 1) {
      const layout = generateCavePatch({
        recipe: "Beetle",
        seed: hexSeed(seed),
      });
      for (const tile of Object.values(layout)) {
        if (tile.type === "Beetle") tally[tile.beetle] += 1;
      }
    }
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    expect(total).toBe(2500 * 5);
    const pct = (n: string) => (tally[n] / total) * 100;
    expect(pct("Green Beetle")).toBeGreaterThan(35);
    expect(pct("Green Beetle")).toBeLessThan(45);
    expect(pct("Blue Beetle")).toBeGreaterThan(25);
    expect(pct("Blue Beetle")).toBeLessThan(35);
    expect(pct("Pink Beetle")).toBeGreaterThan(15);
    expect(pct("Pink Beetle")).toBeLessThan(25);
    expect(pct("Amber Beetle")).toBeGreaterThan(6);
    expect(pct("Amber Beetle")).toBeLessThan(14);
  });
});

describe("getCaveTileClue", () => {
  const layout = layoutFromRows([
    ".B...", // y = 0
    "B....", // y = 1
    "..B..", // y = 2
    ".....", // y = 3
    "....B", // y = 4
  ]);

  it("counts Beetles around a corner tile", () => {
    expect(getCaveTileClue(layout, 0, 0)).toBe(2);
    expect(getCaveTileClue(layout, 4, 0)).toBe(0);
  });

  it("counts Beetles along an edge tile", () => {
    expect(getCaveTileClue(layout, 2, 0)).toBe(1);
    expect(getCaveTileClue(layout, 4, 3)).toBe(1);
  });

  it("counts the four orthogonal neighbours of a centre tile", () => {
    expect(getCaveTileClue(layout, 1, 1)).toBe(2);
    expect(getCaveTileClue(layout, 2, 1)).toBe(1);
  });

  it("ignores diagonal Beetles", () => {
    // (3,3) touches the Beetles at (2,2) and (4,4) only diagonally.
    expect(getCaveTileClue(layout, 3, 3)).toBe(0);
  });

  it("does not count the tile itself", () => {
    expect(getCaveTileClue(layout, 2, 2)).toBe(0);
  });

  it("counts every Beetle rarity", () => {
    const mixed = layoutFromRows(["BB...", "B....", ".....", ".....", "....."]);
    mixed["1,0"] = { type: "Beetle", beetle: "Amber Beetle" };
    mixed["0,1"] = { type: "Beetle", beetle: "Pink Beetle" };
    expect(getCaveTileClue(mixed, 1, 1)).toBe(2);
  });

  it("counts Mushrooms as well as Beetles", () => {
    const withMushrooms = layoutFromRows([
      ".M...", // y = 0
      "B.M..", // y = 1
      ".M...", // y = 2
      ".....", // y = 3
      ".....", // y = 4
    ]);
    expect(getCaveTileClue(withMushrooms, 0, 0)).toBe(2);
    expect(getCaveTileClue(withMushrooms, 1, 1)).toBe(4);
    expect(getCaveTileClue(withMushrooms, 3, 0)).toBe(0);
  });

  it("counts Magic Mushrooms", () => {
    const magic = layoutFromRows([".....", ".....", ".....", ".....", "....."]);
    magic["1,0"] = { type: "Mushroom", mushroom: "Magic Mushroom" };
    expect(getCaveTileClue(magic, 0, 0)).toBe(1);
  });

  it("gives a Mushroom tile a clue from its neighbours, not itself", () => {
    const lone = layoutFromRows([".....", ".....", "..M..", ".....", "....."]);
    expect(getCaveTileClue(lone, 2, 2)).toBe(0);
  });
});

describe("resolveCaveTile", () => {
  const layout: CavePatchLayout = {
    ...layoutFromRows(["B....", ".....", ".....", ".....", "....."]),
    "1,0": { type: "Mushroom", mushroom: "Wild Mushroom" },
    "0,1": { type: "Mushroom", mushroom: "Magic Mushroom" },
    "4,4": { type: "Mud", amount: 2 },
    "3,3": { type: "Beetle", beetle: "Amber Beetle" },
  };

  it("awards Wild Mushroom and a clue for a Mushroom tile", () => {
    expect(resolveCaveTile(layout, 1, 0)).toEqual({
      type: "Mushroom",
      items: { "Wild Mushroom": 1 },
      clue: 1,
    });
  });

  it("awards Magic Mushroom and a clue for a Magic Mushroom tile", () => {
    expect(resolveCaveTile(layout, 0, 1)).toEqual({
      type: "Mushroom",
      items: { "Magic Mushroom": 1 },
      clue: 1,
    });
  });

  it("awards the Beetle and no clue for a Beetle tile", () => {
    expect(resolveCaveTile(layout, 3, 3)).toEqual({
      type: "Beetle",
      items: { "Amber Beetle": 1 },
    });
  });

  it("awards the tile's Mud amount and a clue for a Mud tile", () => {
    expect(resolveCaveTile(layout, 4, 4)).toEqual({
      type: "Mud",
      items: { Mud: 2 },
      clue: 0,
    });
  });
});

describe("isCaveSeed", () => {
  it("accepts 32 lowercase hex characters", () => {
    expect(isCaveSeed(MUSHROOM_SEED)).toBe(true);
  });

  it.each([
    12345,
    "12345",
    "Z".repeat(32),
    MUSHROOM_SEED.toUpperCase(),
    undefined,
  ])("rejects %s", (seed) => {
    expect(isCaveSeed(seed)).toBe(false);
  });
});

describe("getCaveBeetleProgress", () => {
  it("counts dug Beetle tiles against the recipe total", () => {
    const seed = hexSeed(99);
    const layout = generateCavePatch({ recipe: "Beetle", seed });
    const beetleKeys = Object.keys(layout).filter(
      (key) => layout[key].type === "Beetle",
    );
    const mudKey = Object.keys(layout).find(
      (key) => layout[key].type === "Mud",
    )!;

    expect(
      getCaveBeetleProgress({
        recipe: "Beetle",
        startedAt: 0,
        readyAt: 1,
        seed,
        dug: { [beetleKeys[0]]: { dugAt: 1 }, [mudKey]: { dugAt: 1 } },
      }),
    ).toEqual({ found: 1, total: CAVE_RECIPES.Beetle.composition.Beetle });
  });

  it("finds nothing for a batch without a valid seed", () => {
    expect(
      getCaveBeetleProgress({
        recipe: "Mud",
        startedAt: 0,
        readyAt: 1,
        seed: 12345 as unknown as string,
        dug: { "0,0": { dugAt: 1 } },
      }),
    ).toEqual({ found: 0, total: CAVE_RECIPES.Mud.composition.Beetle });
  });

  it("finds nothing before the seed arrives", () => {
    expect(
      getCaveBeetleProgress({ recipe: "Mud", startedAt: 0, readyAt: 1 }),
    ).toEqual({ found: 0, total: CAVE_RECIPES.Mud.composition.Beetle });
  });
});

// MUSHROOM_SEED's golden board has its two Beetles at (3,3) and (3,4), and
// Mushrooms at (1,0), (3,0), (0,1) (Magic), (1,1), (2,1), (2,3).
const mushroomBatch = (dugKeys: string[]) => ({
  recipe: "Mushroom" as const,
  startedAt: 0,
  readyAt: 1,
  seed: MUSHROOM_SEED,
  dug: Object.fromEntries(dugKeys.map((key) => [key, { dugAt: 1 }])),
});

describe("canRestartCaveBatch", () => {
  it("is false before any tile is dug", () => {
    expect(canRestartCaveBatch(mushroomBatch([]))).toBe(false);
  });

  it("is false while a Beetle is still buried", () => {
    expect(canRestartCaveBatch(mushroomBatch(["3,3", "0,0"]))).toBe(false);
  });

  it("is true once every Beetle is found, even with tiles left", () => {
    expect(canRestartCaveBatch(mushroomBatch(["3,3", "3,4"]))).toBe(true);
  });

  it("is true once every tile is dug", () => {
    const all = Array.from(
      { length: 25 },
      (_, i) => `${i % 5},${Math.floor(i / 5)}`,
    );
    expect(canRestartCaveBatch(mushroomBatch(all))).toBe(true);
  });

  it("is false for a partly dug batch without a valid seed", () => {
    expect(
      canRestartCaveBatch({
        ...mushroomBatch(["3,3", "3,4"]),
        seed: 12345 as unknown as string,
      }),
    ).toBe(false);
  });
});

describe("getUndugCaveTiles", () => {
  it("counts what is still buried, by tile type", () => {
    expect(
      getUndugCaveTiles(mushroomBatch(["3,3", "3,4", "1,0", "0,0"])),
    ).toEqual({
      Mushroom: 5,
      Beetle: 0,
      Mud: 16,
    });
  });

  it("counts the whole recipe as buried before the seed arrives", () => {
    expect(
      getUndugCaveTiles({ recipe: "Mud", startedAt: 0, readyAt: 1 }),
    ).toEqual({ Mushroom: 3, Beetle: 2, Mud: 20 });
  });
});

describe("Cave board skills", () => {
  const SKILLS = { extraMushroomTiles: 2, extraBeetleTiles: 3 };
  const ALL_AMBER = {
    "Green Beetle": 0,
    "Blue Beetle": 0,
    "Pink Beetle": 0,
    "Amber Beetle": 100,
  };

  /** toRows with every Beetle as "B", so rarity changes do not show. */
  const toShape = (layout: CavePatchLayout) =>
    toRows(layout).map((row) => row.replace(/[bupa]/g, "B"));

  it.each(RECIPES)("keeps the recipe composition without skills (%s)", (r) => {
    expect(getCavePatchComposition(r)).toEqual(CAVE_RECIPES[r].composition);
  });

  it.each(RECIPES)(
    "adds Mushroom and Beetle tiles in place of Mud (%s)",
    (recipe) => {
      const { Mushroom, Beetle, Mud } = CAVE_RECIPES[recipe].composition;
      const expected = {
        Mushroom: Mushroom + 2,
        Beetle: Beetle + 3,
        Mud: Mud - 5,
      };

      expect(getCavePatchComposition(recipe, SKILLS)).toEqual(expected);
      for (let seed = 1; seed <= 20; seed += 1) {
        expect(
          countByType(
            generateCavePatch({ recipe, seed: hexSeed(seed), skills: SKILLS }),
          ),
        ).toEqual(expected);
      }
    },
  );

  it("rolls Beetles from the batch's rarity table", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const layout = generateCavePatch({
        recipe: "Beetle",
        seed: hexSeed(seed),
        skills: { beetleRarity: ALL_AMBER },
      });
      for (const tile of Object.values(layout)) {
        if (tile.type === "Beetle") expect(tile.beetle).toBe("Amber Beetle");
      }
    }
  });

  it("changes only the Beetle rarities, not where tiles lie", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      expect(
        toShape(
          generateCavePatch({
            recipe: "Mushroom",
            seed: hexSeed(seed),
            skills: { beetleRarity: ALL_AMBER },
          }),
        ),
      ).toEqual(
        toShape(generateCavePatch({ recipe: "Mushroom", seed: hexSeed(seed) })),
      );
    }
  });

  it("builds the same skilled golden board in both repos", () => {
    expect(
      toRows(
        generateCavePatch({
          recipe: "Mushroom",
          seed: MUSHROOM_SEED,
          skills: {
            extraMushroomTiles: 3,
            extraBeetleTiles: 3,
            beetleRarity: {
              "Green Beetle": 25,
              "Blue Beetle": 25,
              "Pink Beetle": 25,
              "Amber Beetle": 25,
            },
          },
        }),
      ),
    ).toEqual(GOLDEN_SKILLED_MUSHROOM);
  });

  it("counts the extra Beetle tiles towards finding every Beetle", () => {
    const seed = hexSeed(99);
    const skills = { extraBeetleTiles: 2 };
    const layout = generateCavePatch({ recipe: "Beetle", seed, skills });
    const beetleKeys = Object.keys(layout).filter(
      (key) => layout[key].type === "Beetle",
    );
    const batch = (dug: string[]) => ({
      recipe: "Beetle" as const,
      startedAt: 0,
      readyAt: 1,
      seed,
      skills,
      dug: Object.fromEntries(dug.map((key) => [key, { dugAt: 1 }])),
    });

    expect(beetleKeys).toHaveLength(7);
    expect(getCaveBeetleProgress(batch(beetleKeys.slice(0, 4)))).toEqual({
      found: 4,
      total: 7,
    });
    expect(canRestartCaveBatch(batch(beetleKeys.slice(0, 6)))).toBe(false);
    expect(canRestartCaveBatch(batch(beetleKeys))).toBe(true);
    expect(getUndugCaveTiles(batch(beetleKeys))).toEqual({
      Mushroom: 3,
      Beetle: 0,
      Mud: 15,
    });
  });
});

// MUSHROOM_SEED at max-rank Mushroom Bloom, Beetle Nest and Rare Breeds:
// 9 Mushrooms (2 Magic), 5 Beetles and 11 Mud.
const GOLDEN_SKILLED_MUSHROOM = ["DMpGu", "MMMaD", "DDGDD", "DuMMu", "DDDMD"];
const GOLDEN_MUSHROOM = ["DMDMD", "GMMDD", "DDDDD", "DDMbD", "DDDpD"];
const GOLDEN_BEETLE = ["DMDDb", "DDDDb", "MMbDD", "DuDDD", "DDDDb"];

// ---------------------------------------------------------------------------
// Dig-time boards. A batch has no fixed layout: each dig samples a board that
// fits every tile and clue revealed so far, from the seed AND the dig's
// timestamp, so a replay after a rollback finds different tiles.
// ---------------------------------------------------------------------------

const DIG_AT = 1_700_000_000_000;

const batchOf = (overrides: Partial<CaveBatch> = {}): CaveBatch => ({
  recipe: "Mushroom",
  startedAt: 0,
  readyAt: 0,
  seed: MUSHROOM_SEED,
  ...overrides,
});

const isFull = (tile: CaveTile) => tile.type !== "Mud";

/** Dig `coords` in order, each one second apart, recording what each held. */
function digTiles(
  batch: CaveBatch,
  coords: { x: number; y: number }[],
  from = DIG_AT,
): CaveBatch {
  return coords.reduce((current, { x, y }, index) => {
    const createdAt = from + index * 1000;
    const layout = revealCavePatch({ batch: current, createdAt, x, y });
    const key = caveTileKey(x, y);
    const record: CaveDugTile = {
      dugAt: createdAt,
      tile: layout[key],
      clue: resolveCaveTile(layout, x, y).clue,
    };
    return { ...current, dug: { ...current.dug, [key]: record } };
  }, batch);
}

const ALL_TILES = Array.from({ length: 25 }, (_, i) => ({
  x: i % 5,
  y: Math.floor(i / 5),
}));

/** Every tile's letter, sorted: the board's contents regardless of position. */
const contents = (layout: CavePatchLayout) =>
  toRows(layout).join("").split("").sort().join("");

describe("createCaveDigRandom", () => {
  const dig = { seed: MUSHROOM_SEED, createdAt: DIG_AT, x: 2, y: 3 };
  const draws = (args: typeof dig) => {
    const random = createCaveDigRandom(args);
    return [random(), random(), random()];
  };

  it("is deterministic for the same seed, millisecond and tile", () => {
    expect(draws(dig)).toEqual(draws(dig));
  });

  it("differs for a different millisecond", () => {
    expect(draws({ ...dig, createdAt: DIG_AT + 1 })).not.toEqual(draws(dig));
  });

  it("uses the high bits of the timestamp", () => {
    expect(draws({ ...dig, createdAt: DIG_AT + 2 ** 32 })).not.toEqual(
      draws(dig),
    );
  });

  it("differs for a different tile", () => {
    expect(draws({ ...dig, x: 3 })).not.toEqual(draws(dig));
    expect(draws({ ...dig, y: 2 })).not.toEqual(draws(dig));
  });

  it("differs for a different seed", () => {
    expect(draws({ ...dig, seed: BEETLE_SEED })).not.toEqual(draws(dig));
  });

  it("rejects an invalid seed", () => {
    expect(() => createCaveDigRandom({ ...dig, seed: "nope" })).toThrow(
      "Invalid Cave seed",
    );
  });
});

describe("revealCavePatch", () => {
  it("reveals the same golden board in both repos", () => {
    expect(
      toRows(
        revealCavePatch({ batch: batchOf(), createdAt: DIG_AT, x: 2, y: 2 }),
      ),
    ).toEqual(["DDDDD", "DDDDD", "DDpMM", "DGbMD", "MDDMD"]);
  });

  it("reveals the same golden board after a dig sequence in both repos", () => {
    const batch = digTiles(batchOf(), [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 0, y: 0 },
    ]);
    expect(
      toRows(
        revealCavePatch({ batch, createdAt: DIG_AT + 60_000, x: 3, y: 2 }),
      ),
    ).toEqual(["GDDDM", "DMMDM", "DDpDD", "DDDbD", "DDMDD"]);
  });

  it("finds a different board when the same dig is replayed later", () => {
    const boards = new Set(
      Array.from({ length: 20 }, (_, i) =>
        toRows(
          revealCavePatch({
            batch: batchOf(),
            createdAt: DIG_AT + i,
            x: 2,
            y: 2,
          }),
        ).join("/"),
      ),
    );
    expect(boards.size).toBeGreaterThan(1);
  });

  it("buries the same contents as the seed's board, wherever they lie", () => {
    const initial = generateCavePatch({
      recipe: "Mushroom",
      seed: MUSHROOM_SEED,
    });
    for (let i = 0; i < 50; i += 1) {
      const layout = revealCavePatch({
        batch: batchOf(),
        createdAt: DIG_AT + i,
        x: 0,
        y: 0,
      });
      expect(contents(layout)).toBe(contents(initial));
    }
  });

  it("gives every tile a fair chance of a Beetle before anything is dug", () => {
    let beetles = 0;
    for (let i = 0; i < 400; i += 1) {
      const layout = revealCavePatch({
        batch: batchOf(),
        createdAt: DIG_AT + i,
        x: 0,
        y: 0,
      });
      if (layout["0,0"].type === "Beetle") beetles += 1;
    }
    // 2 Beetles over 25 tiles: 8% of 400 = 32.
    expect(beetles).toBeGreaterThan(14);
    expect(beetles).toBeLessThan(55);
  });

  it("keeps every dug tile where it was, with what it held", () => {
    const batch = digTiles(batchOf({ recipe: "Beetle", seed: BEETLE_SEED }), [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 4 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
    ]);
    for (let i = 0; i < 50; i += 1) {
      const layout = revealCavePatch({
        batch,
        createdAt: DIG_AT + 100_000 + i,
        x: 4,
        y: 0,
      });
      for (const [key, record] of Object.entries(batch.dug ?? {})) {
        expect(layout[key]).toEqual(record.tile);
      }
    }
  });

  it("keeps every revealed clue true", () => {
    const batch = digTiles(batchOf({ recipe: "Beetle", seed: BEETLE_SEED }), [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 4 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 0, y: 4 },
    ]);
    for (let i = 0; i < 50; i += 1) {
      const layout = revealCavePatch({
        batch,
        createdAt: DIG_AT + 100_000 + i,
        x: 4,
        y: 0,
      });
      for (const [key, record] of Object.entries(batch.dug ?? {})) {
        if (record.clue === undefined) continue;
        const [x, y] = key.split(",").map(Number);
        expect(getCaveTileClue(layout, x, y)).toBe(record.clue);
      }
    }
  });

  it("keeps the buried contents as the dug tiles are taken out", () => {
    const initial = generateCavePatch({ recipe: "Beetle", seed: BEETLE_SEED });
    const batch = digTiles(
      batchOf({ recipe: "Beetle", seed: BEETLE_SEED }),
      ALL_TILES.slice(0, 12),
    );
    for (let i = 0; i < 20; i += 1) {
      const layout = revealCavePatch({
        batch,
        createdAt: DIG_AT + 100_000 + i,
        x: 4,
        y: 4,
      });
      expect(contents(layout)).toBe(contents(initial));
    }
  });

  it("leaves a tile the clues pin down where it is", () => {
    // Two tiles left, each with every neighbour dug: their clues decide both.
    const left = [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
    ];
    const batch = digTiles(
      batchOf({ recipe: "Beetle", seed: BEETLE_SEED }),
      ALL_TILES.filter(
        ({ x, y }) => !left.some((tile) => tile.x === x && tile.y === y),
      ),
    );
    const first = revealCavePatch({
      batch,
      createdAt: DIG_AT + 1e6,
      x: 0,
      y: 0,
    });
    for (let i = 1; i < 30; i += 1) {
      const layout = revealCavePatch({
        batch,
        createdAt: DIG_AT + 1e6 + i,
        x: 0,
        y: 0,
      });
      for (const { x, y } of left) {
        const key = caveTileKey(x, y);
        expect(isFull(layout[key])).toBe(isFull(first[key]));
      }
    }
  });

  it("digs every tile of a batch without ever contradicting a clue", () => {
    const batch = digTiles(
      batchOf({ recipe: "Mud", seed: BEETLE_SEED }),
      ALL_TILES,
    );
    const revealed = getRevealedCaveTiles(batch);
    const layout: CavePatchLayout = {};
    for (const [key, { tile }] of Object.entries(revealed)) layout[key] = tile;
    for (const [key, { clue }] of Object.entries(revealed)) {
      if (clue === undefined) continue;
      const [x, y] = key.split(",").map(Number);
      expect(getCaveTileClue(layout, x, y)).toBe(clue);
    }
    expect(contents(layout)).toBe(
      contents(generateCavePatch({ recipe: "Mud", seed: BEETLE_SEED })),
    );
  });

  it("reads tiles dug before boards were sampled from the seed's board", () => {
    const initial = generateCavePatch({
      recipe: "Mushroom",
      seed: MUSHROOM_SEED,
    });
    const batch = batchOf({
      dug: { "1,0": { dugAt: 1 }, "3,3": { dugAt: 2 } },
    });
    for (let i = 0; i < 20; i += 1) {
      const layout = revealCavePatch({
        batch,
        createdAt: DIG_AT + i,
        x: 2,
        y: 2,
      });
      expect(layout["1,0"]).toEqual(initial["1,0"]);
      expect(layout["3,3"]).toEqual(initial["3,3"]);
      expect(getCaveTileClue(layout, 1, 0)).toBe(
        getCaveTileClue(initial, 1, 0),
      );
    }
  });

  it("throws when a recorded clue fits no board", () => {
    const batch = batchOf({
      dug: { "0,0": { dugAt: 1, tile: { type: "Mud", amount: 1 }, clue: 4 } },
    });
    expect(() =>
      revealCavePatch({ batch, createdAt: DIG_AT, x: 2, y: 2 }),
    ).toThrow(CAVE_RECORDS_FIT_NO_BOARD);
  });

  it("throws when a recorded tile is not among the seed's buried kinds", () => {
    // The Mushroom golden board buries a Green and a Pink Beetle, never Amber.
    const batch = batchOf({
      dug: {
        "0,0": { dugAt: 1, tile: { type: "Beetle", beetle: "Amber Beetle" } },
      },
    });
    expect(() =>
      revealCavePatch({ batch, createdAt: DIG_AT, x: 2, y: 2 }),
    ).toThrow(CAVE_RECORDS_FIT_NO_BOARD);
  });

  it("ignores a record keyed off the patch", () => {
    const batch = batchOf({
      dug: { "9,9": { dugAt: 1 }, "a,b": { dugAt: 1 } },
    });
    expect(getRevealedCaveTiles(batch)).toEqual({});
    expect(
      Object.keys(revealCavePatch({ batch, createdAt: DIG_AT, x: 2, y: 2 })),
    ).toHaveLength(25);
  });

  it("still moves the undug tiles of a batch that only has records from before boards were sampled", () => {
    const batch = batchOf({
      dug: { "1,0": { dugAt: 1 }, "3,3": { dugAt: 2 } },
    });
    const boards = new Set(
      Array.from({ length: 20 }, (_, i) =>
        toRows(
          revealCavePatch({ batch, createdAt: DIG_AT + i, x: 2, y: 2 }),
        ).join("/"),
      ),
    );
    expect(boards.size).toBeGreaterThan(1);
  });

  it("uses the batch's skills for the buried contents", () => {
    const skills = { extraBeetleTiles: 3 };
    const initial = generateCavePatch({
      recipe: "Mushroom",
      seed: MUSHROOM_SEED,
      skills,
    });
    const layout = revealCavePatch({
      batch: batchOf({ skills }),
      createdAt: DIG_AT,
      x: 0,
      y: 0,
    });
    expect(contents(layout)).toBe(contents(initial));
    expect(countByType(layout).Beetle).toBe(5);
  });

  it("rejects a batch without a valid seed", () => {
    expect(() =>
      revealCavePatch({
        batch: batchOf({ seed: undefined }),
        createdAt: DIG_AT,
        x: 0,
        y: 0,
      }),
    ).toThrow("Invalid Cave seed");
  });
});

describe("sampleCavePatch", () => {
  it("is a pure function of the batch and the random source", () => {
    const batch = digTiles(batchOf(), ALL_TILES.slice(0, 5));
    const draws = () => {
      let n = 0;
      return () => ((n += 7919) % 1000) / 1000;
    };
    expect(sampleCavePatch({ batch, random: draws() })).toEqual(
      sampleCavePatch({ batch, random: draws() }),
    );
  });
});

describe("getRevealedCaveTiles", () => {
  it("returns each dug tile's record and clue", () => {
    const batch = digTiles(batchOf(), [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
    const revealed = getRevealedCaveTiles(batch);
    expect(Object.keys(revealed).sort()).toEqual(["1,1", "2,1"]);
    expect(revealed["1,1"]).toEqual({
      tile: batch.dug?.["1,1"].tile,
      clue: batch.dug?.["1,1"].clue,
    });
  });

  it("reads records dug before boards were sampled from the seed's board", () => {
    const initial = generateCavePatch({
      recipe: "Mushroom",
      seed: MUSHROOM_SEED,
    });
    const revealed = getRevealedCaveTiles(
      batchOf({ dug: { "1,0": { dugAt: 1 } } }),
    );
    expect(revealed["1,0"]).toEqual({
      tile: initial["1,0"],
      clue:
        initial["1,0"].type === "Beetle"
          ? undefined
          : getCaveTileClue(initial, 1, 0),
    });
  });

  it("skips such records when the seed is missing", () => {
    expect(
      getRevealedCaveTiles(
        batchOf({ seed: undefined, dug: { "1,0": { dugAt: 1 } } }),
      ),
    ).toEqual({});
  });

  it("is empty before anything is dug", () => {
    expect(getRevealedCaveTiles(batchOf())).toEqual({});
  });
});

describe("resolveRevealedCaveTile", () => {
  it("awards a Mushroom tile's mushroom and its clue", () => {
    expect(
      resolveRevealedCaveTile({
        tile: { type: "Mushroom", mushroom: "Magic Mushroom" },
        clue: 2,
      }),
    ).toEqual({ type: "Mushroom", items: { "Magic Mushroom": 1 }, clue: 2 });
  });

  it("awards a Beetle tile's Beetle and no clue", () => {
    expect(
      resolveRevealedCaveTile({
        tile: { type: "Beetle", beetle: "Pink Beetle" },
      }),
    ).toEqual({ type: "Beetle", items: { "Pink Beetle": 1 } });
  });

  it("awards a Mud tile's amount and its clue", () => {
    expect(
      resolveRevealedCaveTile({ tile: { type: "Mud", amount: 2 }, clue: 0 }),
    ).toEqual({ type: "Mud", items: { Mud: 2 }, clue: 0 });
  });
});

describe("progress from dug records", () => {
  it("counts recorded Beetles without needing the seed", () => {
    const batch = batchOf({
      seed: undefined,
      dug: {
        "0,0": { dugAt: 1, tile: { type: "Beetle", beetle: "Green Beetle" } },
        "1,0": { dugAt: 2, tile: { type: "Mud", amount: 1 }, clue: 1 },
      },
    });
    expect(getCaveBeetleProgress(batch)).toEqual({ found: 1, total: 2 });
    expect(getUndugCaveTiles(batch)).toEqual({
      Mushroom: 6,
      Beetle: 1,
      Mud: 16,
    });
    expect(canRestartCaveBatch(batch)).toBe(false);
  });

  it("allows a restart once every recorded Beetle is found", () => {
    const batch = batchOf({
      dug: {
        "0,0": { dugAt: 1, tile: { type: "Beetle", beetle: "Green Beetle" } },
        "4,4": { dugAt: 2, tile: { type: "Beetle", beetle: "Blue Beetle" } },
      },
    });
    expect(canRestartCaveBatch(batch)).toBe(true);
  });
});

describe("recordCaveDig", () => {
  const layout = layoutFromRows(["B....", "M....", ".....", ".....", "....."]);

  it("records a Mushroom tile with its clue", () => {
    expect(recordCaveDig(layout, 0, 1, 5)).toEqual({
      dugAt: 5,
      tile: { type: "Mushroom", mushroom: "Wild Mushroom" },
      clue: 1,
    });
  });

  it("records a Beetle tile without a clue key", () => {
    expect(recordCaveDig(layout, 0, 0, 5)).toEqual({
      dugAt: 5,
      tile: { type: "Beetle", beetle: "Green Beetle" },
    });
    expect("clue" in recordCaveDig(layout, 0, 0, 5)).toBe(false);
  });

  it("records a Mud tile with its clue", () => {
    expect(recordCaveDig(layout, 1, 0, 5)).toEqual({
      dugAt: 5,
      tile: { type: "Mud", amount: 1 },
      clue: 1,
    });
  });
});
