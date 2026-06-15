import { EXPANSION_ORIGINS, LAND_SIZE, getLandLeftEdge } from "./constants";
import { isOverlapping } from "../placeable/lib/collisionDetection";

/**
 * Front-end mirror of the island anchoring on the server. Both sides MUST agree
 * so the optimistic, on-save re-anchor (see the game machine) matches the
 * authoritative result that comes back, with no snap-back.
 */

// How far (in tiles) the island's anchor sits to the left of the land's left
// edge. The island art is ~3 tiles wide, leaving a ~3-tile water gap.
const ISLAND_GAP_FROM_LAND = 6;

// The island stops tracking once the land reaches its fully-expanded layout.
const MAX_EXPANSIONS = 42;

/**
 * Left-most (anchor) tile of the small island. Anchored off the NEXT
 * expansion's edge (`expansionCount + 1`) so it clears the upcoming-expansion
 * scaffolding, capped at the fully-expanded layout.
 */
export const getIslandAnchorX = (expansionCount: number): number =>
  getLandLeftEdge(Math.min(expansionCount + 1, MAX_EXPANSIONS)) -
  ISLAND_GAP_FROM_LAND;

/**
 * Fixed 1x1 spawn spots on the island, relative to the anchor: `dx` tiles right
 * of the anchor and an absolute `y`.
 */
const ISLAND_SPAWN_LAYOUT = [
  { dx: 2, y: 5 },
  { dx: 2, y: 4 },
  { dx: 1, y: 3 },
  { dx: 1, y: 4 },
  { dx: 1, y: 5 },
  { dx: 1, y: 6 },
  { dx: 0, y: 4 },
  { dx: 0, y: 5 },
] as const;

/** The island's spawn tiles for a given expansion count. */
export const getIslandSpawnPositions = (
  expansionCount: number,
): { x: number; y: number }[] => {
  const anchorX = getIslandAnchorX(expansionCount);

  return ISLAND_SPAWN_LAYOUT.map(({ dx, y }) => ({ x: anchorX + dx, y }));
};

// A 1x1 tile is on the main land if it overlaps any active expansion. Mirrors
// the server's extractExpansionBoundingBoxes + isOverlapping check.
const isOnLand = (x: number, y: number, expansionCount: number): boolean => {
  for (let i = 0; i < expansionCount; i++) {
    const origin = EXPANSION_ORIGINS[i];
    if (!origin) continue;

    const overlapsExpansion = isOverlapping(
      { x, y, width: 1, height: 1 },
      {
        x: origin.x - LAND_SIZE / 2,
        y: origin.y + LAND_SIZE / 2,
        width: LAND_SIZE,
        height: LAND_SIZE,
      },
    );
    if (overlapsExpansion) return true;
  }

  return false;
};

/**
 * Snaps island items onto the island's current tiles so they follow it as the
 * land — and therefore the island — grows.
 *
 * Items already on a current island tile keep their exact position (a no-op
 * when the island hasn't moved). Items on the main land are left where they are
 * (they belong to the land). Only off-land items — island items stranded in
 * open water after the island shifted — are relocated onto a free island tile,
 * keeping their other fields. Items never share a tile; if the island runs out
 * of free tiles the item is left in place. Mirrors the server's `reAnchorToIsland`.
 */
export const reAnchorToIsland = <T extends { x: number; y: number }>(
  items: Record<string, T>,
  expansionCount: number,
): Record<string, T> => {
  const islandPositions = getIslandSpawnPositions(expansionCount);
  const islandTileKeys = new Set(islandPositions.map((p) => `${p.x},${p.y}`));

  const result: Record<string, T> = {};
  const taken = new Set<string>();
  const toMove: string[] = [];

  for (const [id, item] of Object.entries(items)) {
    const key = `${item.x},${item.y}`;
    if (islandTileKeys.has(key) && !taken.has(key)) {
      result[id] = item;
      taken.add(key);
    } else if (isOnLand(item.x, item.y, expansionCount)) {
      result[id] = item;
    } else {
      toMove.push(id);
    }
  }

  for (const id of toMove) {
    const slot = islandPositions.find((p) => !taken.has(`${p.x},${p.y}`));
    if (!slot) {
      result[id] = items[id];
      continue;
    }
    taken.add(`${slot.x},${slot.y}`);
    result[id] = { ...items[id], x: slot.x, y: slot.y };
  }

  return result;
};
