import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import lilyEgg from "assets/sfts/lily_egg.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const LilyEgg: React.FC = () => {
  return (
    <SFTDetailPopover name="Lily Egg">
      <img
        src={lilyEgg}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Lily Egg"
      />
    </SFTDetailPopover>
  );
};
