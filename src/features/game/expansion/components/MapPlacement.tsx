/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../../lib/constants";
import classNames from "classnames";
import { useVisiting } from "lib/utils/visitUtils";

export type Coordinates = {
  x: number;
  y: number;
  /**
   * Optional sub-tile pixel offset, expressed as integer source pixels (range
   * [-8, 8]). One unit = one source pixel = PIXEL_SCALE screen pixels. Applied
   * on top of the integer tile x/y for rendering only. Set by pixel-perfect
   * placement mode (see MovableComponent). Collision, AOE, adjacency, and any
   * other tile-keyed logic ignores these — they read the integer x/y.
   */
  oX?: number;
  oY?: number;
};

type Position = {
  height?: number;
  width?: number;
  z?: number;
  canCollide?: boolean;
  className?: string;
  x: number;
  y: number;
  /**
   * Optional sub-tile pixel offsets, expressed as integer source pixels (range
   * -8..8). When present, the rendered position becomes the tile (x, y) shifted
   * by oX * PIXEL_SCALE / oY * PIXEL_SCALE screen pixels. Set by the pixel-
   * perfect placement feature. Collision/AOE/grid logic ignores these.
   */
  oX?: number;
  oY?: number;
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
  oX = 0,
  oY = 0,
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

  // Tile position is GRID_WIDTH_PX per unit; the sub-tile offset is PIXEL_SCALE
  // per unit (one screen pixel per source pixel). Callers that don't pass
  // oX/oY (e.g. static world NPCs, expansion overlays) get 0 offset.
  const tileLeftPx = GRID_WIDTH_PX * x + PIXEL_SCALE * oX;
  const tileTopPx = GRID_WIDTH_PX * y + PIXEL_SCALE * oY;

  return (
    <div
      className={classNames("absolute", className, {
        "pointer-events-none": !enableOnVisitClick && isVisiting,
      })}
      style={{
        top: `calc(50% - ${tileTopPx}px)`,
        left: `calc(50% + ${tileLeftPx}px)`,
        height: height ? `${GRID_WIDTH_PX * height}px` : "auto",
        width: width ? `${GRID_WIDTH_PX * width}px` : "auto",
        zIndex: z,
      }}
    >
      {children}
    </div>
  );
};
