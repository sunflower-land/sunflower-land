import React from "react";

import jumping from "assets/npcs/goblin_jumping.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";

export const StoneHavenJumper: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        left: `${GRID_WIDTH_PX * 20}px`,
        bottom: `${GRID_WIDTH_PX * 22}px`,
      }}
    >
      <img
        src={jumping}
        className="absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          bottom: 0,
          right: 0,
          transform: "scaleX(-1)",
        }}
      />
      <img
        src={shadow}
        className="absolute z-10 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      />
    </div>
  );
};
