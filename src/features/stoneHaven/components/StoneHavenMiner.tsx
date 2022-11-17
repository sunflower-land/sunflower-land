import React from "react";

import miner from "assets/npcs/goblin_mining.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";

export const StoneHavenMiner: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 4}px`,
        left: `${GRID_WIDTH_PX * 25.2}px`,
        bottom: `${GRID_WIDTH_PX * 25.2}px`,
      }}
    >
      <img
        src={miner}
        className="absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 64}px`,
          bottom: 0,
          right: 0,
        }}
      />
      <img
        src={shadow}
        className="absolute z-10 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2.5}px`,
          left: `${PIXEL_SCALE * 14}px`,
        }}
      />
    </div>
  );
};
