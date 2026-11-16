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
  /** The Myco Bin drawn on the room: the click target. */
  sign: CaveTileRect;
  /** Top-left tile of the 5x5 sand the Bumpkin digs. */
  patch: CaveCoordinates;
};

// A slot on the map is a 7x11 box: the Myco Bin at rows 0-2 / columns 1-5,
// the fence on row 3, a border, the 5x5 sand at rows 5-9 / columns 1-5, a
// border.
const SLOT_BOX = { width: 7, height: 11 } as const;

function slotAt(boxX: number, boxY: number): CaveSlot {
  const x = boxX - CAVE_IMAGE_ORIGIN.x;
  const y = boxY - CAVE_IMAGE_ORIGIN.y;

  return {
    sign: { x: x + 1, y, width: 5, height: 3 },
    patch: { x: x + 1, y: y + 5 },
  };
}

/**
 * The 8 slots keyed by id (= the tier that unlocks them, = `cave.machines`
 * key). Slots 1-4 run along the top row left to right; 5-8 along the bottom
 * row RIGHT to left, so the room grows back towards the ladder.
 */
export const CAVE_SLOTS: Record<number, CaveSlot> = {
  1: slotAt(20, 31),
  2: slotAt(29, 31),
  3: slotAt(38, 31),
  4: slotAt(47, 31),
  5: slotAt(47, 43),
  6: slotAt(38, 43),
  7: slotAt(29, 43),
  8: slotAt(20, 43),
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
  1: rect(29, 33, 1, 10),
  2: rect(38, 33, 1, 10),
  3: rect(47, 33, 1, 10),
  4: rect(45, 43, 11, 1),
  5: rect(44, 47, 1, 11),
  6: rect(35, 47, 1, 11),
  7: rect(26, 47, 1, 11),
};

/**
 * The Goblin Cave Merchant's alcove by the entrance arch. The room draws it
 * from tier I; the goblin stands at its right-hand side.
 */
export const CAVE_MERCHANT_ALCOVE: CaveTileRect = rect(31, 22, 10, 5);
export const CAVE_MERCHANT_ALCOVE_TIER = 1;

/** The ladder out, top-left of the first room. */
export const CAVE_LADDER: CaveTileRect = rect(20, 21, 2, 4);

/** How many slots are unlocked at a given tier (tier N unlocks slot N). */
export function caveSlotsForTier(tier: number): number[] {
  return Array.from({ length: Math.min(tier, 8) }, (_, i) => i + 1);
}
