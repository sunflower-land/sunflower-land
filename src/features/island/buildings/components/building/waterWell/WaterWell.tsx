import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { FarmSprite } from "features/game/expansion/FarmSprite";

export const WaterWell: React.FC<BuildingProps> = ({
  onRemove,
  isBuilt,
  buildingIndex,
}) => {
  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      return;
    }
  };

  return (
    <BuildingImageWrapper
      name="Water Well"
      index={buildingIndex}
      onClick={handleClick}
      nonInteractible={!onRemove}
    >
      <FarmSprite
        image={SUNNYSIDE.building.well}
        width={25}
        bottom={0}
        left={PIXEL_SCALE * 4}
        pointer-events="none"
      />
    </BuildingImageWrapper>
  );
};
