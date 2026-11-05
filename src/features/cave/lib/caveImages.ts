import { CONFIG } from "lib/config";
import type { CaveBatch, CaveRecipeName } from "features/game/types/game";

/**
 * The art team's render of the Cave at each tier: the same room with one more
 * slot dug out per tier, cropped to the drawn walls (see `caveLayout.ts`). The
 * Myco Bins and the ladder are left out; they are drawn over it as sprites.
 */
export const CAVE_ROOM_IMAGES: Record<number, string> = Object.fromEntries(
  [1, 2, 3, 4, 5, 6, 7, 8].map((tier) => [
    tier,
    `${CONFIG.PROTECTED_IMAGE_URL}/cave/rooms/room_${tier}.webp`,
  ]),
);

export const getCaveRoomImage = (tier: number) =>
  CAVE_ROOM_IMAGES[Math.min(Math.max(tier, 1), 8)];

/** The ladder out, with its home sign. 32x49 px, 9 px below the stair's top. */
export const CAVE_LADDER_IMAGE = `${CONFIG.PROTECTED_IMAGE_URL}/cave/exit_ladder.webp`;
export const CAVE_LADDER_SPRITE = { width: 32, height: 49, top: 9 } as const;

/**
 * The Myco Bin, 80x48 px (its slot's sign rectangle). The hopper shows the mix
 * composting in it, and is empty when idle or once the batch is ready.
 */
export const CAVE_MYCO_BIN_IMAGES: Record<CaveRecipeName | "empty", string> = {
  empty: `${CONFIG.PROTECTED_IMAGE_URL}/cave/myco_bin/empty.webp`,
  Mushroom: `${CONFIG.PROTECTED_IMAGE_URL}/cave/myco_bin/mushroom.webp`,
  Beetle: `${CONFIG.PROTECTED_IMAGE_URL}/cave/myco_bin/beetle.webp`,
  Mud: `${CONFIG.PROTECTED_IMAGE_URL}/cave/myco_bin/mud.webp`,
};

export const getCaveMycoBinImage = (
  batch: CaveBatch | undefined,
  now: number,
) =>
  batch && batch.readyAt > now
    ? CAVE_MYCO_BIN_IMAGES[batch.recipe]
    : CAVE_MYCO_BIN_IMAGES.empty;
