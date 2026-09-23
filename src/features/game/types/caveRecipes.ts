import Decimal from "decimal.js-light";
import type { CaveRecipeName, InventoryItemName } from "./game";

export type { CaveRecipeName };

/** Every Myco-Composter patch is a 5x5 grid — 25 buried tiles. */
export const CAVE_PATCH_TILE_COUNT = 25;

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
 * The three Myco-Composter recipes. `composition` describes what the BE buries
 * in the hidden 5x5 layout; the FE never sees positions, only reads counts from
 * here. Both repos keep this file byte-identical.
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
