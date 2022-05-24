import React from "react";

import bakery from "assets/buildings/bakery_building.png";
import smoke from "assets/buildings/bakery_smoke.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Bakery: React.FC = () => (
  <div
    className="z-10 absolute"
    // TODO some sort of coordinate system
    style={{
      width: `${GRID_WIDTH_PX * 3}px`,
      right: `${GRID_WIDTH_PX * 16}px`,
      top: `${GRID_WIDTH_PX * 1}px`,
    }}
  >
    <img
      src={smoke}
      className="z-10"
      style={{
        position: "absolute",
        top: `-${GRID_WIDTH_PX * 2.2}px`,
        left: `${GRID_WIDTH_PX * 0.5}px`,
        width: `${GRID_WIDTH_PX * 1}px`,
      }}
    />
    <div>
      <img src={bakery} alt="bakery" className="w-full" />
    </div>
  </div>
);
