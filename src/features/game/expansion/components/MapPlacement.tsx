import React, { createContext, useContext } from "react";
import { GRID_WIDTH_PX } from "../../lib/constants";

export type Coordinates = {
  x: number;
  y: number;
};

export type Position = {
  height?: number;
  width?: number;
  z?: string | number;
  canCollide?: boolean;
} & Coordinates;

type MapPlacementContextType = Position;

const MapPlacementContext = createContext<MapPlacementContextType | undefined>(
  undefined,
);

export const useMapPlacement = () => {
  const context = useContext(MapPlacementContext);

  return context;
};

/**
 * This component is used to place items on the map. It uses the cartesian place coordinates
 * as the basis for its positioning. If the coordinates are 1,1 then the item will be placed one
 * grid size up and one grid right. The item will be placed at 0,0 of this coordinate.
 */
export const MapPlacement: React.FC<
  Position & { children: React.ReactNode }
> = ({ x, y, height, width, children, z = "unset", canCollide = true }) => {
  const value = { x, y, height, width, z, canCollide };

  return (
    <MapPlacementContext.Provider value={value}>
      <div
        className={"absolute"}
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
    </MapPlacementContext.Provider>
  );
};
