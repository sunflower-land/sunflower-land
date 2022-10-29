import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React from "react";
import { MapPlacement } from "./MapPlacement";

import dirt
/**
 * X + Y Coordinates
 * { 1: { 2: true} , 2: { 2: true, 3: true }}
 */
type Positions = Record<number, Record<number, boolean>>;

interface Props {
  positions: Positions;
}

export const DirtRenderer: React.FC<Props> = ({ positions }) => {
  const xPositions = getKeys(positions);

  return xPositions.flatMap((x) => {
    const yPositions = getKeys(positions[x]);

    return yPositions.map((y) => (
      <img
        className="absolute"
        src={}
        style={{
          top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
          left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
          height: `${GRID_WIDTH_PX}px`,
          width: `${GRID_WIDTH_PX}px`,
        }}
      />
    ));
  });
};
