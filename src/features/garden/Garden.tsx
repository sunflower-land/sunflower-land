import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Flower } from "./components/Flower";
import { Apicultor } from "./components/Apicultor";

export const Garden: React.FC = () => {
  return (
    <div
      id="garden"
      style={{
        height: `${GRID_WIDTH_PX * 5}px`,
        width: `${GRID_WIDTH_PX * 8}px`,
        // left: `calc(50% + ${GRID_WIDTH_PX * 20}px)`,
        // top: `calc(50% +  ${GRID_WIDTH_PX * 5}px)`,
        left: `calc(50% - ${GRID_WIDTH_PX * -10}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 30}px)`,
      }}
      className="absolute "
    >
      <Apicultor />
      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          right: `${GRID_WIDTH_PX * -5.2}px`,
          top: `${GRID_WIDTH_PX * 2.2}px`,
        }}
      >
        <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -4.85}px`,
            top: `${GRID_WIDTH_PX * -3.65}px`,
          }}
        >
          <Flower flowerIndex={0} />
        </div>
        <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -0.75}px`,
            top: `${GRID_WIDTH_PX * -3.65}px`,
          }}
        >
          <Flower flowerIndex={1} />
        </div>

        <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -0.75}px`,
            top: `${GRID_WIDTH_PX * 0.5}px`,
          }}
        >
          <Flower flowerIndex={2} />
        </div>

        <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -4.85}px`,
            top: `${GRID_WIDTH_PX * 0.5}px`,
          }}
        >
          <Flower flowerIndex={3} />
        </div>
      </div>
    </div>
  );
};
