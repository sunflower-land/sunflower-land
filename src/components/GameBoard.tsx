import React from "react";

import { animated } from "@react-spring/web";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const GameBoard: React.FC = ({ children }) => {
  return (
    <>
      <animated.div
        className="absolute"
        style={{
          // TODO - keep same as World width
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
        }}
        // TODO dynamic game board size based on tile dimensions
      >
        <div
          className="relative"
          style={{
            left: 42 * GRID_WIDTH_PX,
            top: 28 * GRID_WIDTH_PX,
            width: 0,
          }}
        />
        {children}
      </animated.div>
    </>
  );
};
