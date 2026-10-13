/**
 * Cave interior layout, in tiles, over the art team's room renders.
 *
 * The room is drawn as one image per tier (`room_<tier>.webp`, 66x55 tiles
 * of 16 px cropped from the Tiled map at tile (7, 13)). Everything below is
 * positioned on that image with a TOP-LEFT origin, x right and y down, in
 * 16 px tiles. The numbers come from the Tiled map's layers and are pinned
 * by `caveLayout.test.ts` against the map JSON, so a re-export of the map
 * that moves a slot fails the test instead of the room.
 */

/** Where the room image was cropped from the Tiled map, in map tiles. */
export const CAVE_IMAGE_ORIGIN = { x: 7, y: 13 } as const;

/** The room image, in tiles. */
export const CAVE_IMAGE_SIZE = { width: 66, height: 55 } as const;

/** Every digging patch is 5x5 (25 diggable tiles). */
export const CAVE_PATCH_SIZE = 5;

export type CaveCoordinates = { x: number; y: number };
export type CaveTileRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CaveSlot = {
  /** The Myco Bin sign drawn on the room: the click target. */
  sign: CaveTileRect;
  /** Top-left tile of the 5x5 sand the Bumpkin digs. */
  patch: CaveCoordinates;
};

// A slot on the map is a 7x10 box: sign rows 0-1 (columns 2-4), the fence
// on row 2, a border, the 5x5 sand at rows 4-8 / columns 1-5, a border.
const SLOT_BOX = { width: 7, height: 10 } as const;

function slotAt(boxX: number, boxY: number): CaveSlot {
  const x = boxX - CAVE_IMAGE_ORIGIN.x;
  const y = boxY - CAVE_IMAGE_ORIGIN.y;

  return {
    sign: { x: x + 2, y, width: 3, height: 2 },
    patch: { x: x + 1, y: y + 4 },
  };
}

/**
 * The 8 slots keyed by id (= the tier that unlocks them, = `cave.machines`
 * key). Slots 1-4 run along the top row left to right; 5-8 along the bottom
 * row RIGHT to left, so the room grows back towards the ladder.
 */
export const CAVE_SLOTS: Record<number, CaveSlot> = {
  1: slotAt(20, 32),
  2: slotAt(29, 32),
  3: slotAt(38, 32),
  4: slotAt(47, 32),
  5: slotAt(47, 45),
  6: slotAt(38, 45),
  7: slotAt(29, 45),
  8: slotAt(20, 45),
};

export { SLOT_BOX as CAVE_SLOT_BOX };

const rect = (
  mapX: number,
  mapY: number,
  width: number,
  height: number,
): CaveTileRect => ({
  x: mapX - CAVE_IMAGE_ORIGIN.x,
  y: mapY - CAVE_IMAGE_ORIGIN.y,
  width,
  height,
});

/**
 * The barrier the room draws where the next slot will open, keyed by the
 * CURRENT tier: the expansion sign sits on it. None at the last tier.
 */
export const CAVE_CONSTRUCTION_SITES: Record<number, CaveTileRect> = {
  1: rect(29, 34, 1, 10),
  2: rect(38, 34, 1, 10),
  3: rect(47, 34, 1, 10),
  4: rect(45, 45, 11, 1),
  5: rect(43, 47, 3, 10),
  6: rect(34, 47, 3, 10),
  7: rect(25, 47, 3, 10),
};

/**
 * The Goblin Cave Merchant's alcove by the entrance arch. The room draws it
 * from tier V; the goblin stands at its right-hand side.
 */
export const CAVE_MERCHANT_ALCOVE: CaveTileRect = rect(32, 22, 9, 5);
export const CAVE_MERCHANT_ALCOVE_TIER = 5;

/** The ladder out, top-left of the first room. */
export const CAVE_LADDER: CaveTileRect = rect(20, 21, 1, 4);

/** How many slots are unlocked at a given tier (tier N unlocks slot N). */
export function caveSlotsForTier(tier: number): number[] {
  return Array.from({ length: Math.min(tier, 8) }, (_, i) => i + 1);
}
