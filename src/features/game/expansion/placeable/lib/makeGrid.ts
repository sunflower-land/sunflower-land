import { CollectibleName } from "features/game/types/craftables";

/**
 * Convert game items onto a X,Y Grid
 * This is useful for items that depend on similar items placed nearby
 * E.g. A fence shape is altered if it has a fence to its left
 */

/**
 * X + Y Coordinates
 * { 1: { 2: "Fence"} , 2: { 2: "Dirt Path", 3: "Dirt Path" }}
 */
export type GameGrid = Record<number, Record<number, CollectibleName>>;

function isFence(name: CollectibleName) {
  return (
    name === "Fence" ||
    name === "Stone Fence" ||
    name === "Golden Fence" ||
    name === "Golden Stone Fence"
  );
}

export function getGameGrid({
  cropPositions = [],
  collectiblePositions = [],
}: {
  cropPositions: { x: number; y: number }[];
  collectiblePositions: {
    x: number;
    y: number;
    name: CollectibleName;
  }[];
}) {
  const grid: GameGrid = {};

  cropPositions.forEach(({ x, y }) => {
    if (!grid[x]) {
      grid[x] = {};
    }
    // Only set if empty, fences/collectibles will override as needed
    if (!grid[x][y]) {
      grid[x][y] = "Dirt Path";
    }
  });

  collectiblePositions.forEach(({ x, y, name }) => {
    if (!grid[x]) {
      grid[x] = {};
    }

    const existing = grid[x][y];

    if (isFence(existing) && !isFence(name)) {
      // Keep existing fence, don't let non-fence overwrite
      return;
    }

    // Prefer fences, allow fence to replace non-fence or empty
    if (isFence(name)) {
      grid[x][y] = name;
      return;
    }

    // If not a fence, only set when empty or not already a fence
    if (!existing) {
      grid[x][y] = name;
    }
  });

  return grid;
}
