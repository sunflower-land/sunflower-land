import React from "react";

import { animated } from "@react-spring/web";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useContext } from "react";
import { ZoomContext } from "./ZoomProvider";

import ocean from "assets/decorations/ocean.webp";

export const GameBoard: React.FC = ({ children }) => {
  const { scale } = useContext(ZoomContext);

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
          overflow: "hidden",
        }}
      >
        <animated.div
          className="relative inset-0 bg-repeat w-full h-full"
          style={{
            backgroundImage: `url(${ocean})`,
            backgroundSize: `${64 * PIXEL_SCALE}px`,
            width: `${84 * GRID_WIDTH_PX * 4}px`,
            height: `${56 * GRID_WIDTH_PX * 4}px`,
            left: `-${84 * GRID_WIDTH_PX * 1.5}px`,
            top: `-${56 * GRID_WIDTH_PX * 1.5}px`,
            imageRendering: "pixelated",
            transform: scale.to((s) => `scale(${s})`),
          }}
        />
      </div>
      <animated.div
        className="absolute"
        style={{
          // TODO - keep same as World width
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
          transform: scale.to((s) => `scale(${s})`),
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
          id="gameCenter"
        />
        {children}
      </animated.div>
    </>
  );
};
