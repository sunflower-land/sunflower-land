import {
  CAVE_IMAGE_SIZE,
  CAVE_LADDER,
  type CaveTileRect,
} from "features/game/expansion/placeable/lib/caveLayout";
import type { FixedCameraView } from "../../core/camera";
import { WORLD_TILE, type WorldRect } from "../../core/coordinates";

/**
 * Where the Cave's pieces sit in world space [cave/Cave.tsx].
 *
 * The DOM lays everything out in tiles on the room image (top-left origin,
 * y down), and the room image is centred in its gameboard. The engine draws
 * the same image centred on the world origin [InteriorBackdropLayer], so a
 * tile on the image maps straight to world px from the room's top-left.
 */

/** The room image's top-left, in world px. */
export const CAVE_ROOM_ORIGIN = {
  x: -(CAVE_IMAGE_SIZE.width * WORLD_TILE) / 2,
  y: -(CAVE_IMAGE_SIZE.height * WORLD_TILE) / 2,
} as const;

/** World x of a tile column on the room image. */
export const caveTileX = (tileX: number) =>
  CAVE_ROOM_ORIGIN.x + tileX * WORLD_TILE;

/** World y of a tile row on the room image. */
export const caveTileY = (tileY: number) =>
  CAVE_ROOM_ORIGIN.y + tileY * WORLD_TILE;

/** [Cave.tsx tileStyle] a tile rectangle on the room image, in world px. */
export const caveTileRect = (rect: CaveTileRect): WorldRect => ({
  x: caveTileX(rect.x),
  y: caveTileY(rect.y),
  width: rect.width * WORLD_TILE,
  height: rect.height * WORLD_TILE,
});

/** [Cave.tsx] the gameboard the room is centred in, in tiles. */
const CAVE_BOARD = { width: 84, height: 64 } as const;

/**
 * [Cave.tsx] the camera pans over the 84x64 gameboard, and the view opens
 * with its top-left corner 5 tiles left of and 2 tiles above the ladder.
 */
export const CAVE_CAMERA_VIEW: FixedCameraView = {
  bounds: {
    x: -(CAVE_BOARD.width * WORLD_TILE) / 2,
    y: -(CAVE_BOARD.height * WORLD_TILE) / 2,
    width: CAVE_BOARD.width * WORLD_TILE,
    height: CAVE_BOARD.height * WORLD_TILE,
  },
  openAt: {
    x: caveTileX(CAVE_LADDER.x - 5),
    y: caveTileY(CAVE_LADDER.y - 2),
  },
};

/**
 * Paint order inside the room. Everything sits on the room art; the in-world
 * UI (labels, alerts, the tutorial hand) paints over the furniture, exactly
 * as the DOM's z-10/z-20/z-30/z-50 layers do.
 */
export const CAVE_DEPTHS = {
  FURNITURE: 0,
  TILE: 10,
  TILE_CONTENT: 11,
  HOVER_BOX: 20,
  NPC: 30,
  LABEL: 40,
  ALERT: 50,
  BUTTON: 55,
  HAND: 60,
  FEEDBACK: 70,
} as const;
