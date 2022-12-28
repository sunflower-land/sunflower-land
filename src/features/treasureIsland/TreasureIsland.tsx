import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useLayoutEffect } from "react";

import background from "assets/land/treasure_island.webp";
import placeholderNPC from "assets/npcs/betty.gif";
import placeholderNPC2 from "assets/npcs/artisian.gif";
import shadow from "assets/npcs/shadow.png";

import { IslandTravelWrapper } from "./components/IslandTravelWrapper";
import { SandHills } from "./components/SandHills";
import { GoblinDigging } from "./components/GoblinDigging";
import { TreasureShop } from "./components/TreasureShop";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const TreasureIsland: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.TreasureIsland, "auto");
  }, []);

  // Load data
  return (
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
      <SandHills />
      <GoblinDigging />
      <TreasureShop />

      <MapPlacement x={-8} y={10} height={1} width={1}>
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
          src={placeholderNPC}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * -2}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-2} y={11} height={1} width={1}>
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
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
            transform: "scaleX(-1)",
          }}
        />
      </MapPlacement>
    </div>
  );
};
