import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

import { CropZoneOne } from "./components/CropZoneOne";
import { CropZoneTwo } from "./components/CropZoneTwo";
import { CropZoneThree } from "./components/CropZoneThree";
import { CropZoneFour } from "./components/CropZoneFour";
import { WheatGoblin } from "./components/WheatGoblin";

export const Crops: React.FC = () => {
  return (
    <>
      {/* Main Crop Fields */}
      <div
        style={{
          width: `${GRID_WIDTH_PX * 25}px`,
          height: `${GRID_WIDTH_PX * 12}px`,
          left: `calc(50% - ${GRID_WIDTH_PX * 13}px)`,
          top: `calc(50% - ${GRID_WIDTH_PX * 23}px)`,
        }}
        className="absolute"
      >
        {/* Navigation Center Point */}
        <span
          id={Section.Crops}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <CropZoneOne />
        <CropZoneTwo />
        <CropZoneThree />
        <CropZoneFour />
      </div>
      <WheatGoblin />
    </>
  );
};
