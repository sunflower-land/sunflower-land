import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/silver_stallion.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SilverStallion: React.FC = () => {
  return (
    <SFTDetailPopover name="Silver Stallion">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        alt="SilverStallion"
        className="absolute"
      />
    </SFTDetailPopover>
  );
};
