import React from "react";
import { Beehive } from "./components/Beehive";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import beegif from "assets/buildings/beehive.gif";
import { Bee } from "./components/Bee";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Bees: React.FC = () => {
  return (
    // Container
    <div
      style={{
        height: `${GRID_WIDTH_PX * 6}px`,
        width: `${GRID_WIDTH_PX * 20}px`,
        left: `calc(50% -  ${GRID_WIDTH_PX * -9.5}px)`,
        top: `calc(50% -  ${GRID_WIDTH_PX * 27.5}px)`,
      }}
      className="absolute"
    >
      <div className="h-full w-full relative">
        {/* Navigation Center Point */}
        <span
          id={Section["Bee Hive"]}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <Beehive />

        <Bee />
      </div>
    </div>
  );
};