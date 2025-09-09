/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { GRID_WIDTH_PX } from "../../lib/constants";
import classNames from "classnames";
import { useVisiting } from "lib/utils/visitUtils";

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
  enableOnVisitClick?: boolean;
  isTile?: boolean;
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
  z = "unset",
  canCollide = true,
  isTile = false,
  className,
  enableOnVisitClick = false,
}) => {
  const { isVisiting } = useVisiting();

  return (
    <div
      className={classNames("absolute", className, {
        "pointer-events-none": !enableOnVisitClick && isVisiting,
      })}
      style={{
        top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
        left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
        height: height ? `${GRID_WIDTH_PX * height}px` : "auto",
        width: width ? `${GRID_WIDTH_PX * width}px` : "auto",
        zIndex: z,
      }}
    >
      {children}
    </div>
  );
};
