import type { CaveBatch, InventoryItemName } from "./game";
import {
  CAVE_PATCH_WIDTH,
  CAVE_RECIPES,
  caveTileKey,
  getCaveTileCounts,
  isCaveTileInPatch,
  type CaveRecipeName,
  type CaveTileType,
} from "./caveRecipes";
import { BEETLES, type BeetleName } from "./beetles";
import { getChapterArtefact } from "./chapters";

// Both repos keep this file byte-identical: the FE and BE must build the same
// board from the same seed.

/** A single tile of a Cave patch. */
export type CaveTile =
  | { type: "Mushroom" }
  | { type: "Beetle"; beetle: BeetleName }
  | { type: "Mud"; amount: number }
  | { type: "Artefact" };

/** The 25 tiles of a patch keyed "x,y" (local patch coordinates, 0..4). */
export type CavePatchLayout = Record<string, CaveTile>;

/** What digging a tile awards, and its clue (every tile but a Beetle). */
export type ResolvedCaveTile = {
  type: CaveTileType;
  items: Partial<Record<InventoryItemName, number>>;
  clue?: number;
};

/** Commonest-first Beetle rarity weights (percent). Matches `BEETLES` order. */
const BEETLE_RARITY_WEIGHTS: Record<BeetleName, number> = {
  "Brown Beetle": 40,
  "Blue Beetle": 30,
  "Pink Beetle": 20,
  "Amber Beetle": 10,
};

// TODO(Cave balance 435): placeholder per-tile yields.
const MUSHROOM_YIELD = 1;
const BEETLE_YIELD = 1;
const ARTEFACT_YIELD = 1;

/**
 * mulberry32: a small 32-bit PRNG. Integer-only maths (`Math.imul`, shifts), so
 * every JS engine produces the same stream from the same seed.
 */
export function createCaveRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rollBeetle(random: () => number): BeetleName {
  const roll = random() * 100;
  let cumulative = 0;
  for (const beetle of BEETLES) {
    cumulative += BEETLE_RARITY_WEIGHTS[beetle];
    if (roll < cumulative) return beetle;
  }
  return BEETLES[BEETLES.length - 1];
}

/**
 * Build a patch's board from its seed. The seed is rolled by the server when
 * the batch starts, so it cannot be chosen or ground by the player.
 */
export function generateCavePatch({
  recipe,
  seed,
}: {
  recipe: CaveRecipeName;
  seed: number;
}): CavePatchLayout {
  const random = createCaveRandom(seed);
  const { mudYieldMultiplier } = CAVE_RECIPES[recipe];
  const counts = getCaveTileCounts(recipe, true);

  const bag: CaveTileType[] = [];
  const push = (kind: CaveTileType, count: number) => {
    for (let i = 0; i < count; i += 1) bag.push(kind);
  };
  push("Mushroom", counts.Mushroom);
  push("Beetle", counts.Beetle);
  push("Mud", counts.Mud);
  push("Artefact", counts.Artefact);

  // Fisher-Yates shuffle.
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  const layout: CavePatchLayout = {};
  bag.forEach((kind, index) => {
    const x = index % CAVE_PATCH_WIDTH;
    const y = Math.floor(index / CAVE_PATCH_WIDTH);
    let tile: CaveTile;
    switch (kind) {
      case "Beetle":
        tile = { type: "Beetle", beetle: rollBeetle(random) };
        break;
      case "Mud":
        tile = { type: "Mud", amount: mudYieldMultiplier };
        break;
      case "Artefact":
        tile = { type: "Artefact" };
        break;
      default:
        tile = { type: "Mushroom" };
    }
    layout[caveTileKey(x, y)] = tile;
  });

  return layout;
}

/** Orthogonal neighbours only: up, down, left and right (no diagonals). */
const CLUE_NEIGHBOURS = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
] as const;

/**
 * How many of a tile's (up to) four orthogonal neighbours in the same patch
 * hold a Beetle, whatever the rarity. Read from the board, which digging never
 * changes, so a clue stays the same after Beetles are dug.
 */
export function getCaveTileClue(
  layout: CavePatchLayout,
  x: number,
  y: number,
): number {
  let count = 0;
  for (const [dx, dy] of CLUE_NEIGHBOURS) {
    const nx = x + dx;
    const ny = y + dy;
    if (!isCaveTileInPatch(nx, ny)) continue;
    if (layout[caveTileKey(nx, ny)]?.type === "Beetle") count += 1;
  }
  return count;
}

/** What digging tile (x, y) awards at `dugAt`, and its clue. */
export function resolveCaveTile(
  layout: CavePatchLayout,
  x: number,
  y: number,
  dugAt: number,
): ResolvedCaveTile {
  const tile = layout[caveTileKey(x, y)];

  switch (tile.type) {
    case "Mushroom":
      return {
        type: "Mushroom",
        items: { "Wild Mushroom": MUSHROOM_YIELD },
        clue: getCaveTileClue(layout, x, y),
      };
    case "Beetle":
      return { type: "Beetle", items: { [tile.beetle]: BEETLE_YIELD } };
    case "Mud":
      return {
        type: "Mud",
        items: { Mud: tile.amount },
        clue: getCaveTileClue(layout, x, y),
      };
    case "Artefact":
      return {
        type: "Artefact",
        items: { [getChapterArtefact(dugAt)]: ARTEFACT_YIELD },
        clue: getCaveTileClue(layout, x, y),
      };
  }
}

/** Beetles dug so far out of the recipe's fixed total. */
export function getCaveBeetleProgress(batch: CaveBatch): {
  found: number;
  total: number;
} {
  const total = CAVE_RECIPES[batch.recipe].composition.Beetle;
  if (batch.seed === undefined) return { found: 0, total };

  const layout = generateCavePatch({ recipe: batch.recipe, seed: batch.seed });
  const found = Object.keys(batch.dug ?? {}).filter(
    (key) => layout[key]?.type === "Beetle",
  ).length;

  return { found, total };
}
