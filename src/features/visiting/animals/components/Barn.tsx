import React from "react";

import barn from "assets/buildings/barn.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Barn: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5.5}px`,
        left: `${-GRID_WIDTH_PX * 2.25}px`,
        top: `${-GRID_WIDTH_PX * 5}px`,
      }}
    >
      <img src={barn} alt="barn" className="w-full" />
    </div>
  );
};
