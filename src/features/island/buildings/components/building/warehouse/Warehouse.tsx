import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { WAREHOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Warehouse: React.FC<BuildingProps> = ({ season }) => {
  return (
    <SFTDetailPopover name="Warehouse">
      <div
        className="absolute"
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
    </SFTDetailPopover>
  );
};
