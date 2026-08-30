import type { PlaceableLocation } from "features/game/types/collectibles";

/**
 * A surface the engine can render. Most are placement surfaces the game
 * already names (`PlaceableLocation`); the greenhouse and the animal houses
 * are rooms with fixed furniture rather than grids, so they exist only here.
 */
export type FarmSurface =
  | PlaceableLocation
  | "greenhouse"
  | "barn"
  | "henHouse";

/** Surfaces where items are placed on a grid (i.e. landscaping applies). */
export const isPlacementSurface = (
  surface: FarmSurface,
): surface is PlaceableLocation =>
  surface !== "greenhouse" && surface !== "barn" && surface !== "henHouse";
