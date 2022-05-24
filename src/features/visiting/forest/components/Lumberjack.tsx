import React from "react";

import idle from "assets/npcs/idle.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Lumberjack: React.FC = () => (
  <>
    <img
      src={idle}
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 0.75}px`,
        right: `${GRID_WIDTH_PX * 4.8}px`,
        top: `${GRID_WIDTH_PX * 3.45}px`,
      }}
    />
  </>
);
