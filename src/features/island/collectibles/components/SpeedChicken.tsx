import React from "react";

import speedChicken from "assets/animals/chickens/speed_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SpeedChicken: React.FC = () => {
  return (
    <SFTDetailPopover name="Speed Chicken">
      <img
        src={speedChicken}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px `,
        }}
        className="absolute"
        alt="Speed Chicken"
      />
    </SFTDetailPopover>
  );
};
