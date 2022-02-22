import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Tree } from "./components/Tree";

export const Forest: React.FC = () => {
  return (
    <div
      style={{
        height: `${GRID_WIDTH_PX * 6}px`,
        width: `${GRID_WIDTH_PX * 6}px`,
        left: `calc(50% -  ${GRID_WIDTH_PX * 22}px)`,
        top: `calc(50% -  ${GRID_WIDTH_PX * 20}px)`,
      }}
      className="absolute "
    >
      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          right: `${GRID_WIDTH_PX * 0}px`,
          top: `${GRID_WIDTH_PX * 3}px`,
        }}
      >
        <Tree />
      </div>

      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          left: `${GRID_WIDTH_PX * 0}px`,
          top: `${GRID_WIDTH_PX * 0}px`,
        }}
      >
        <Tree />
      </div>

      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          right: `${GRID_WIDTH_PX * 1}px`,
          top: `${GRID_WIDTH_PX * 0.5}px`,
        }}
      >
        <Tree />
      </div>
    </div>
  );
};
