import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/decorations.png";

export const Decorations: React.FC = () => {
  return (
    <div
      className="z-10 absolute cursor-pointer hover:img-highlight"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 6}px`,
        right: `${GRID_WIDTH_PX * 17.6}px`,
        top: `${GRID_WIDTH_PX * 25.2}px`,
      }}
    >
      <img
        src={building}
        style={{
          width: `${PIXEL_SCALE * 50}px`,
        }}
      />
    </div>
  );
};
