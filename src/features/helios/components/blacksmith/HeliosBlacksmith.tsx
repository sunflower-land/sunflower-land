import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/blacksmith_building.gif";

export const HeliosBlacksmith: React.FC = () => {
  return (
    <div
      className="z-10 absolute cursor-pointer hover:img-highlight"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 6}px`,
        right: `${GRID_WIDTH_PX * 20.7}px`,
        top: `${GRID_WIDTH_PX * 20.4}px`,
      }}
    >
      <img
        src={building}
        style={{
          width: `${PIXEL_SCALE * 98}px`,
        }}
      />
    </div>
  );
};
