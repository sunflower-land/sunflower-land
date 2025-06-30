import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const WhiteTulips: React.FC = () => {
  return (
    <SFTDetailPopover name="White Tulips">
      <img
        src={SUNNYSIDE.decorations.whiteTulips}
        style={{
          width: `${PIXEL_SCALE * 8}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="White Tulip"
      />
    </SFTDetailPopover>
  );
};
