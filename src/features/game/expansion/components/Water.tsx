import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

import dragonfly from "assets/decorations/dragonfly.gif";
import Shark from "./water/Shark";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import swimmer from "assets/npcs/swimmer.gif";
import { MapPlacement } from "./MapPlacement";

const LAND_WIDTH = 6;

interface Props {
  level: number;
}

export const Water: React.FC<Props> = ({ level }) => {
  // As the land gets bigger, push the water decorations out
  const offset = Math.floor(Math.sqrt(level)) * LAND_WIDTH;

  return (
    // Container
    <div
      style={{
        height: "inherit",
      }}
      className="absolute inset-0"
    >
      {/* Above Land */}
      <Shark side="top" />

      {/* Below Land */}
      <Shark side="bottom" />

      {/* Navigation Center Point */}
      <div className="h-full w-full relative">
        <span
          id={Section.Water}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <MapPlacement x={-offset} y={1}>
          <img
            style={{
              width: `${GRID_WIDTH_PX * 1.185}px`,
            }}
            src={dragonfly}
            className="animate-float"
          />
        </MapPlacement>

        <MapPlacement x={-3 - offset} y={-1}>
          <img
            src={goblinSwimming}
            style={{
              width: `${GRID_WIDTH_PX * 6.1}px`,
            }}
          />
        </MapPlacement>

        <MapPlacement x={-2} y={offset + 2}>
          <img
            src={goblinSnorkling}
            style={{
              width: `${GRID_WIDTH_PX * 3.81}px`,
            }}
          />
        </MapPlacement>

        <MapPlacement x={offset + 4} y={6}>
          <img
            src={swimmer}
            style={{
              width: `${GRID_WIDTH_PX * 1}px`,
              transform: "scaleX(-1)",
              zIndex: "2",
            }}
          />
        </MapPlacement>
      </div>
    </div>
  );
};
