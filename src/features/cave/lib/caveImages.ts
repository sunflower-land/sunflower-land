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
