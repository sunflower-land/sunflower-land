import React from "react";

import tent from "assets/land/tent_inside.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

export const Home: React.FC = () => {
  return (
    <img
      src={tent}
      style={{
        width: `${12 * GRID_WIDTH_PX}px`,
        height: `${12 * GRID_WIDTH_PX}px`,
      }}
    />
  );
};
