import React from "react";

import sandHill from "assets/land/sand_hill.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

export const SandHills: React.FC = () => {
  const hillPositions = [
    {
      x: 2,
      y: 4,
    },
    {
      x: 4,
      y: -1,
    },
    {
      x: -3,
      y: 1,
    },
    {
      x: -2,
      y: 6,
    },
    {
      x: 1,
      y: 9,
    },
  ];

  return (
    <>
      {hillPositions.map((hillPosition, index) => (
        <img
          src={sandHill}
          className="absolute cursor-pointer hover:img-highlight"
          key={index}
          style={{
            top: `calc(50% - ${GRID_WIDTH_PX * hillPosition.y}px)`,
            left: `calc(50% + ${GRID_WIDTH_PX * hillPosition.x}px)`,
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
        />
      ))}
    </>
  );
};
