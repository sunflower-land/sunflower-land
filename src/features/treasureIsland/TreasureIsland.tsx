import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useLayoutEffect, useState } from "react";

import background from "assets/land/treasure_island_2.png";

import { IslandTravelWrapper } from "./components/IslandTravelWrapper";
import { GoblinDigging } from "./components/GoblinDigging";
import { TreasureShop } from "./components/TreasureShop";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { SandPlot } from "./components/SandPlot";
import { BeachConstruction } from "./components/BeachConstruction";
import { PirateQuest } from "features/game/expansion/components/PirateQuest";
import { TreasureTrove } from "./components/TreasureTrove";
import { Hud } from "features/island/hud/Hud";
import { PirateChest } from "features/game/expansion/components/PirateChest";

export const CLICKABLE_COORDINATES: Coordinates[] = [];

// Create the coordinates for the 8x8 grid of plots
const START = { x: -3, y: 4 };
const END = { x: 4, y: -3 };
for (let y = START.y; y >= END.y; y--) {
  for (let x = START.x; x <= END.x; x++) {
    CLICKABLE_COORDINATES.push({
      x,
      y,
    });
  }
}

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
          height: `${50 * GRID_WIDTH_PX}px`,
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
        <BeachConstruction />
        <PirateQuest />
        <TreasureTrove />
        <PirateChest />
      </div>
      <Hud isFarming={false} location="farm" />
    </>
  );
};
