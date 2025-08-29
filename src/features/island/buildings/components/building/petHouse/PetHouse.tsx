import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";

export const PetHouse: React.FC = () => {
  return (
    <BuildingImageWrapper name="PetHouse">
      <img
        src={SUNNYSIDE.building.tent}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 46}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
