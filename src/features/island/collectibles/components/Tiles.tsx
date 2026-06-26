import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";

import type { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import blackTile from "assets/decorations/tiles/black_tile.webp";
import blueTile from "assets/decorations/tiles/blue_tile.webp";
import greenTile from "assets/decorations/tiles/green_tile.webp";
import purpleTile from "assets/decorations/tiles/purple_tile.webp";
import redTile from "assets/decorations/tiles/red_tile.webp";
import yellowTile from "assets/decorations/tiles/yellow_tile.webp";

import blackTileConnected from "assets/decorations/tiles/connectedTile/black_tile.webp";
import blueTileConnected from "assets/decorations/tiles/connectedTile/blue_tile.webp";
import greenTileConnected from "assets/decorations/tiles/connectedTile/green_tile.webp";
import purpleTileConnected from "assets/decorations/tiles/connectedTile/purple_tile.webp";
import redTileConnected from "assets/decorations/tiles/connectedTile/red_tile.webp";
import yellowTileConnected from "assets/decorations/tiles/connectedTile/yellow_tile.webp";
import type { TileName } from "features/game/types/decorations";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

const TILES: Record<TileName, string> = {
  "Black Tile": blackTile,
  "Blue Tile": blueTile,
  "Green Tile": greenTile,
  "Purple Tile": purpleTile,
  "Red Tile": redTile,
  "Yellow Tile": yellowTile,
};

const CONNECTED_TILES: Record<TileName, string> = {
  "Black Tile": blackTileConnected,
  "Blue Tile": blueTileConnected,
  "Green Tile": greenTileConnected,
  "Purple Tile": purpleTileConnected,
  "Red Tile": redTileConnected,
  "Yellow Tile": yellowTileConnected,
};

/** Every connecting colour-tile name, derived from {@link TILES}. */
export const TILE_NAMES: Set<string> = new Set(Object.keys(TILES));
type Edges = {
  connected: boolean;
};

interface Props {
  name: TileName;
  x: number;
  y: number;
  grid: GameGrid;
}

/** The tile sprite for (x,y) — its connected variant when a tile sits below. */
export function getTileImage(
  name: TileName,
  grid: GameGrid,
  x: number,
  y: number,
): string {
  const edges: Edges = {
    connected: Object.keys(TILES).includes(grid[x]?.[y - 1]),
  };

  if (edges.connected && CONNECTED_TILES[name]) {
    return CONNECTED_TILES[name];
  }
  return TILES[name];
}

export const Tiles: React.FC<Props> = ({ name, x, y, grid }) => {
  const image = getTileImage(name, grid, x, y);

  return (
    <SFTDetailPopover name={name}>
      <img
        className="absolute"
        src={image}
        key={`${x}_${y}`}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
      />
    </SFTDetailPopover>
  );
};
