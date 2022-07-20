import React from "react";
import grid from "assets/land/levels/grid.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

/**
 * A useful component when positioning items to make sure they fall on the grid
 */
export const GridOverlay: React.FC = () => {
  return (
    <div
      id="grid"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url(${grid})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${GRID_WIDTH_PX * 2}px`,
        opacity: 0.2,
        imageRendering: "pixelated",
      }}
    />
  );
};
