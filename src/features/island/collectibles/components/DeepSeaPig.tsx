import React from "react";

import deepSeaPigTrophy from "assets/fish/deep_sea_pig_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DeepSeaPig: React.FC = () => {
  return (
    <SFTDetailPopover name="Deep Sea Pig">
      <>
        <img
          src={deepSeaPigTrophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Deep Sea Pig"
        />
      </>
    </SFTDetailPopover>
  );
};
