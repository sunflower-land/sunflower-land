import React from "react";

import tent from "assets/buildings/tent.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { BuildingImageWrapper } from "../BuildingImageWrapper";

export const Tent: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
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
    <BuildingImageWrapper onClick={handleClick} nonInteractible>
      <img
        src={tent}
        className="absolute bottom-0"
        style={{
          width: `${PIXEL_SCALE * 46}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
