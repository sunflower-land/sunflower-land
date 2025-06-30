import React from "react";

import grainGrinder from "assets/sfts/grain_grinder.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GrainGrinder: React.FC = () => {
  return (
    <SFTDetailPopover name="Grain Grinder">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `50%`,
          transform: `translateX(-50%)`,
        }}
      >
        <img
          src={grainGrinder}
          style={{
            width: `${PIXEL_SCALE * 26}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Grain Grinder"
        />
      </div>
    </SFTDetailPopover>
  );
};
