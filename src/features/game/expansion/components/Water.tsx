import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

import dragonfly from "assets/decorations/dragonfly.gif";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import swimmer from "assets/npcs/swimmer.gif";
import cossies from "assets/decorations/cossies.png";
import island from "assets/land/islands/island.png";
import chest from "assets/icons/chest.png";

import { MapPlacement } from "./MapPlacement";

export const LAND_WIDTH = 6;

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
      {/* <Shark side="top" /> */}

      {/* Below Land */}
      {/* <Shark side="bottom" /> */}

      {/* Navigation Center Point */}
      <div className="h-full w-full relative">
        <span
          id={Section.Water}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <MapPlacement x={-offset} y={1} width={1.185}>
          <img
            style={{
              width: `${GRID_WIDTH_PX * 1.185}px`,
            }}
            src={dragonfly}
            className="animate-float"
          />
        </MapPlacement>

        <MapPlacement x={-3 - offset} y={-1} width={6.1}>
          <img
            src={goblinSwimming}
            style={{
              width: `${GRID_WIDTH_PX * 6.1}px`,
            }}
          />
        </MapPlacement>

        <MapPlacement x={-2} y={offset + 2} width={3}>
          <img
            src={goblinSnorkling}
            style={{
              width: `${3 * GRID_WIDTH_PX}px`,
            }}
          />
        </MapPlacement>

        <MapPlacement x={offset + 4} y={6} width={1}>
          <img
            src={swimmer}
            style={{
              width: `${1 * GRID_WIDTH_PX}px`,
              transform: "scaleX(-1)",
              zIndex: 2,
            }}
          />
        </MapPlacement>
        <MapPlacement x={offset + 4} y={6} width={1}>
          <img
            src={cossies}
            style={{
              width: `${GRID_WIDTH_PX}px`,
              transform: "scaleX(-1)",
              position: "relative",
              left: `${16 * PIXEL_SCALE}px`,
              zIndex: 2,
            }}
          />
        </MapPlacement>

        {level < 7 && (
          <MapPlacement x={-8} y={-5}>
            <img
              src={island}
              style={{
                width: `${PIXEL_SCALE * 48}px`,
              }}
            />
            <img
              src={chest}
              className="absolute bottom-16 left-1/2 -translate-x-1/2"
              style={{
                width: `${16 * PIXEL_SCALE}px`,
              }}
            />
          </MapPlacement>
        )}
      </div>
    </div>
  );
};
