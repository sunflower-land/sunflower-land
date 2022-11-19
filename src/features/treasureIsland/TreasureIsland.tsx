import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useEffect } from "react";

import background from "assets/land/treasure_island.png";
import { IslandTravelWrapper } from "./components/IslandTravelWrapper";
import { SandHills } from "./components/SandHills";
import { GoblinDigging } from "./components/GoblinDigging";
import { ShovelShop } from "./components/ShovelShop";

export const TreasureIsland: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with island centered
    scrollIntoView(Section.TreasureIsland, "auto");
  }, [scrollIntoView]);

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
      <ShovelShop />
    </div>
  );
};
