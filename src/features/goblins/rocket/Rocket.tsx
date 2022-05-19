import React from "react";

import brokenRocket from "assets/buildings/mom_broken_rocket.gif";
import momNpc from "assets/npcs/mom_npc.gif";
import icon from "assets/brand/icon.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

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
        {
          <Action
            className="absolute -bottom-7 left-8"
            text="M.O.M"
            icon={icon}
          />
        }
      </div>
    </div>
  );
};
