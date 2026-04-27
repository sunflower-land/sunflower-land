import React from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";

interface Props {
  /** Bottom-left tile coordinate to mark (same convention as INTERIOR_LAYOUTS). */
  tile: { x: number; y: number };
}

/**
 * Renders a translucent green square at the given tile (1×1, no pointer
 * events). Purely a visual landmark for the per-interior centre tile —
 * scroll-on-mount and placement-coord origin are handled by the
 * Section.GenesisBlock sentinel, which is anchored at the same tile.
 *
 * See INTERIOR_CENTER_TILES / HOME_EXPANSION_CENTER_TILES in
 * interiorLayouts.ts for the source of truth.
 */
export const CenterTileMarker: React.FC<Props> = ({ tile }) => {
  return (
    <div
      aria-label={`interior-center-${tile.x},${tile.y}`}
      className="absolute pointer-events-none"
      style={{
        left: tile.x * GRID_WIDTH_PX,
        top: (INTERIOR_CANVAS.height - tile.y) * GRID_WIDTH_PX,
        width: GRID_WIDTH_PX,
        height: GRID_WIDTH_PX,
        backgroundColor: "rgba(40, 220, 80, 0.65)",
        outline: "2px solid rgba(0, 200, 0, 0.9)",
        // Above the dev grid overlay so it stays visible while tuning.
        zIndex: 60,
      }}
    />
  );
};
