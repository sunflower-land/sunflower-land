import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import dragonfly from "assets/decorations/dragonfly.gif";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import cossies from "assets/decorations/cossies.png";
import pirateIsland from "assets/land/desert_island.webp";
import bearIsland from "assets/land/bear_island.webp";
import abandonedLand from "assets/land/abandoned_land.webp";

import { MapPlacement } from "./MapPlacement";
import { Snorkler } from "./water/Snorkler";
import { SharkBumpkin } from "./water/SharkBumpkin";
import { Arcade } from "features/community/arcade/Arcade";
import { FruitQuest } from "features/island/farmerQuest/FruitQuest";

import { ProjectDignityFrogs } from "features/community/components/ProjectDignityFrogs";
import { ProjectDignitySeals } from "features/community/components/ProjectDignitySeals";
import CommunityBoundary from "features/community/components/CommunityBoundary";
import { SUNNYSIDE } from "assets/sunnyside";
import { Pirate } from "./Pirate";
import { DailyReward } from "./dailyReward/DailyReward";
import { PartyIsland } from "./PartyIsland";

export const LAND_WIDTH = 6;

interface Props {
  level: number;
}

export const WaterComponent: React.FC<Props> = ({ level }) => {
  // As the land gets bigger, push the water decorations out
  const offset = Math.ceil((Math.sqrt(level + 1) * LAND_WIDTH) / 2);

  const frogCoordinates = {
    x: level >= 7 ? -2 : 5,
    y: level >= 7 ? -11 : -5,
  };

  return (
    // Container
    <div
      style={{
        height: "inherit",
      }}
    >
      {/* Navigation Center Point */}

      <MapPlacement x={-6 - offset} y={3} width={1}>
        <img
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            left: `${PIXEL_SCALE * 1}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
          }}
          src={dragonfly}
          className="animate-float"
        />
      </MapPlacement>

      <MapPlacement x={-8 - offset} y={-1} width={6}>
        <img
          src={goblinSwimming}
          style={{
            width: `${PIXEL_SCALE * 96}px`,
          }}
        />
      </MapPlacement>

      <Snorkler x={-2} y={offset + 9} />

      <SharkBumpkin x={-8} y={offset + 12} />

      <MapPlacement x={offset + 8} y={6} width={1}>
        <img
          src={SUNNYSIDE.npcs.swimmer}
          className="absolute pointer-events-none"
          style={{
            width: `${1 * GRID_WIDTH_PX}px`,
            transform: "scaleX(-1)",
            zIndex: 2,
          }}
        />
        <img
          src={cossies}
          className="absolute pointer-events-none"
          style={{
            width: `${GRID_WIDTH_PX}px`,
            transform: "scaleX(-1)",
            left: `${16 * PIXEL_SCALE}px`,
            zIndex: 2,
          }}
        />
      </MapPlacement>

      <MapPlacement x={20} y={25} width={6}>
        <img
          src={bearIsland}
          style={{
            width: `${PIXEL_SCALE * 86}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            top: `${GRID_WIDTH_PX * 2 - PIXEL_SCALE * 1}px`,
            left: `${GRID_WIDTH_PX * 3}px`,
          }}
        >
          <Arcade />
        </div>
      </MapPlacement>

      <PartyIsland />
      <FruitQuest />

      <MapPlacement x={-20} y={-15} width={6}>
        <img
          src={pirateIsland}
          style={{
            width: `${PIXEL_SCALE * 78}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            top: `${GRID_WIDTH_PX * 3}px`,
            left: `${GRID_WIDTH_PX * 2}px`,
          }}
        >
          <Pirate />
        </div>
      </MapPlacement>
      <MapPlacement x={16} y={-11} width={6}>
        <DailyReward />
        <img
          src={abandonedLand}
          style={{
            width: `${PIXEL_SCALE * 46}px`,
          }}
        />
      </MapPlacement>
      {/* Community Assets */}
      <CommunityBoundary>
        <MapPlacement x={frogCoordinates.x} y={frogCoordinates.y}>
          <ProjectDignityFrogs left={0} top={0} />
        </MapPlacement>

        <ProjectDignitySeals isGarden={false} />
      </CommunityBoundary>
    </div>
  );
};

export const Water = React.memo(WaterComponent);
