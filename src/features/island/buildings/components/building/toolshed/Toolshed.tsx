import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { TOOLSHED_VARIANTS } from "features/island/lib/alternateArt";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Toolshed: React.FC<BuildingProps> = ({ season }) => {
  return (
    <SFTDetailPopover name="Toolshed">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 36}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -2}px`,
        }}
      >
        <img
          src={TOOLSHED_VARIANTS[season]}
          style={{
            width: `${PIXEL_SCALE * 36}px`,
          }}
        />
      </div>
    </SFTDetailPopover>
  );
};
