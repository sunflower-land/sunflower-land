/**
 * Depth bands, mirroring the DOM farm's paint order (Land.tsx):
 * ocean background, then (inside the origin-centred wrapper, painted in DOM
 * order) land base (-z-10), dirt, water decor, entities; background islands
 * (z-10), dynamic clouds (z-20) and the static cloud frame (z-30) paint above
 * — the frame is the vignette at the board's edges.
 *
 * Entities (Phase 2+) get ENTITY_BASE + worldY for painter's-algorithm order,
 * so their band must comfortably contain worldY's range (±~1000 at 42
 * expansions).
 */
export const DEPTHS = {
  OCEAN: -10_000,
  LAND_BASE: -9_000,
  DIRT: -8_500,
  WATER_DECOR: -8_000,
  ENTITY_BASE: 0,
  ALWAYS_ON_TOP: 5_000, // mushrooms' z=99999 equivalent, above entity band
  BACKGROUND_ISLANDS: 10_000,
  DYNAMIC_CLOUDS: 11_000,
  STATIC_CLOUDS: 12_000,
} as const;
