import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/farmersMarket.png";

export const FarmersMarket: React.FC = () => {
  return (
    <div
      className="z-10 absolute cursor-pointer hover:img-highlight"
      // TODO some sort of coordinate system
      style={{
        right: `${GRID_WIDTH_PX * 12}px`,
        top: `${GRID_WIDTH_PX * 25.2}px`,
      }}
    >
      <img
        src={building}
        style={{
          width: `${PIXEL_SCALE * 80}px`,
        }}
      />
    </div>
  );
};
