import React from "react";

import alienChicken from "assets/sfts/alien_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const AlienChicken: React.FC = () => {
  return (
    <SFTDetailPopover name="Alien Chicken">
      <div
        className="absolute bottom-0"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
      >
        <img
          src={alienChicken}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          alt="Alien Chicken"
        />
      </div>
    </SFTDetailPopover>
  );
};
