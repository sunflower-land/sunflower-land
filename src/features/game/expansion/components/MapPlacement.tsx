/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { GRID_WIDTH_PX } from "../../lib/constants";
import classNames from "classnames";
import { getZIndex } from "../placeable/lib/collisionDetection";

export type Coordinates = {
  x: number;
  y: number;
};

type Position = {
  height?: number;
  width?: number;
  z?: number;
  canCollide?: boolean;
  className?: string;
  x: number;
  y: number;
};

type Props = Position & { id?: string };

/**
 * This component is used to place items on the map. It uses the cartesian place coordinates
 * as the basis for its positioning. If the coordinates are 1,1 then the item will be placed one
 * grid size up and one grid right. The item will be placed at 0,0 of this coordinate.
 */
export const MapPlacement: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  x,
  y,
  height,
  width,
  children,
  z,
  canCollide = true,
  className,
}) => {
  return (
    <div
      className={classNames("absolute", className)}
      style={{
        top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
        left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
        height: height ? `${GRID_WIDTH_PX * height}px` : "auto",
        width: width ? `${GRID_WIDTH_PX * width}px` : "auto",
        zIndex: z ?? getZIndex(y),
      }}
    >
      {children}
    </div>
  );
};
