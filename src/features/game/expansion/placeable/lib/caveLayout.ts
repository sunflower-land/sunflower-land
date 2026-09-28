/**
 * Cave interior layout (in tiles).
 *
 * The Cave is one room with 8 fixed slots laid out in a 2x4 grid. Each slot is
 * a Myco-Composter machine sitting directly ABOVE its own 5x5 digging patch.
 * Slots unlock with tiers: the top row left→right first (slots 1–4), then the
 * bottom row left→right (slots 5–8). The room GROWS with tiers — the walls
 * push out to include each newly unlocked slot, so the art team supplies a
 * room image per size.
 *
 * Coordinate convention mirrors `interiorLayouts.ts`: bottom-left anchored at
 * (0, 0), x increases right, y increases up. A tile (x, y) with size (w, h)
 * occupies cells (x + dx, y - dy) for dx ∈ [0, w), dy ∈ [0, h) — so (x, y) is
 * the TOP-LEFT tile.
 */

/** Every digging patch is 5x5 (25 diggable tiles). */
export const CAVE_PATCH_SIZE = 5;

/** The Myco-Composter machine footprint (tiles). */
export const CAVE_MACHINE_SIZE = { width: 3, height: 2 } as const;

export type CaveCoordinates = { x: number; y: number };

export type CaveSlot = {
  /** Top-left tile of the Myco-Composter machine. */
  machine: CaveCoordinates;
  /** Top-left tile of the 5x5 digging patch, directly below the machine. */
  patch: CaveCoordinates;
};

// Horizontal gap between the four columns and the room's left margin.
const COLUMN_STRIDE = CAVE_PATCH_SIZE + 2; // patch width + gutter
const LEFT_MARGIN = 1;
// The top row's patches sit high; the bottom row is one room-height down.
// Each row is machine + gap + patch + room for the patch's labels below it.
const ROW_STRIDE = CAVE_MACHINE_SIZE.height + CAVE_PATCH_SIZE + 3;
const TOP_ROW_PATCH_TOP_Y = 13;
const COLUMNS = 4;

/**
 * The room's top wall, level with the top of the first row's machines. The
 * room grows right (tiers I–IV) and then down (V–VIII) from here, so slots
 * already unlocked never move.
 */
export const CAVE_ROOM_TOP_Y =
  TOP_ROW_PATCH_TOP_Y + CAVE_MACHINE_SIZE.height + 1;

function slotAt(column: number, row: number): CaveSlot {
  const patchX = LEFT_MARGIN + column * COLUMN_STRIDE;
  const patchTopY = TOP_ROW_PATCH_TOP_Y - row * ROW_STRIDE;
  return {
    patch: { x: patchX, y: patchTopY },
    // Machine is centred over the 5x5 patch, one tile above it.
    machine: {
      x: patchX + Math.floor((CAVE_PATCH_SIZE - CAVE_MACHINE_SIZE.width) / 2),
      y: patchTopY + CAVE_MACHINE_SIZE.height + 1,
    },
  };
}

/**
 * The 8-slot table. Slots 1–4 are the top row (left→right), 5–8 the bottom
 * row (left→right). Keyed by slot id to match `cave.machines`.
 */
export const CAVE_SLOTS: Record<number, CaveSlot> = {
  1: slotAt(0, 0),
  2: slotAt(1, 0),
  3: slotAt(2, 0),
  4: slotAt(3, 0),
  5: slotAt(0, 1),
  6: slotAt(1, 1),
  7: slotAt(2, 1),
  8: slotAt(3, 1),
};

/**
 * Room size (in tiles) at a tier — how far the walls reach as slots unlock,
 * measured right and down from the top-left corner (`CAVE_ROOM_TOP_Y`). Tiers
 * I–IV widen the top row; tier V adds the bottom row at full width. A
 * placeholder rectangle until the art team supplies a room per size.
 */
export function getCaveRoomBounds(tier: number): {
  width: number;
  height: number;
} {
  const unlocked = Math.min(Math.max(tier, 1), COLUMNS * 2);
  const columns = Math.min(unlocked, COLUMNS);
  const rows = unlocked > COLUMNS ? 2 : 1;
  return {
    width: LEFT_MARGIN + columns * COLUMN_STRIDE,
    height: rows * ROW_STRIDE,
  };
}

/** How many slots are unlocked at a given tier (tier N unlocks slot N). */
export function caveSlotsForTier(tier: number): number[] {
  return Array.from({ length: tier }, (_, i) => i + 1);
}
