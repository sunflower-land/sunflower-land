import { CONFIG } from "lib/config";

/**
 * The art team's render of the Cave at each tier: the same room with one more
 * slot dug out per tier, cropped to the drawn walls (see `caveLayout.ts`).
 */
export const CAVE_ROOM_IMAGES: Record<number, string> = Object.fromEntries(
  [1, 2, 3, 4, 5, 6, 7, 8].map((tier) => [
    tier,
    `${CONFIG.PROTECTED_IMAGE_URL}/cave/room_${tier}.webp`,
  ]),
);

export const getCaveRoomImage = (tier: number) =>
  CAVE_ROOM_IMAGES[Math.min(Math.max(tier, 1), 8)];

/**
 * The ladder and a Myco Bin cut from the room's tiles, drawn over the room
 * render only on hover so the highlight outlines the art itself. The Myco Bin
 * leaves out its drop shadow, which the room already draws.
 */
export const CAVE_LADDER_IMAGE = `${CONFIG.PROTECTED_IMAGE_URL}/cave/ladder.webp`;
export const CAVE_MYCO_BIN_IMAGE = `${CONFIG.PROTECTED_IMAGE_URL}/cave/myco_bin.webp`;
