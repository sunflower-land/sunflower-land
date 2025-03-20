import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { WAREHOUSE_VARIANTS } from "features/island/lib/alternateArt";

export const Warehouse: React.FC<BuildingProps> = ({ season }) => {
  return (
    <BuildingImageWrapper name="Warehouse" nonInteractible>
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 50}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
      >
        <img
          src={WAREHOUSE_VARIANTS[season]}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </div>
    </BuildingImageWrapper>
  );
};
