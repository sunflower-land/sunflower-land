import type { SavedLayout } from "features/game/types/game";
import type { CollectibleName } from "features/game/types/craftables";
import type { TileName } from "features/game/types/decorations";
import {
  getGameGrid,
  type GameGrid,
} from "features/game/expansion/placeable/lib/makeGrid";
import { getObjectEntries } from "lib/object";
import { getFenceImage } from "features/island/collectibles/components/Fence";
import { getGoldenFenceImage } from "features/island/collectibles/components/GoldenFence";
import { getStoneFenceImage } from "features/island/collectibles/components/StoneFence";
import { getGoldenStoneFenceImage } from "features/island/collectibles/components/GoldenStoneFence";
import { getTileImage } from "features/island/collectibles/components/Tiles";

const TILE_NAMES = new Set<string>([
  "Black Tile",
  "Blue Tile",
  "Green Tile",
  "Purple Tile",
  "Red Tile",
  "Yellow Tile",
] satisfies TileName[]);

/**
 * Build the {@link GameGrid} (id-by-tile map) a layout's fences/paths need to
 * pick their connecting sprites. Crops are included so the dirt layer draws them
 * as regular plots that join up with the Dirt Path decorations — just like the
 * farm — instead of a separate (misaligned) Crop Plot sprite.
 */
export function layoutGrid(
  layout: Pick<SavedLayout, "collectibles" | "resources">,
): GameGrid {
  const collectiblePositions: {
    x: number;
    y: number;
    name: CollectibleName;
  }[] = [];
  getObjectEntries(layout.collectibles).forEach(([name, entries]) => {
    entries?.forEach(({ coordinates }) =>
      collectiblePositions.push({ name, x: coordinates.x, y: coordinates.y }),
    );
  });

  const cropPositions = Object.values(layout.resources.crops ?? {}).map(
    ({ x, y }) => ({ x, y }),
  );

  return getGameGrid({ cropPositions, collectiblePositions });
}

/**
 * Tiles the {@link getDirtImage} layer should paint: every `"Dirt Path"` cell —
 * crop plots and Dirt Path decorations alike — so the dirt joins them up.
 */
export function dirtTiles(grid: GameGrid): { x: number; y: number }[] {
  const tiles: { x: number; y: number }[] = [];
  Object.keys(grid).forEach((xKey) => {
    Object.keys(grid[Number(xKey)]).forEach((yKey) => {
      if (grid[Number(xKey)][Number(yKey)] === "Dirt Path") {
        tiles.push({ x: Number(xKey), y: Number(yKey) });
      }
    });
  });
  return tiles;
}

/**
 * The connecting sprite for a collectible that joins to its neighbours (fences,
 * colour tiles). Returns undefined for everything else, so the caller falls back
 * to the item's static sprite. Reuses the live components' selection logic.
 * (`Dirt Path` is handled by the dirt layer, not here.)
 */
export function connectedCollectibleImage(
  name: string,
  grid: GameGrid,
  x: number,
  y: number,
): string | undefined {
  switch (name) {
    case "Fence":
      return getFenceImage(grid, x, y);
    case "Golden Fence":
      return getGoldenFenceImage(grid, x, y);
    case "Stone Fence":
      return getStoneFenceImage(grid, x, y);
    case "Golden Stone Fence":
      return getGoldenStoneFenceImage(grid, x, y);
    default:
      return TILE_NAMES.has(name)
        ? getTileImage(name as TileName, grid, x, y)
        : undefined;
  }
}
