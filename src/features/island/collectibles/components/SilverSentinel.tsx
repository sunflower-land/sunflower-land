import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/silver_sentinel.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SilverSentinel: React.FC = () => {
  return (
    <SFTDetailPopover name="Silver Sentinel">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        alt="SilverSentinel"
        className="absolute"
      />
    </SFTDetailPopover>
  );
};
