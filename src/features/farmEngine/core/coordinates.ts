import { SQUARE_WIDTH } from "features/game/lib/constants";

/**
 * The farm engine's world units are SOURCE PIXELS: one grid tile is
 * SQUARE_WIDTH (16) world units, and parity zoom comes from the camera
 * (PIXEL_SCALE x user zoom) — sprites are never scaled individually.
 *
 * The world origin (0,0) is the centre of the land base image, matching the
 * origin-centred art in LandBase.tsx and the `calc(50% ...)` positioning in
 * MapPlacement.tsx. Game grid +y points up; Phaser world +y points down. That
 * y-flip lives in this file and nowhere else.
 */

export type GridPosition = {
  x: number;
  y: number;
  /** Render-only sub-tile offsets in source pixels (MapPlacement's oX/oY). */
  oX?: number;
  oY?: number;
};

export type WorldPoint = { x: number; y: number };

export type WorldRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** World units per grid tile (source pixels). */
export const WORLD_TILE = SQUARE_WIDTH;

/** The y-negations above can produce -0; keep coordinates comparison-friendly. */
const unsignZero = (n: number) => (n === 0 ? 0 : n);

/**
 * Top-left corner of a grid cell in world units. Mirrors MapPlacement.tsx:
 * left = GRID_WIDTH_PX*x + PIXEL_SCALE*oX, top = -(GRID_WIDTH_PX*y + PIXEL_SCALE*oY),
 * divided through by PIXEL_SCALE so world units are source pixels.
 */
export const gridToWorld = ({
  x,
  y,
  oX = 0,
  oY = 0,
}: GridPosition): WorldPoint => ({
  x: x * WORLD_TILE + oX,
  y: unsignZero(-(y * WORLD_TILE + oY)),
});

/**
 * World rect (top-left anchored, +y down) covering a grid-placed entity of
 * `width` x `height` tiles. The DOM farm anchors an entity's box at the
 * top-left of its origin cell and extends right and DOWN the screen — grid y
 * decreases across the box's rows.
 */
export const gridRectToWorld = (
  position: GridPosition,
  dimensions: { width: number; height: number },
): WorldRect => {
  const topLeft = gridToWorld(position);
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: dimensions.width * WORLD_TILE,
    height: dimensions.height * WORLD_TILE,
  };
};

/**
 * The grid cell containing a world point. A cell (gx, gy) covers world
 * x in [16gx, 16gx+16) and world y in [-16gy, -16gy+16) — its top edge is its
 * anchor, and its box extends down the screen.
 */
export const worldToGrid = ({
  x,
  y,
}: WorldPoint): { x: number; y: number } => ({
  x: Math.floor(x / WORLD_TILE),
  y: unsignZero(Math.ceil(-y / WORLD_TILE)),
});

/**
 * Snap a world point to the top-left of its grid cell.
 */
export const snapToGrid = (point: WorldPoint): WorldPoint => {
  const cell = worldToGrid(point);
  return gridToWorld(cell);
};

/**
 * Gameboard size in tiles for a given expansion count — Land.tsx's
 * gameboardDimensions: a 84x56 board plus an even margin that outpaces the
 * land's sqrt growth so the cloud frame keeps clearing it.
 */
export const getGameboardDimensions = (expansionCount: number) => {
  const GAMEBOARD_MARGIN_FACTOR = 10;
  const offset =
    Math.ceil((Math.sqrt(expansionCount) * GAMEBOARD_MARGIN_FACTOR) / 2) * 2;
  return { x: 84 + offset, y: 56 + offset };
};

/**
 * World-space bounds of the gameboard, centred on the origin.
 */
export const getGameboardWorldBounds = (expansionCount: number): WorldRect => {
  const dims = getGameboardDimensions(expansionCount);
  const width = dims.x * WORLD_TILE;
  const height = dims.y * WORLD_TILE;
  return { x: -width / 2, y: -height / 2, width, height };
};
