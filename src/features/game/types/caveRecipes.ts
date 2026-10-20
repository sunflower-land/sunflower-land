import Decimal from "decimal.js-light";
import type { CaveBatch, CaveRecipeName, InventoryItemName } from "./game";

export type { CaveRecipeName };

/** Every Myco Bin patch is a 5x5 grid — 25 buried tiles. */
export const CAVE_PATCH_WIDTH = 5;
export const CAVE_PATCH_TILE_COUNT = CAVE_PATCH_WIDTH * CAVE_PATCH_WIDTH;

/** Sand Shovels spent per Cave dig. Fixed — no wearable or boost changes it. */
export const CAVE_DIG_SHOVEL_COST = 1;

/** Sand Drills spent per Cave drill (a 2x2 square). Fixed, like the shovel. */
export const CAVE_DRILL_COST = 1;

/**
 * How long a batch grows before its patch is ready to dig, before Cave skills.
 * Existing time boosts (shrines, hourglasses, SPEED_BOOSTS) do NOT apply; only
 * the Rapid Mycelium Cave skill shortens it (`getCaveBatchDuration`).
 */
export const CAVE_BATCH_DURATION_MS = 12 * 60 * 60 * 1000;

/**
 * A farm's first batch grows in 10 minutes instead (no Cave skills) and must
 * be the Mushroom mix, so the Cave tutorial reaches digging in one sitting.
 * See `isFirstCaveBatch`.
 */
export const CAVE_FIRST_BATCH_DURATION_MS = 10 * 60 * 1000;
export const CAVE_FIRST_BATCH_RECIPE: CaveRecipeName = "Mushroom";

/**
 * A buried tile's kind. Cave patches hold no Chapter Artefact (#7721); the
 * artefact comes from Desert digging only.
 */
export type CaveTileType = "Mushroom" | "Beetle" | "Mud";

export type CaveRecipe = {
  /**
   * How the 25 buried tiles split by kind (#7721). Always sums to
   * `CAVE_PATCH_TILE_COUNT`. Mushroom tiles never hold a Beetle.
   */
  composition: Record<CaveTileType, number>;
  /** Yield multiplier applied to each Mud tile when dug (Mud recipe = 2). */
  mudYieldMultiplier: number;
  /**
   * Fixed inputs consumed to start a batch. Empty for the Mud recipe, whose
   * input is one crop the player picks (`CAVE_MUD_CROPS`) — read a batch's
   * cost through `getCaveBatchCost` (Cave skills included), never from here.
   */
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
};

/**
 * The three Myco Bin recipes. `composition` describes what a patch buries
 * (see `generateCavePatch`). Both repos keep this file byte-identical.
 */
export const CAVE_RECIPES: Record<CaveRecipeName, CaveRecipe> = {
  Mushroom: {
    composition: { Mushroom: 6, Beetle: 2, Mud: 17 },
    mudYieldMultiplier: 1,
    ingredients: { Wood: new Decimal(10) },
  },
  Beetle: {
    composition: { Mushroom: 3, Beetle: 5, Mud: 17 },
    mudYieldMultiplier: 1,
    ingredients: { Egg: new Decimal(30) },
  },
  Mud: {
    composition: { Mushroom: 3, Beetle: 2, Mud: 20 },
    mudYieldMultiplier: 2,
    ingredients: {},
  },
};

/**
 * The Mud recipe's input: ONE crop per batch, in the amount worth 10 Carrots
 * (#7721 equivalency table). Owning the crop is the only restriction — the
 * table grants no access to seasonal or event crops.
 */
export const CAVE_MUD_CROPS = {
  Sunflower: 500,
  Potato: 80,
  Rhubarb: 40,
  Pumpkin: 20,
  Zucchini: 20,
  Carrot: 10,
  Yam: 10,
  Cabbage: 5,
  Broccoli: 5,
  Soybean: 3,
  Beetroot: 3,
  Pepper: 3,
  Cauliflower: 2,
  Parsnip: 2,
  Eggplant: 2,
  Corn: 2,
  Onion: 2,
  Wheat: 2,
  Turnip: 2,
  Radish: 2,
  Kale: 2,
  Artichoke: 2,
  Barley: 2,
  Rice: 1,
  Olive: 1,
} satisfies Partial<Record<InventoryItemName, number>>;

export type CaveMudCropName = keyof typeof CAVE_MUD_CROPS;

/** Own-key check, so inherited names like "constructor" never pass. */
export function isCaveMudCrop(item: unknown): item is CaveMudCropName {
  return (
    typeof item === "string" &&
    Object.prototype.hasOwnProperty.call(CAVE_MUD_CROPS, item)
  );
}

/**
 * What a batch costs: the recipe's fixed inputs, or for Mud the chosen crop.
 * `undefined` when the crop does not fit the recipe — Mud needs a table crop,
 * the other recipes take none.
 */
export function getCaveBatchIngredients(
  recipe: CaveRecipeName,
  crop?: string,
): Partial<Record<InventoryItemName, Decimal>> | undefined {
  if (recipe !== "Mud") {
    return crop === undefined ? CAVE_RECIPES[recipe].ingredients : undefined;
  }

  if (!isCaveMudCrop(crop)) return undefined;
  return { [crop]: new Decimal(CAVE_MUD_CROPS[crop]) };
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
