import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";

export const Warehouse: React.FC<BuildingProps> = ({ onRemove, isBuilt }) => {
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
      name="Warehouse"
      onClick={handleClick}
      nonInteractible={!onRemove}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 50}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
      >
        <img
          src={SUNNYSIDE.building.warehouse}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </div>
    </BuildingImageWrapper>
  );
};
