import React from "react";

import brokenRocket from "assets/mom/mom_broken_rocket.gif";
import momNpc from "assets/mom/mom_npc.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Rocket: React.FC = () => {
  const rocketImage = brokenRocket;

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5}px`,
        right: `${GRID_WIDTH_PX * 18}px`,
        top: `${GRID_WIDTH_PX * 15}px`,
      }}
    >
      <div className="absolute cursor-pointer hover:img-highlight w-full">
        <img
          src={momNpc}
          style={{
            position: "absolute",
            width: `${GRID_WIDTH_PX * 1.2}px`,
            top: `${GRID_WIDTH_PX * 3.3}px`,
            right: `${GRID_WIDTH_PX * 3.92}px`,
            zIndex: 2,
          }}
        />
        <img src={rocketImage} className="w-56 relative z-10" />
      </div>
    </div>
  );
};
