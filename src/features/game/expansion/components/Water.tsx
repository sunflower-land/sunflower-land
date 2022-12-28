import React, { useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import dragonfly from "assets/decorations/dragonfly.gif";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
// import swimmer from "assets/npcs/swimmer.gif";
import swimmer from "assets/events/christmas/npcs/swimmer.gif";
import pirateIsland from "assets/land/desert_island.webp";
import bearIsland from "assets/land/bear_island.webp";
import abandonedLand from "assets/land/abandoned_land.webp";
import snowIsland from "assets/land/snow_island.webp";

import { MapPlacement } from "./MapPlacement";
import { Snorkler } from "./water/Snorkler";
import { SharkBumpkin } from "./water/SharkBumpkin";
import { Arcade } from "features/community/arcade/Arcade";
import { FarmerQuest } from "features/island/farmerQuest/FarmerQuest";

//Icebergs and north pole
import iceberg1 from "assets/events/christmas/decorations/icebergs/iceberg_1.gif";
import iceberg2 from "assets/events/christmas/decorations/icebergs/iceberg_2.gif";
import iceberg3 from "assets/events/christmas/decorations/icebergs/iceberg_3.gif";
import iceberg4 from "assets/events/christmas/decorations/icebergs/iceberg_4.gif";
import northPole from "assets/events/christmas/land/north_pole.gif";
// random seal spawn spots
import { randomInt } from "lib/utils/random";
import { LostSeal } from "features/community/seal/Seal";
import { Salesman } from "features/farming/salesman/Salesman";
import { merchantAudio } from "lib/utils/sfx";
import { NorthPoleModal } from "features/community/northpole/NorthPoleModal";

const spawn = [
  [40.1, -3],
  [35, 30],
  [5, 35],
  [5, -3],
];

const getRandomSpawn = () => {
  const randomSpawn = randomInt(0, 4);
  return spawn[randomSpawn];
};

export const LAND_WIDTH = 6;

interface Props {
  level: number;
}

export const Water: React.FC<Props> = ({ level }) => {
  // As the land gets bigger, push the water decorations out
  const [showModal, setShowModal] = useState(false);
  const offset = Math.floor(Math.sqrt(level)) * LAND_WIDTH;
  const [sealSpawn, setSealSpawn] = React.useState(getRandomSpawn());

  const openMerchant = () => {
    setShowModal(true);
    //Checks if merchantAudio is playing, if false, plays the sound
    if (!merchantAudio.playing()) {
      merchantAudio.play();
    }
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

      <MapPlacement x={offset + 4} y={6} width={3}>
        <img
          src={swimmer}
          style={{
            width: `${16 * GRID_WIDTH_PX}px`,
            transform: "scaleX(-1)",
            zIndex: 2,
          }}
        />
      </MapPlacement>
      {/*<MapPlacement x={offset + 6} y={6} width={1}>*/}
      {/*  <img*/}
      {/*    src={cossies}*/}
      {/*    style={{*/}
      {/*      width: `${GRID_WIDTH_PX}px`,*/}
      {/*      transform: "scaleX(-1)",*/}
      {/*      position: "relative",*/}
      {/*      left: `${16 * PIXEL_SCALE}px`,*/}
      {/*      zIndex: 2,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</MapPlacement>*/}

      <MapPlacement x={20} y={25} width={6}>
        <img
          src={bearIsland}
          style={{
            width: `${PIXEL_SCALE * 86}px`,
          }}
        />
      </MapPlacement>
      <Arcade left={40.25} top={-6.375} />

      <LostSeal left={sealSpawn[0]} top={sealSpawn[1]} />

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

      <MapPlacement x={-5} y={-16} width={6}>
        <img
          src={snowIsland}
          style={{
            width: `${PIXEL_SCALE * 82}px`,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-15} y={-10} width={6}>
        <img
          src={iceberg1}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </MapPlacement>
      <MapPlacement x={-12} y={16} width={6}>
        <img
          src={iceberg2}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </MapPlacement>
      <MapPlacement x={18} y={18} width={6}>
        <img
          src={iceberg3}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </MapPlacement>
      <MapPlacement x={4} y={-13} width={12}>
        <img
          src={iceberg4}
          style={{
            width: `${PIXEL_SCALE * 96}px`,
          }}
        />
      </MapPlacement>
      <MapPlacement x={0} y={30} width={12}>
        <div>
          <img
            className="hover:img-highlight cursor-pointer"
            onClick={openMerchant}
            src={northPole}
            style={{
              width: `${PIXEL_SCALE * 144}px`,
            }}
          />
          <NorthPoleModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </MapPlacement>
      <Salesman />
    </div>
  );
};
