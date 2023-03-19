import { CollectibleName, getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { EXPANSION_ORIGINS } from "../../lib/constants";

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

export function getGameGrid(game: GameState) {
  const grid: GameGrid = {};

  game.expansions.forEach((expansion, expansionIndex) => {
    getKeys(expansion.plots || {}).forEach((plotIndex) => {
      const coords = expansion.plots?.[plotIndex] ?? { x: 0, y: 0 };

      // TODO - offset with expansion
      const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];
      const x = xOffset + coords.x;
      const y = yOffset + coords.y;
      if (!grid[x]) {
        grid[x] = {};
      }

      grid[x][y] = "Dirt Path";
    });
  });

  getKeys(game.collectibles).forEach((name) => {
    game.collectibles[name]?.forEach(({ coordinates }) => {
      if (!grid[coordinates.x]) {
        grid[coordinates.x] = {};
      }

      grid[coordinates.x][coordinates.y] = name;
    });
  });

  return grid;
}
