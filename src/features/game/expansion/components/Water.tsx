import React, { useState } from "react";

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
import { FarmerQuest } from "features/island/farmerQuest/FarmerQuest";

import { merchantAudio } from "lib/utils/sfx";
import { ProjectDignityFrogs } from "features/community/components/ProjectDignityFrogs";
import { ProjectDignitySeals } from "features/community/components/ProjectDignitySeals";
import CommunityBoundary from "features/community/components/CommunityBoundary";
import { SUNNYSIDE } from "assets/sunnyside";

export const LAND_WIDTH = 6;

interface Props {
  level: number;
}

export const Water: React.FC<Props> = ({ level }) => {
  // As the land gets bigger, push the water decorations out
  const [showModal, setShowModal] = useState(false);
  const offset = Math.floor(Math.sqrt(level)) * LAND_WIDTH;

  const openMerchant = () => {
    setShowModal(true);
    //Checks if merchantAudio is playing, if false, plays the sound
    if (!merchantAudio.playing()) {
      merchantAudio.play();
    }
  };

  const frogCoordinates = {
    x: level >= 7 ? -2 : 5,
    y: level >= 7 ? -10.5 : -4.5,
  };

  return (
    // Container
    <div
      style={{
        height: "inherit",
      }}
    >
      {/* Above Land */}
      {/* <Shark side="top" /> */}

      {/* Below Land */}
      {/* <Shark side="bottom" /> */}

      {/* Navigation Center Point */}

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

      <Snorkler level={level} />

      <SharkBumpkin level={level} />

      <MapPlacement x={offset + 4} y={6} width={1}>
        <img
          src={SUNNYSIDE.npcs.swimmer}
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

      <MapPlacement x={20} y={25} width={6}>
        <img
          src={bearIsland}
          style={{
            width: `${PIXEL_SCALE * 86}px`,
          }}
        />
      </MapPlacement>
      <Arcade left={40.25} top={-6.375} />

      <FarmerQuest />

      <MapPlacement x={-20} y={-15} width={6}>
        <img
          src={pirateIsland}
          style={{
            width: `${PIXEL_SCALE * 78}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={18} y={-13} width={6}>
        <img
          src={abandonedLand}
          style={{
            width: `${PIXEL_SCALE * 46}px`,
          }}
        />
      </MapPlacement>

      {/* <MapPlacement x={-5} y={-16} width={6}>
        <img
          src={smallIsland}
          style={{
            width: `${PIXEL_SCALE * 82}px`,
          }}
        />
      </MapPlacement> */}

      {/* Community Assets */}
      <CommunityBoundary>
        <MapPlacement x={frogCoordinates.x} y={frogCoordinates.y} width={6}>
          <ProjectDignityFrogs left={0} top={0} />
        </MapPlacement>

        <ProjectDignitySeals isGarden={false} />
      </CommunityBoundary>
    </div>
  );
};
