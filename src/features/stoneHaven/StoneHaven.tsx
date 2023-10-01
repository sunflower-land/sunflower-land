import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useLayoutEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import ocean from "assets/decorations/ocean.gif";
import background from "assets/land/stone_haven.webp";
import { GameProvider } from "features/game/GameProvider";
import { IslandTravelWrapper } from "./components/IslandTravelWrapper";
import { GoblinCook } from "./components/GoblinCooking";
import { StoneHavenBlacksmith } from "./components/StoneHavenBlacksmith";
import { StoneHavenJumper } from "./components/StoneHavenJumper";
import { StoneHavenMiner } from "./components/StoneHavenMiner";

export const StoneHaven: React.FC = () => {
  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.StoneHaven, "auto");
  }, []);

  // Load data
  return (
    <GameProvider>
      <ScrollContainer
        className="bg-blue-300 overflow-scroll relative w-full h-full overscroll-none"
        innerRef={container}
      >
        <div
          className="relative"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
          }}
        >
          <div
            className="absolute inset-0 bg-repeat w-full h-full"
            style={{
              backgroundImage: `url(${ocean})`,
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
          />
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
              id={Section.StoneHaven}
            />
            <IslandTravelWrapper />
            <GoblinCook />
            <StoneHavenBlacksmith />
            <StoneHavenJumper />
            <StoneHavenMiner />
          </div>
        </div>
      </ScrollContainer>
    </GameProvider>
  );
};
