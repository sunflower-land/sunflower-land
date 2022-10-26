import React from "react";
import { GRID_WIDTH_PX } from "../../lib/constants";

export type Coordinates = {
  x: number;
  y: number;
};

export type Position = {
  height?: number;
  width?: number;
} & Coordinates;

// We want each y position to have a positive z index
const BASE_Z_INDEX = 100;

// Math.floor() is needed.  Z-index for decimal number won't be set in the DOM!!
export const calculateZIndex = (y: number) => Math.floor(BASE_Z_INDEX - y);

/**
 * This component is used to place items on the map. It uses the cartesian place coordinates
 * as the basis for its positioning. If the coordinates are 1,1 then the item will be placed one
 * grid size up and one grid right. The item will be placed at 0,0 of this coordinate.
 */
export const MapPlacement: React.FC<Position> = ({
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
        top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
        left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
        height: height ? `${GRID_WIDTH_PX * height}px` : "auto",
        width: width ? `${GRID_WIDTH_PX * width}px` : "auto",
        // This helps place objects in front of each other
        zIndex: calculateZIndex(y),
      }}
    >
      {children}
    </div>
  );
};
