import type { GameState } from "features/game/types/game";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { getDirtImage } from "features/game/expansion/components/DirtRenderer";
import {
  getSortedCollectiblePositions,
  getSortedResourcePositions,
} from "features/game/expansion/lib/utils";
import type { LandBiomeName } from "features/island/biomes/biomes";

/**
 * Pure derivation for the dirt autotiling layer — kept free of Phaser imports
 * so it's testable under jsdom. All the real logic is imported from the game
 * layer: the grid from getGameGrid, the per-tile edge art from getDirtImage.
 */

export type DirtSlice = {
  crops: GameState["crops"];
  collectibles: GameState["collectibles"];
  biome: LandBiomeName;
};

export type DirtTile = { x: number; y: number; texture: string };

/** Every dirt cell the slice implies, with its autotiled edge texture. */
export function getDirtTiles({
  crops,
  collectibles,
  biome,
}: DirtSlice): DirtTile[] {
  const grid = getGameGrid({
    cropPositions: getSortedResourcePositions(crops),
    collectiblePositions: getSortedCollectiblePositions(collectibles),
  });

  const tiles: DirtTile[] = [];
  for (const xKey of Object.keys(grid)) {
    const x = Number(xKey);
    for (const yKey of Object.keys(grid[x])) {
      const y = Number(yKey);
      if (grid[x][y] !== "Dirt Path") continue;
      tiles.push({ x, y, texture: getDirtImage(grid, x, y, biome) });
    }
  }
  return tiles;
}
