import type {
  CaveBatch,
  CaveBatchSkills,
  CaveDugTile,
  InventoryItemName,
} from "./game";
import type { MushroomName } from "./resources";
import {
  CAVE_PATCH_WIDTH,
  CAVE_RECIPES,
  caveTileKey,
  isCavePatchCleared,
  isCaveTileInPatch,
  parseCaveTileKey,
  type CaveRecipeName,
  type CaveTileType,
} from "./caveRecipes";
import { BEETLES, type BeetleName } from "./beetles";

// Both repos keep this file byte-identical: the FE and BE must build the same
// board from the same seed.

/** A single tile of a Cave patch. */
export type CaveTile =
  | { type: "Mushroom"; mushroom: MushroomName }
  | { type: "Beetle"; beetle: BeetleName }
  | { type: "Mud"; amount: number };

/** The 25 tiles of a patch keyed "x,y" (local patch coordinates, 0..4). */
export type CavePatchLayout = Record<string, CaveTile>;

/** What digging a tile awards, and its clue (every tile but a Beetle). */
export type ResolvedCaveTile = {
  type: CaveTileType;
  items: Partial<Record<InventoryItemName, number>>;
  clue?: number;
};

/**
 * Commonest-first Beetle rarity weights (percent). Matches `BEETLES` order. The
 * Rare Breeds skill replaces them with the batch's `skills.beetleRarity`.
 */
export const BEETLE_RARITY_WEIGHTS: Record<BeetleName, number> = {
  "Green Beetle": 40,
  "Blue Beetle": 30,
  "Pink Beetle": 20,
  "Amber Beetle": 10,
};

/** Mushrooms from one Mushroom tile before boosts (#7721: one). */
export const CAVE_MUSHROOM_YIELD = 1;
const BEETLE_YIELD = 1;

/** Chance a Mushroom tile holds a Magic rather than a Wild Mushroom (#7721). */
export const CAVE_MAGIC_MUSHROOM_CHANCE = 0.1;

/** A Cave board seed: 128 random bits as 32 lowercase hex characters. */
export function isCaveSeed(seed: unknown): seed is string {
  return typeof seed === "string" && /^[0-9a-f]{32}$/.test(seed);
}

/**
 * sfc32 over four 32-bit words (128 bits of state). Integer-only maths, so
 * every JS engine produces the same stream from the same words.
 */
function sfc32(a: number, b: number, c: number, d: number): () => number {
  const next = () => {
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };

  // Mix the seed in before use, as sfc32 recommends.
  for (let i = 0; i < 15; i += 1) next();

  return next;
}

/** The seed's four 32-bit words. */
function seedWords(seed: string): [number, number, number, number] {
  if (!isCaveSeed(seed)) {
    throw new Error("Invalid Cave seed");
  }
  const word = (i: number) => parseInt(seed.slice(i * 8, i * 8 + 8), 16) | 0;
  return [word(0), word(1), word(2), word(3)];
}

/**
 * The random source for the seed's own board (`generateCavePatch`), seeded
 * with the whole 128-bit seed so it cannot be recovered by trying every value.
 */
export function createCaveRandom(seed: string): () => number {
  const [a, b, c, d] = seedWords(seed);
  return sfc32(a, b, c, d);
}

/**
 * The random source for one dig: the seed mixed with the dig's millisecond and
 * tile. Both repos run the dig with the action's own `createdAt`, so they draw
 * the same board; a dig replayed after a rollback happens at a different
 * millisecond, so it draws a different one and what the player saw before the
 * rollback tells them nothing.
 */
export function createCaveDigRandom({
  seed,
  createdAt,
  x,
  y,
}: {
  seed: string;
  createdAt: number;
  x: number;
  y: number;
}): () => number {
  const [a, b, c, d] = seedWords(seed);
  const low = createdAt >>> 0;
  const high = Math.floor(createdAt / 4294967296) | 0;
  const tile = Math.imul(y * CAVE_PATCH_WIDTH + x + 1, 0x9e3779b9);
  return sfc32(a ^ low, b ^ high, c ^ tile, d);
}

function rollBeetle(
  random: () => number,
  weights: Record<BeetleName, number>,
): BeetleName {
  const roll = random() * 100;
  let cumulative = 0;
  for (const beetle of BEETLES) {
    cumulative += weights[beetle];
    if (roll < cumulative) return beetle;
  }
  return BEETLES[BEETLES.length - 1];
}

/**
 * How a patch's 25 tiles split by kind: the recipe's composition, with the
 * batch's extra Mushroom and Beetle tiles taken from its Mud.
 */
export function getCavePatchComposition(
  recipe: CaveRecipeName,
  skills: CaveBatchSkills = {},
): Record<CaveTileType, number> {
  const { Mushroom, Beetle, Mud } = CAVE_RECIPES[recipe].composition;
  const { extraMushroomTiles = 0, extraBeetleTiles = 0 } = skills;

  return {
    Mushroom: Mushroom + extraMushroomTiles,
    Beetle: Beetle + extraBeetleTiles,
    Mud: Mud - extraMushroomTiles - extraBeetleTiles,
  };
}

/**
 * Build a patch's board from its seed. The seed is rolled by the server when
 * the batch starts, so it cannot be chosen or ground by the player. `skills`
 * is the batch's snapshot of the board-shaping Cave skills.
 */
export function generateCavePatch({
  recipe,
  seed,
  skills,
}: {
  recipe: CaveRecipeName;
  seed: string;
  skills?: CaveBatchSkills;
}): CavePatchLayout {
  const random = createCaveRandom(seed);
  const { mudYieldMultiplier } = CAVE_RECIPES[recipe];
  const counts = getCavePatchComposition(recipe, skills);
  const beetleWeights = skills?.beetleRarity ?? BEETLE_RARITY_WEIGHTS;

  const bag: CaveTileType[] = [];
  const push = (kind: CaveTileType, count: number) => {
    for (let i = 0; i < count; i += 1) bag.push(kind);
  };
  push("Mushroom", counts.Mushroom);
  push("Beetle", counts.Beetle);
  push("Mud", counts.Mud);

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
        tile = { type: "Beetle", beetle: rollBeetle(random, beetleWeights) };
        break;
      case "Mud":
        tile = { type: "Mud", amount: mudYieldMultiplier };
        break;
      default:
        tile = {
          type: "Mushroom",
          mushroom:
            random() < CAVE_MAGIC_MUSHROOM_CHANCE
              ? "Magic Mushroom"
              : "Wild Mushroom",
        };
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
 * hold a Beetle or a Mushroom, whatever the kind. Read from the board, which
 * digging never changes, so a clue stays the same after they are dug.
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
    const type = layout[caveTileKey(nx, ny)]?.type;
    if (type === "Beetle" || type === "Mushroom") count += 1;
  }
  return count;
}

/** What a tile awards when dug. */
function getCaveTileItems(
  tile: CaveTile,
): Partial<Record<InventoryItemName, number>> {
  switch (tile.type) {
    case "Mushroom":
      return { [tile.mushroom]: CAVE_MUSHROOM_YIELD };
    case "Beetle":
      return { [tile.beetle]: BEETLE_YIELD };
    case "Mud":
      return { Mud: tile.amount };
  }
}

/** What digging tile (x, y) of `layout` awards, and its clue. */
export function resolveCaveTile(
  layout: CavePatchLayout,
  x: number,
  y: number,
): ResolvedCaveTile {
  const tile = layout[caveTileKey(x, y)];
  const items = getCaveTileItems(tile);

  if (tile.type === "Beetle") return { type: "Beetle", items };
  return { type: tile.type, items, clue: getCaveTileClue(layout, x, y) };
}

/** A dug tile as the player saw it: what it held and the clue it showed. */
export type RevealedCaveTile = { tile: CaveTile; clue?: number };

/** What a revealed tile awarded, and its clue. */
export function resolveRevealedCaveTile({
  tile,
  clue,
}: RevealedCaveTile): ResolvedCaveTile {
  const items = getCaveTileItems(tile);
  if (tile.type === "Beetle" || clue === undefined) {
    return { type: tile.type, items };
  }
  return { type: tile.type, items, clue };
}

/**
 * Every dug tile of a batch, keyed "x,y", with what it held and the clue it
 * showed. Tiles dug before boards were sampled recorded neither; they are read
 * from the seed's board, which is what they showed at the time (skipped while
 * the seed is missing, e.g. for a visitor).
 */
export function getRevealedCaveTiles(
  batch: CaveBatch,
): Record<string, RevealedCaveTile> {
  const revealed: Record<string, RevealedCaveTile> = {};
  let initial: CavePatchLayout | undefined;

  for (const [key, record] of Object.entries(batch.dug ?? {})) {
    const at = parseCaveTileKey(key);
    if (!at) continue;

    if (record.tile) {
      revealed[key] =
        record.tile.type === "Beetle" || record.clue === undefined
          ? { tile: record.tile }
          : { tile: record.tile, clue: record.clue };
      continue;
    }

    if (!isCaveSeed(batch.seed)) continue;
    if (!initial) {
      initial = generateCavePatch({
        recipe: batch.recipe,
        seed: batch.seed,
        skills: batch.skills,
      });
    }
    const { x, y } = at;
    const tile = initial[key];
    revealed[key] =
      tile.type === "Beetle"
        ? { tile }
        : { tile, clue: getCaveTileClue(initial, x, y) };
  }

  return revealed;
}

const PATTERNS = Array.from({ length: 1 << CAVE_PATCH_WIDTH }, (_, p) => p);
const bit = (pattern: number, x: number) => (pattern >> x) & 1;

/**
 * Draw a whole board for the batch, uniformly from every board that fits what
 * the player has seen: each dug tile holds what it held, every clue it showed
 * still counts right, and what is still buried is exactly the seed's board
 * minus the dug tiles (so the Beetle species and Magic Mushrooms a batch holds
 * are fixed when it starts, whatever the timing of the digs).
 *
 * Rows are chosen one at a time, each weighted by how many complete boards it
 * can still lead to (counted by a memoised recursion over the next rows), so
 * every fitting board is equally likely. Buried Beetles and Mushrooms are then
 * shuffled over the tiles the draw marked as holding something.
 *
 * Throws `CAVE_RECORDS_FIT_NO_BOARD` if the records cannot be satisfied. Only
 * a corrupt record, or the two repos disagreeing on a record, can cause that:
 * a dig's own records always fit the board it was drawn from. Throwing keeps
 * such a disagreement from paying out quietly.
 */
export const CAVE_RECORDS_FIT_NO_BOARD = "The Cave records fit no board";

/** A tile's kind, for matching what a dug tile held against the buried set. */
function caveTileKind(tile: CaveTile): string {
  switch (tile.type) {
    case "Beetle":
      return `Beetle:${tile.beetle}`;
    case "Mushroom":
      return `Mushroom:${tile.mushroom}`;
    case "Mud":
      return "Mud";
  }
}

export function sampleCavePatch({
  batch,
  random,
}: {
  batch: CaveBatch;
  random: () => number;
}): CavePatchLayout {
  const initial = generateCavePatch({
    recipe: batch.recipe,
    seed: batch.seed as string,
    skills: batch.skills,
  });
  const revealed = getRevealedCaveTiles(batch);
  const { mudYieldMultiplier } = CAVE_RECIPES[batch.recipe];
  const width = CAVE_PATCH_WIDTH;
  const tileCount = width * width;

  // What is still buried: the seed's board minus what the dug tiles held.
  const buried: CaveTile[] = [];
  for (let i = 0; i < tileCount; i += 1) {
    const tile = initial[caveTileKey(i % width, Math.floor(i / width))];
    if (tile.type !== "Mud") buried.push(tile);
  }
  // Each tile's known state: 1 holds something, 0 is Mud, undefined is undug.
  const fixed: (0 | 1 | undefined)[] = Array(tileCount).fill(undefined);
  const clues: (number | undefined)[] = Array(tileCount).fill(undefined);
  let dugCount = 0;
  for (const [key, { tile, clue }] of Object.entries(revealed)) {
    // Keys off the patch never reach here: getRevealedCaveTiles drops them.
    const { x, y } = parseCaveTileKey(key)!;
    const i = y * width + x;
    dugCount += 1;
    if (tile.type === "Mud") {
      fixed[i] = 0;
    } else {
      fixed[i] = 1;
      const kind = caveTileKind(tile);
      const at = buried.findIndex(
        (candidate) => caveTileKind(candidate) === kind,
      );
      if (at < 0) throw new Error(CAVE_RECORDS_FIT_NO_BOARD);
      buried.splice(at, 1);
    }
    if (tile.type !== "Beetle" && clue !== undefined) clues[i] = clue;
  }
  const remaining = buried.length;
  if (remaining > tileCount - dugCount) {
    throw new Error(CAVE_RECORDS_FIT_NO_BOARD);
  }

  // Row patterns that agree with the dug tiles of that row, and how many
  // undug tiles each marks as holding something.
  const candidates = Array.from({ length: width }, (_, r) =>
    PATTERNS.filter((p) => {
      for (let x = 0; x < width; x += 1) {
        const known = fixed[r * width + x];
        if (known !== undefined && bit(p, x) !== known) return false;
      }
      return true;
    }),
  );
  const undugFull = (r: number, p: number) => {
    let count = 0;
    for (let x = 0; x < width; x += 1) {
      if (fixed[r * width + x] === undefined && bit(p, x)) count += 1;
    }
    return count;
  };
  const rowHasClue = Array.from({ length: width }, (_, r) =>
    clues.slice(r * width, (r + 1) * width).some((c) => c !== undefined),
  );
  // Every clue of row `r` counts right, given the rows above and below it
  // (0 for the rows off the board).
  const rowCluesOk = (r: number, above: number, row: number, below: number) => {
    if (!rowHasClue[r]) return true;
    for (let x = 0; x < width; x += 1) {
      const clue = clues[r * width + x];
      if (clue === undefined) continue;
      const count =
        bit(above, x) +
        bit(below, x) +
        (x > 0 ? bit(row, x - 1) : 0) +
        (x < width - 1 ? bit(row, x + 1) : 0);
      if (count !== clue) return false;
    }
    return true;
  };

  // ways(r, above, row, count): how many ways rows r+1.. can be filled, given
  // rows r-1 and r and `count` undug tiles holding something in rows 0..r.
  // The row above only matters through row r's clues.
  const counts = remaining + 1;
  const memo = new Float64Array(width * PATTERNS.length ** 2 * counts).fill(-1);
  const ways = (
    r: number,
    above: number,
    row: number,
    count: number,
  ): number => {
    if (count > remaining) return 0;
    if (r === width - 1) {
      return rowCluesOk(r, above, row, 0) && count === remaining ? 1 : 0;
    }
    const key =
      ((r * PATTERNS.length + (rowHasClue[r] ? above : 0)) * PATTERNS.length +
        row) *
        counts +
      count;
    if (memo[key] >= 0) return memo[key];

    let total = 0;
    for (const below of candidates[r + 1]) {
      if (!rowCluesOk(r, above, row, below)) continue;
      total += ways(r + 1, row, below, count + undugFull(r + 1, below));
    }
    memo[key] = total;
    return total;
  };

  const rows: number[] = [];
  let count = 0;
  for (let r = 0; r < width; r += 1) {
    const above = r >= 2 ? rows[r - 2] : 0;
    const previous = r >= 1 ? rows[r - 1] : 0;
    const options = candidates[r].map((p) => ({
      p,
      weight:
        r > 0 && !rowCluesOk(r - 1, above, previous, p)
          ? 0
          : ways(r, previous, p, count + undugFull(r, p)),
    }));
    const total = options.reduce((sum, { weight }) => sum + weight, 0);
    if (total === 0) throw new Error(CAVE_RECORDS_FIT_NO_BOARD);

    let pick = random() * total;
    let chosen = options[options.length - 1].p;
    for (const { p, weight } of options) {
      if (weight === 0) continue;
      pick -= weight;
      if (pick < 0) {
        chosen = p;
        break;
      }
    }
    rows.push(chosen);
    count += undugFull(r, chosen);
  }

  // Fisher-Yates shuffle of what is still buried over the tiles that hold it.
  for (let i = buried.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [buried[i], buried[j]] = [buried[j], buried[i]];
  }

  const layout: CavePatchLayout = {};
  let next = 0;
  for (let i = 0; i < tileCount; i += 1) {
    const x = i % width;
    const y = Math.floor(i / width);
    const key = caveTileKey(x, y);
    if (revealed[key]) {
      layout[key] = revealed[key].tile;
    } else if (bit(rows[y], x)) {
      layout[key] = buried[next];
      next += 1;
    } else {
      layout[key] = { type: "Mud", amount: mudYieldMultiplier };
    }
  }
  return layout;
}

/**
 * The board one dig of tile (x, y) at `createdAt` finds: a fresh draw over
 * everything still buried (`sampleCavePatch`) from the dig's own random
 * source (`createCaveDigRandom`). The dig reads its tile and clue from it and
 * records them; the rest of the board is thrown away.
 */
export function revealCavePatch({
  batch,
  createdAt,
  x,
  y,
}: {
  batch: CaveBatch;
  createdAt: number;
  x: number;
  y: number;
}): CavePatchLayout {
  const random = createCaveDigRandom({
    seed: batch.seed as string,
    createdAt,
    x,
    y,
  });
  return sampleCavePatch({ batch, random });
}

/**
 * The record a dig of tile (x, y) of the board it drew stores: what the tile
 * held and the clue it showed (none for a Beetle). One shape for the shovel
 * and the drill, in both repos.
 */
export function recordCaveDig(
  layout: CavePatchLayout,
  x: number,
  y: number,
  dugAt: number,
): CaveDugTile {
  const tile = layout[caveTileKey(x, y)];
  const { clue } = resolveCaveTile(layout, x, y);
  return clue === undefined ? { dugAt, tile } : { dugAt, tile, clue };
}

/** Beetles dug so far out of the batch's fixed total. */
export function getCaveBeetleProgress(batch: CaveBatch): {
  found: number;
  total: number;
} {
  const total = getCavePatchComposition(batch.recipe, batch.skills).Beetle;
  const found = Object.values(getRevealedCaveTiles(batch)).filter(
    ({ tile }) => tile.type === "Beetle",
  ).length;

  return { found, total };
}

/** What is still buried in a patch, by tile type (never below zero). */
export function getUndugCaveTiles(
  batch: CaveBatch,
): Record<CaveTileType, number> {
  const undug = getCavePatchComposition(batch.recipe, batch.skills);
  for (const { tile } of Object.values(getRevealedCaveTiles(batch))) {
    undug[tile.type] = Math.max(0, undug[tile.type] - 1);
  }
  return undug;
}

/**
 * A new batch may replace this one once every tile is dug, or once every
 * Beetle has been found (whatever else is still buried is discarded).
 */
export function canRestartCaveBatch(batch: CaveBatch): boolean {
  if (isCavePatchCleared(batch)) return true;

  const { found, total } = getCaveBeetleProgress(batch);
  return found >= total;
}
