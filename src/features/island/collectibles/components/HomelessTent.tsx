import React from "react";

import homelessTent from "assets/sfts/homeless_tent.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const HomelessTent: React.FC = () => {
  return (
    <SFTDetailPopover name="Homeless Tent">
      <img
        src={homelessTent}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 0}px `,
          right: `${PIXEL_SCALE * 2}px `,
        }}
        className="absolute"
        alt="homeless Tent"
      />
    </SFTDetailPopover>
  );
};
