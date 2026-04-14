import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/bumpkin_candles.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BumpkinCandles: React.FC = () => {
  return (
    <SFTDetailPopover name="Bumpkin Candles">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 9}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Bumpkin Candles"
      />
    </SFTDetailPopover>
  );
};
