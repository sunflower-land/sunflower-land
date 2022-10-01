import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import furnace from "assets/buildings/furnace.png";

export const Furnace: React.FC = () => {
  return (
    <div
      className="z-10 absolute cursor-pointer hover:img-highlight"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 6}px`,
        right: `${GRID_WIDTH_PX * 19}px`,
        top: `${GRID_WIDTH_PX * 20.6}px`,
      }}
    >
      <img
        src={furnace}
        style={{
          width: `${PIXEL_SCALE * 69}px`,
        }}
      />
    </div>
  );
};
