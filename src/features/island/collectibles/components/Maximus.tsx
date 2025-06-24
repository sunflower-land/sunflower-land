import React from "react";

import image from "assets/sfts/maximus.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Maximus: React.FC = () => {
  return (
    <SFTDetailPopover name="Maximus">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 5}px`,
        }}
        className="absolute pointer-events-none"
        alt="Maximus"
      />
    </SFTDetailPopover>
  );
};
