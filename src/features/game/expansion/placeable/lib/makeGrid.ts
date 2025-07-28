import { CollectibleName, getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

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
  crops,
  collectibles,
}: Pick<GameState, "crops" | "collectibles">) {
  const grid: GameGrid = {};

  getKeys(crops || {}).forEach((plotIndex) => {
    const coords = crops[plotIndex] ?? { x: 0, y: 0 };

    if (!coords.x || !coords.y) return;

    if (!grid[coords.x]) {
      grid[coords.x] = {};
    }

    grid[coords.x][coords.y] = "Dirt Path";
  });

  getKeys(collectibles).forEach((name) => {
    collectibles[name]?.forEach(({ coordinates }) => {
      if (!grid[coordinates.x]) {
        grid[coordinates.x] = {};
      }

      grid[coordinates.x][coordinates.y] = name;
    });
  });

  return grid;
}
