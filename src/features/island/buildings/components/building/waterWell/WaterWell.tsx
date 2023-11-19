import React from "react";

import well from "assets/buildings/well1.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";

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
      <img
        src={well}
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
