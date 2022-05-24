import React from "react";

import blacksmith from "assets/buildings/blacksmith_building.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Blacksmith: React.FC = () => (
  <div
    className="z-10 absolute"
    // TODO some sort of coordinate system
    style={{
      width: `${GRID_WIDTH_PX * 6}px`,
      left: `${GRID_WIDTH_PX * 9}px`,
      top: `${GRID_WIDTH_PX * 6}px`,
    }}
  >
    <div>
      <img src={blacksmith} alt="market" className="w-full" />
    </div>
  </div>
);
