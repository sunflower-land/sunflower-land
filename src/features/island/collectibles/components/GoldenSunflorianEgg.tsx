import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/golden_sunflorian_egg.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoldenSunflorianEgg: React.FC = () => {
  return (
    <SFTDetailPopover name="Golden Sunflorian Egg">
      <div
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 transform -translate-x-1/2"
          alt="Golden Sunflorian Egg"
        />
      </div>
    </SFTDetailPopover>
  );
};
