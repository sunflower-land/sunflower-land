import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/levels/level_1.png";
import { GameProvider } from "features/game/GameProvider";
import waterMovement from "assets/decorations/water_movement.png";
import { getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import { RESOURCES, ResourcePlacer } from "./components/ResourcePlacer";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";

type Placed = {
  name: string;
  coords: Coordinates;
};

export const Builder: React.FC = () => {
  const container = useRef(null);

  const [selected, setSelected] = useState<string>();

  const [placed, setPlaced] = useState<Placed[]>([]);

  const place = (coords: Coordinates) => {
    setPlaced((prev) => [
      ...prev,
      {
        name: selected as string,
        coords,
      },
    ]);
    setSelected("");
  };
  console.log({ placed });
  // Load data
  return (
    <GameProvider>
      <div className="h-full w-full">
        <div className="absolute w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-full h-full">
            {selected && (
              <ResourcePlacer
                name={selected}
                onCancel={() => setSelected("")}
                onPlace={place}
              />
            )}
          </div>
        </div>
        <div className="absolute bottom-0 flex z-30">
          {getKeys(RESOURCES).map((name) => (
            <Box
              key={name}
              image={RESOURCES[name].icon}
              isSelected={name === selected}
              onClick={() => setSelected(name)}
            />
          ))}
        </div>
        <div className="pointer-events-none">
          <ScrollContainer
            className="relative w-full h-full bg-[#0099db] overflow-scroll"
            innerRef={container}
          >
            <div
              className="relative flex"
              style={{
                width: `${36 * GRID_WIDTH_PX}px`,
                height: `${36 * GRID_WIDTH_PX}px`,
                pointerEvents: "none",
              }}
            >
              <img
                src={background}
                className="absolute inset-0 w-full h-full z-10"
                style={{
                  marginTop: `${GRID_WIDTH_PX * -10}px`,
                }}
              />
              <div
                className="absolute z-30"
                style={{
                  width: `${6 * GRID_WIDTH_PX}px`,
                  height: `${6 * GRID_WIDTH_PX}px`,
                  top: `${9 * GRID_WIDTH_PX}px`,
                  left: `${14 * GRID_WIDTH_PX}px`,
                }}
              >
                {placed.flatMap(({ name, coords }, index) => {
                  const resource = RESOURCES[name];
                  const { x, y } = coords;
                  const { width, height } = RESOURCES[name].dimensions;

                  return (
                    <MapPlacement
                      key={index}
                      x={x}
                      y={y}
                      height={height}
                      width={width}
                    >
                      {resource.component({})}
                    </MapPlacement>
                  );
                })}
              </div>
            </div>
            <div
              className="absolute inset-0 bg-repeat"
              style={{
                width: `${80 * GRID_WIDTH_PX}px`,
                height: `${80 * GRID_WIDTH_PX}px`,
                backgroundImage: `url(${waterMovement})`,
                backgroundSize: "400px",
                imageRendering: "pixelated",
              }}
            />
          </ScrollContainer>
        </div>
      </div>
    </GameProvider>
  );
};
