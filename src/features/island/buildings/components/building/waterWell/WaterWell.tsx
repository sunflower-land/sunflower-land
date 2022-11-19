import React from "react";

import well from "assets/buildings/well1.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";

export const WaterWell: React.FC<BuildingProps> = ({ onRemove }) => {
  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }
  };
  return (
    <BuildingImageWrapper onClick={handleClick} nonInteractible={true}>
      <img
        src={well}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        className="relative bottom-2"
      />
    </BuildingImageWrapper>
  );
};
