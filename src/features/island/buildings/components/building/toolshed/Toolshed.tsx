import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { TOOLSHED_VARIANTS } from "features/island/lib/alternateArt";

export const Toolshed: React.FC<BuildingProps> = ({ season }) => {
  return (
    <BuildingImageWrapper name="Toolshed" nonInteractible>
      <div
        className="absolute pointer-events-none"
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
    </BuildingImageWrapper>
  );
};
