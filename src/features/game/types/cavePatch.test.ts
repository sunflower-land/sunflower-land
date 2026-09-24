import { CAVE_RECIPES, type CaveRecipeName } from "./caveRecipes";
import {
  canRestartCaveBatch,
  generateCavePatch,
  getCaveBeetleProgress,
  getUndugCaveTiles,
  isCaveSeed,
  getCaveTileClue,
  resolveCaveTile,
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

/** One letter per tile, row by row (y = 0..4): M, D (Mud), X (Artefact), or
 * the Beetle's initial (b = Brown, u = Blue, p = Pink, a = Amber). */
function toRows(layout: CavePatchLayout): string[] {
  const letter = (tile: CaveTile) => {
    if (tile.type === "Mushroom") return "M";
    if (tile.type === "Mud") return "D";
    if (tile.type === "Artefact") return "X";
    return {
      "Brown Beetle": "b",
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
    Artefact: 0,
  };
  for (const tile of Object.values(layout)) counts[tile.type] += 1;
  return counts;
}

/** Build a layout from 5 rows (y = 0..4) of "B" (Beetle) / "." (Mud). */
function layoutFromRows(rows: string[]): CavePatchLayout {
  const layout: CavePatchLayout = {};
  rows.forEach((row, y) =>
    row.split("").forEach((cell, x) => {
      layout[`${x},${y}`] =
        cell === "B"
          ? { type: "Beetle", beetle: "Brown Beetle" }
          : { type: "Mud", amount: 1 };
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

  it("rolls Beetle rarities close to 40/30/20/10 over many seeds", () => {
    const tally: Record<string, number> = {
      "Brown Beetle": 0,
      "Blue Beetle": 0,
      "Pink Beetle": 0,
      "Amber Beetle": 0,
    };
    // The Beetle recipe buries 4 Beetles per patch; 2500 patches ≈ 10k rolls.
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
    expect(total).toBe(2500 * 4);
    const pct = (n: string) => (tally[n] / total) * 100;
    expect(pct("Brown Beetle")).toBeGreaterThan(35);
    expect(pct("Brown Beetle")).toBeLessThan(45);
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
});

describe("resolveCaveTile", () => {
  // Inside the Ascension Age chapter, whose artefact is the Otter Pebble.
  const NOW = new Date("2026-09-23T00:00:00.000Z").getTime();

  const layout: CavePatchLayout = {
    ...layoutFromRows(["B....", ".....", ".....", ".....", "....."]),
    "1,0": { type: "Mushroom" },
    "2,2": { type: "Artefact" },
    "4,4": { type: "Mud", amount: 2 },
    "3,3": { type: "Beetle", beetle: "Amber Beetle" },
  };

  it("awards Wild Mushroom and a clue for a Mushroom tile", () => {
    expect(resolveCaveTile(layout, 1, 0, NOW)).toEqual({
      type: "Mushroom",
      items: { "Wild Mushroom": 1 },
      clue: 1,
    });
  });

  it("awards the Beetle and no clue for a Beetle tile", () => {
    expect(resolveCaveTile(layout, 3, 3, NOW)).toEqual({
      type: "Beetle",
      items: { "Amber Beetle": 1 },
    });
  });

  it("awards the tile's Mud amount and a clue for a Mud tile", () => {
    expect(resolveCaveTile(layout, 4, 4, NOW)).toEqual({
      type: "Mud",
      items: { Mud: 2 },
      clue: 0,
    });
  });

  it("awards the artefact of the chapter current at dig time", () => {
    expect(resolveCaveTile(layout, 2, 2, NOW)).toEqual({
      type: "Artefact",
      items: { "Otter Pebble": 1 },
      clue: 0,
    });
    const pawPrints = new Date("2025-12-10T00:00:00.000Z").getTime();
    expect(resolveCaveTile(layout, 2, 2, pawPrints).items).toEqual({
      "Moon Crystal": 1,
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

// MUSHROOM_SEED's golden board has its two Beetles at (3,3) and (3,4), the
// artefact at (4,4) and Mushrooms at (1,0), (3,0), (0,1), (1,1), (2,1), (2,3).
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
      Mud: 15,
      Artefact: 1,
    });
  });

  it("is empty without a valid seed", () => {
    expect(
      getUndugCaveTiles({ recipe: "Mud", startedAt: 0, readyAt: 1 }),
    ).toEqual({ Mushroom: 0, Beetle: 0, Mud: 0, Artefact: 0 });
  });
});

const GOLDEN_MUSHROOM = ["DMDMD", "MMMDD", "DDDDD", "DDMbD", "DDDuX"];
const GOLDEN_BEETLE = ["DMDDb", "DDDDb", "MMbDD", "DuDDD", "DXDDD"];
