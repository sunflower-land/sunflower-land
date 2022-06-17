import React from "react";
import { GRID_WIDTH_PX } from "../../lib/constants";

export interface Position {
  x: number;
  y: number;
  height: number;
  width: number;
}

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
        height: `${GRID_WIDTH_PX * height}px`,
        width: `${GRID_WIDTH_PX * width}px`,
      }}
    >
      {children}
    </div>
  );
};
