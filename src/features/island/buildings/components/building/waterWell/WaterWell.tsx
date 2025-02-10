import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { WATER_WELL_VARIANTS } from "features/island/lib/alternateArt";

export const WaterWell: React.FC<BuildingProps> = ({ season }) => {
  return (
    <BuildingImageWrapper name="Water Well" nonInteractible>
      <img
        src={WATER_WELL_VARIANTS[season]}
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute pointer-events-none"
      />
    </BuildingImageWrapper>
  );
};
