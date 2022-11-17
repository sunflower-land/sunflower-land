import React from "react";

import cook from "assets/npcs/goblin_doing.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";

export const GoblinCook: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        left: `${GRID_WIDTH_PX * 15}px`,
        bottom: `${GRID_WIDTH_PX * 27}px`,
      }}
    >
      <img
        src={cook}
        className="absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: 0,
          right: 0,
        }}
      />
      <img
        src={shadow}
        className="absolute z-10 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
      />
    </div>
  );
};
