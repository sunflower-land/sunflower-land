import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/battlecry_drum.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BattlecryDrum: React.FC = () => {
  return (
    <SFTDetailPopover name="Battlecry Drum">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="BattlecryDrum"
      />
    </SFTDetailPopover>
  );
};
