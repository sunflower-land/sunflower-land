import type { PlaceableLocation } from "features/game/types/collectibles";

/**
 * A surface the engine can render. Most are placement surfaces the game
 * already names (`PlaceableLocation`); the greenhouse, the animal houses and
 * the cave are rooms with fixed furniture rather than grids, so they exist
 * only here.
 */
export type FarmSurface =
  | PlaceableLocation
  | "greenhouse"
  | "barn"
  | "henHouse"
  | "pigpen"
  | "cave";

/** Surfaces where items are placed on a grid (i.e. landscaping applies). */
export const isPlacementSurface = (
  surface: FarmSurface,
): surface is PlaceableLocation =>
  surface !== "greenhouse" &&
  surface !== "barn" &&
  surface !== "henHouse" &&
  surface !== "pigpen" &&
  surface !== "cave";
