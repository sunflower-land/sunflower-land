import React from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../../lib/constants";

export type Coordinates = {
  x: number;
  y: number;
};

export type Position = {
  height: number;
  width: number;
} & Coordinates;

const TOP_EDGE_OFFSET = 4 * PIXEL_SCALE;
const LEFT_EDGE_OFFSET = 2 * PIXEL_SCALE;

/**
 * This component is used to place items on the map. It uses the cartesian place coordinates
 * as the basis for its positioning. If the coordinates are 1,1 then the item will be placed one
 * grid size up and one grid right. The item will be placed at 0,0 of this coordinate.
 */
export const TerrainPlacement: React.FC<Position> = ({
  x,
  y,
  height,
  width,
  children,
}) => {
  return (
    <div
      className="absolute"
      style={{
        top: `calc(50% - ${GRID_WIDTH_PX * y + TOP_EDGE_OFFSET}px)`,
        left: `calc(50% + ${GRID_WIDTH_PX * x - LEFT_EDGE_OFFSET}px)`,
        height: `${height * PIXEL_SCALE}px`,
        width: `${width * PIXEL_SCALE}px`,
      }}
    >
      {children}
    </div>
  );
};
