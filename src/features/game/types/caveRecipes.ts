import Decimal from "decimal.js-light";
import type { CaveBatch, CaveRecipeName, InventoryItemName } from "./game";

export type { CaveRecipeName };

/** Every Myco-Composter patch is a 5x5 grid — 25 buried tiles. */
export const CAVE_PATCH_WIDTH = 5;
export const CAVE_PATCH_TILE_COUNT = CAVE_PATCH_WIDTH * CAVE_PATCH_WIDTH;

/** Sand Shovels spent per Cave dig. Fixed — no wearable or boost changes it. */
export const CAVE_DIG_SHOVEL_COST = 1;

/** Sand Drills spent per Cave drill (a 2x2 square). Fixed, like the shovel. */
export const CAVE_DRILL_COST = 1;

/**
 * How long a batch grows before its patch is ready to dig. Fixed 12h — existing
 * time boosts (shrines, hourglasses, SPEED_BOOSTS) do NOT apply; only the future
 * Cave skill will shorten it.
 */
export const CAVE_BATCH_DURATION_MS = 12 * 60 * 60 * 1000;

/**
 * A buried tile's kind. `Artefact` is the single guaranteed chapter-artefact
 * tile; it becomes a `Mud` tile when no chapter artefact is active.
 */
export type CaveTileType = "Mushroom" | "Beetle" | "Mud" | "Artefact";

export type CaveRecipe = {
  /**
   * How the 25 buried tiles split by kind. Always sums to `CAVE_PATCH_TILE_COUNT`
   * (Mushroom + Beetle + Mud + 1 Artefact). Mushroom tiles never hold a Beetle.
   */
  composition: Record<CaveTileType, number>;
  /** Yield multiplier applied to each Mud tile when dug (Mud recipe = 2). */
  mudYieldMultiplier: number;
  /**
   * Inputs consumed to start a batch. Placeholder values — TODO(Cave balance
   * 425): one simple item per recipe until the balance pass sets real costs.
   */
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
};

/**
 * The three Myco-Composter recipes. `composition` describes what a patch buries
 * (see `generateCavePatch`). Both repos keep this file byte-identical.
 */
export const CAVE_RECIPES: Record<CaveRecipeName, CaveRecipe> = {
  Mushroom: {
    composition: { Mushroom: 6, Beetle: 2, Mud: 16, Artefact: 1 },
    mudYieldMultiplier: 1,
    ingredients: { Carrot: new Decimal(10) },
  },
  Beetle: {
    composition: { Mushroom: 3, Beetle: 4, Mud: 17, Artefact: 1 },
    mudYieldMultiplier: 1,
    ingredients: { Egg: new Decimal(10) },
  },
  Mud: {
    composition: { Mushroom: 3, Beetle: 2, Mud: 19, Artefact: 1 },
    mudYieldMultiplier: 2,
    ingredients: { Wood: new Decimal(10) },
  },
};

/**
 * The effective tile counts buried in a patch. When no chapter artefact is
 * active the single Artefact tile falls back to Mud, so the batch preview and
 * the server generator always agree on what the player will find.
 */
export function getCaveTileCounts(
  recipe: CaveRecipeName,
  artefactActive: boolean,
): Record<CaveTileType, number> {
  const { composition } = CAVE_RECIPES[recipe];
  if (artefactActive) return { ...composition };
  return {
    ...composition,
    Artefact: 0,
    Mud: composition.Mud + composition.Artefact,
  };
}

/** The "x,y" key of a tile in local patch coordinates (0..4 each). */
export function caveTileKey(x: number, y: number): string {
  return `${x},${y}`;
}

/** True for integer patch coordinates within the 5x5 grid. */
export function isCaveTileInPatch(x: number, y: number): boolean {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    y >= 0 &&
    x < CAVE_PATCH_WIDTH &&
    y < CAVE_PATCH_WIDTH
  );
}

/**
 * True for four distinct tiles forming a 2x2 square, in any order. Says
 * nothing about the patch bounds — check each tile with `isCaveTileInPatch`.
 */
export function isCave2x2Square(coords: { x: number; y: number }[]): boolean {
  if (coords.length !== 4) return false;
  if (new Set(coords.map(({ x, y }) => caveTileKey(x, y))).size !== 4) {
    return false;
  }

  const xs = [...new Set(coords.map(({ x }) => x))].sort((a, b) => a - b);
  const ys = [...new Set(coords.map(({ y }) => y))].sort((a, b) => a - b);
  const isConsecutive = (values: number[]) =>
    values.length === 2 && values[1] === values[0] + 1;

  return isConsecutive(xs) && isConsecutive(ys);
}

/**
 * The 2x2 square a Sand Drill digs from tile (x, y): (x, y) is its top-left,
 * pulled in from the right and bottom edges so the square stays in the patch.
 */
export function getCaveDrillSquare(
  x: number,
  y: number,
): { x: number; y: number }[] {
  const left = Math.min(Math.max(x, 0), CAVE_PATCH_WIDTH - 2);
  const top = Math.min(Math.max(y, 0), CAVE_PATCH_WIDTH - 2);
  return [
    { x: left, y: top },
    { x: left + 1, y: top },
    { x: left, y: top + 1 },
    { x: left + 1, y: top + 1 },
  ];
}

/** Every tile of the patch has been dug, so a new batch may start. */
export function isCavePatchCleared(batch: CaveBatch): boolean {
  return Object.keys(batch.dug ?? {}).length >= CAVE_PATCH_TILE_COUNT;
}
