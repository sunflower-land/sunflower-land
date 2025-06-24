import React from "react";

import rooster from "assets/animals/chickens/rooster.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Rooster: React.FC = () => {
  return (
    <SFTDetailPopover name="Rooster">
      <img
        src={rooster}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px `,
        }}
        alt="Rooster"
        className="absolute"
      />
    </SFTDetailPopover>
  );
};
