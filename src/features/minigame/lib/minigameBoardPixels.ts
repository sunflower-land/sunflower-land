import type { CSSProperties } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

/**
 * `checkered_bg.png` repeats on a 48×48 source tile (= 3 × land tile width of 16px).
 * Scaled size uses {@link GRID_WIDTH_PX} so tiles line up with the main game grid.
 */
export const MINIGAME_CHECKERED_TILE_SQUARES = 2;

/** One repeat tile edge length in CSS px (square). */
export function minigameCheckeredTileCssPx(): number {
  return MINIGAME_CHECKERED_TILE_SQUARES * GRID_WIDTH_PX;
}

/**
 * Styles for a dedicated full-bleed backdrop layer (not the flex root).
 * Uses explicit width+height and `-webkit-background-size` so Safari does not treat
 * the vertical axis as `auto` and stretch non-square artwork.
 */
export function minigameDashboardBackdropStyle(
  imageUrl: string,
): CSSProperties {
  const tile = minigameCheckeredTileCssPx();
  const size = `${tile}px ${tile}px`;
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "0 0",
    backgroundSize: size,
    WebkitBackgroundSize: size,
    imageRendering: "pixelated",
  };
}
