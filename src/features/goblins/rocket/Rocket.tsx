import React from "react";

import brokenRocket from "assets/buildings/mom_broken_rocket.gif";
import momNpc from "assets/npcs/mom_npc.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Rocket: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5}px`,
        right: `${GRID_WIDTH_PX * 9.75}px`,
        top: `${GRID_WIDTH_PX * 20}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img src={brokenRocket} className="w-full" />
        <img
          src={momNpc}
          style={{
            position: "absolute",
            width: `${GRID_WIDTH_PX * 1.3}px`,
            top: `${GRID_WIDTH_PX * 2.5}px`,
            right: `${GRID_WIDTH_PX * 3.75}px`,
          }}
        />
      </div>
    </div>
  );
};
