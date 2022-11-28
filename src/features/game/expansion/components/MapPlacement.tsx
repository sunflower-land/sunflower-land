import React from "react";
import classNames from "classnames";
import { GRID_WIDTH_PX } from "../../lib/constants";

export type Coordinates = {
  x: number;
  y: number;
};

export type Position = {
  height?: number;
  width?: number;
} & Coordinates;

type Props = {
  isEditing?: boolean;
} & Position;

/**
 * This component is used to place items on the map. It uses the cartesian place coordinates
 * as the basis for its positioning. If the coordinates are 1,1 then the item will be placed one
 * grid size up and one grid right. The item will be placed at 0,0 of this coordinate.
 */
export const MapPlacement: React.FC<Props> = ({
  x,
  y,
  height,
  width,
  isEditing = false,
  children,
}) => {
  return (
    <div
      className={classNames("absolute", {
        "bg-red-background/80": isEditing,
      })}
      style={{
        top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
        left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
        height: height ? `${GRID_WIDTH_PX * height}px` : "auto",
        width: width ? `${GRID_WIDTH_PX * width}px` : "auto",
      }}
    >
      {children}
    </div>
  );
};
