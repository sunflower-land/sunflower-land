import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/jelly_lamp.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const JellyLamp: React.FC = () => {
  return (
    <SFTDetailPopover name="Jelly Lamp">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Jelly Lamp"
        />
      </>
    </SFTDetailPopover>
  );
};
