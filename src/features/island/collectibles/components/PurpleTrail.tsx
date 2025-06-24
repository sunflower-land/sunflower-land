import React from "react";

import image from "assets/sfts/purple_trail.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PurpleTrail: React.FC = () => {
  return (
    <SFTDetailPopover name="Purple Trail">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute pointer-events-none"
        alt="Purple Trail"
      />
    </SFTDetailPopover>
  );
};
