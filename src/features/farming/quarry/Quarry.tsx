import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Gold } from "./components/Gold";
import { Stone } from "./components/Stone";
import { Iron } from "./components/Iron";

export const Quarry: React.FC = () => {
  return (
    <>
      <div
        className="absolute"
        style={{
          right: `${GRID_WIDTH_PX * 5}px`,
          top: `${GRID_WIDTH_PX * 25}px`,
        }}
      >
        <Stone rockIndex={0} />
      </div>
      <div
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * 15}px`,
          top: `${GRID_WIDTH_PX * 43}px`,
        }}
      >
        <Stone rockIndex={1} />
      </div>

      <div
        className="absolute"
        style={{
          right: `${GRID_WIDTH_PX * 10}px`,
          top: `${GRID_WIDTH_PX * 50}px`,
        }}
      >
        <Stone rockIndex={2} />
      </div>

      <div
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * 25}px`,
          top: `${GRID_WIDTH_PX * 20}px`,
        }}
      >
        <Iron rockIndex={0} />
      </div>
      <div
        className="absolute"
        style={{
          right: `${GRID_WIDTH_PX * 1}px`,
          top: `${GRID_WIDTH_PX * 40}px`,
        }}
      >
        <Iron rockIndex={1} />
      </div>

      <div
        className="absolute"
        style={{
          left: `calc(50% +  ${GRID_WIDTH_PX * 25}px)`,
          top: `${GRID_WIDTH_PX * 14}px`,
        }}
      >
        <Gold rockIndex={0} />
      </div>
    </>
  );
};
