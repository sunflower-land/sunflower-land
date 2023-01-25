import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useLayoutEffect, useState } from "react";

import background from "assets/land/treasure_island.webp";
import placeholderNPC2 from "assets/npcs/artisian.gif";
import shadow from "assets/npcs/shadow.png";

import { IslandTravelWrapper } from "./components/IslandTravelWrapper";
import { GoblinDigging } from "./components/GoblinDigging";
import { TreasureShop } from "./components/TreasureShop";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { SandPlot } from "./components/SandPlot";

const CLICKABLE_COORDINATES: Coordinates[] = [
  {
    x: -2,
    y: 12,
  },
  {
    x: -1,
    y: 12,
  },
  {
    x: 1,
    y: 12,
  },
  {
    x: -9,
    y: 11,
  },
  {
    x: -8,
    y: 11,
  },
  {
    x: -7,
    y: 11,
  },
  {
    x: -2,
    y: 11,
  },
  {
    x: -1,
    y: 11,
  },
  {
    x: 1,
    y: 11,
  },
  {
    x: -9,
    y: 10,
  },
  {
    x: -8,
    y: 10,
  },
  {
    x: -7,
    y: 10,
  },
  {
    x: -6,
    y: 10,
  },
  {
    x: -2,
    y: 10,
  },
  {
    x: 1,
    y: 10,
  },
  {
    x: -9,
    y: 9,
  },
  {
    x: -8,
    y: 9,
  },
  {
    x: 0,
    y: 9,
  },
  {
    x: 1,
    y: 9,
  },
  {
    x: 2,
    y: 9,
  },
  {
    x: -9,
    y: 8,
  },
  {
    x: -8,
    y: 8,
  },
  {
    x: -2,
    y: 8,
  },
  {
    x: -1,
    y: 8,
  },
  {
    x: 0,
    y: 8,
  },
  {
    x: 1,
    y: 8,
  },
  {
    x: 3,
    y: 8,
  },
  {
    x: -3,
    y: 7,
  },
  {
    x: -2,
    y: 7,
  },
  {
    x: -1,
    y: 7,
  },
  {
    x: 0,
    y: 7,
  },
  {
    x: 1,
    y: 7,
  },
  {
    x: 2,
    y: 7,
  },
  {
    x: 3,
    y: 7,
  },
  {
    x: -4,
    y: 6,
  },
  {
    x: -3,
    y: 6,
  },
  {
    x: -2,
    y: 6,
  },
  {
    x: -1,
    y: 6,
  },
  {
    x: 0,
    y: 6,
  },
  {
    x: 1,
    y: 6,
  },
  {
    x: 2,
    y: 6,
  },
  {
    x: 3,
    y: 6,
  },
  {
    x: -5,
    y: 5,
  },
  {
    x: -4,
    y: 5,
  },
  {
    x: -3,
    y: 5,
  },
  {
    x: -2,
    y: 5,
  },
  {
    x: -1,
    y: 5,
  },
  {
    x: 0,
    y: 5,
  },
  {
    x: 1,
    y: 5,
  },
  {
    x: 2,
    y: 5,
  },
  {
    x: 3,
    y: 5,
  },
  {
    x: -4,
    y: 4,
  },
  {
    x: -3,
    y: 4,
  },
  {
    x: -2,
    y: 4,
  },
  {
    x: -1,
    y: 4,
  },
  {
    x: 0,
    y: 4,
  },
  {
    x: 1,
    y: 4,
  },
  {
    x: 2,
    y: 4,
  },
  {
    x: 3,
    y: 4,
  },
  {
    x: 4,
    y: 4,
  },
  {
    x: -5,
    y: 3,
  },
  {
    x: -4,
    y: 3,
  },
  {
    x: -3,
    y: 3,
  },
  {
    x: -2,
    y: 3,
  },
  {
    x: -1,
    y: 3,
  },
  {
    x: 0,
    y: 3,
  },
  {
    x: 1,
    y: 3,
  },
  {
    x: 2,
    y: 3,
  },
  {
    x: 3,
    y: 3,
  },
  {
    x: 4,
    y: 3,
  },
  {
    x: 5,
    y: 3,
  },
  {
    x: -5,
    y: 2,
  },
  {
    x: -4,
    y: 2,
  },
  {
    x: -3,
    y: 2,
  },
  {
    x: -2,
    y: 2,
  },
  {
    x: -1,
    y: 2,
  },
  {
    x: 1,
    y: 2,
  },
  {
    x: 2,
    y: 2,
  },
  {
    x: -2,
    y: 1,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 3,
    y: 1,
  },
  {
    x: 4,
    y: 1,
  },
  {
    x: 5,
    y: 1,
  },
  {
    x: -2,
    y: 0,
  },
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 2,
    y: 0,
  },
  {
    x: 3,
    y: 0,
  },
  {
    x: 4,
    y: 0,
  },
  {
    x: 5,
    y: 0,
  },
  {
    x: 0,
    y: -1,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: 2,
    y: -1,
  },
  {
    x: 3,
    y: -1,
  },
  {
    x: 4,
    y: -1,
  },
  {
    x: 5,
    y: -1,
  },
  {
    x: 0,
    y: -2,
  },
  {
    x: 1,
    y: -2,
  },
  {
    x: 2,
    y: -2,
  },
  {
    x: 3,
    y: -2,
  },
  {
    x: -2,
    y: -3,
  },
  {
    x: 0,
    y: -3,
  },
  {
    x: 2,
    y: -3,
  },
  {
    x: -2,
    y: -4,
  },
  {
    x: 1,
    y: -4,
  },
];

export const TreasureIsland: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();
  const [shownMissingShovelWarning, setShownMissingShovelWarning] =
    useState(false);

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.TreasureIsland, "auto");
  }, []);

  // Load data
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${40 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      >
        <img
          src={background}
          className="absolute inset-0 w-full h-full"
          id={Section.TreasureIsland}
        />
        <IslandTravelWrapper />
        {CLICKABLE_COORDINATES.map(({ x, y }, index) => (
          <MapPlacement key={`${x}-${y}`} x={x} y={y} height={1} width={1}>
            <SandPlot
              id={index}
              shownMissingShovelModal={shownMissingShovelWarning}
              onMissingShovelAcknowledge={() =>
                setShownMissingShovelWarning(true)
              }
            />
          </MapPlacement>
        ))}
        <GoblinDigging />
        <TreasureShop />

        <MapPlacement x={-7} y={9} height={1} width={1}>
          <img
            src={shadow}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `0px`,
              left: `0px`,
            }}
          />
          <img
            src={SUNNYSIDE.npcs.betty}
            className="absolute pointer-events-none z-10"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * -2}px`,
            }}
          />
        </MapPlacement>

        <MapPlacement x={-1} y={10} height={1} width={1}>
          <img
            src={shadow}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `0px`,
              left: `0px`,
            }}
          />
          <img
            src={placeholderNPC2}
            className="absolute pointer-events-none z-10"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 1}px`,
              transform: "scaleX(-1)",
            }}
          />
        </MapPlacement>
      </div>
    </>
  );
};
