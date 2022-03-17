import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Tree } from "./components/Tree";
import { Lumberjack } from "./components/Lumberjack";

export const Forest: React.FC = () => {
  return (
    <div
      id="forest"
      style={{
        height: `${GRID_WIDTH_PX * 9}px`,
        width: `${GRID_WIDTH_PX * 11}px`,
        // left: `calc(50% + ${GRID_WIDTH_PX * 20}px)`,
        // top: `calc(50% +  ${GRID_WIDTH_PX * 5}px)`,
        left: `calc(50% - ${GRID_WIDTH_PX * -21.4}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 4}px)`,
      }}
      className="absolute "
    >
      <Lumberjack />
      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          right: `${GRID_WIDTH_PX * 0}px`,
          top: `${GRID_WIDTH_PX * 5.5}px`,
        }}
      >
        <Tree treeIndex={0} />
      </div>

      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          left: `${GRID_WIDTH_PX * 0.5}px`,
          top: `${GRID_WIDTH_PX * 0.5}px`,
        }}
      >
        <Tree treeIndex={1} />
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
        <Tree treeIndex={2} />
      </div>

      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          left: `${GRID_WIDTH_PX * 4.5}px`,
          bottom: `${GRID_WIDTH_PX * 0.5}px`,
        }}
      >
        <Tree treeIndex={3} />
      </div>

      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          left: `${GRID_WIDTH_PX * 0}px`,
          bottom: `${GRID_WIDTH_PX * 2}px`,
        }}
      >
        <Tree treeIndex={4} />
      </div>
    </div>
  );
};
