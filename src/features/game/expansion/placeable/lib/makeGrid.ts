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
    grid[x][y] = "Dirt Path";
  });

  collectiblePositions.forEach(({ x, y, name }) => {
    if (!grid[x]) {
      grid[x] = {};
    }
    grid[x][y] = name;
  });

  return grid;
}
