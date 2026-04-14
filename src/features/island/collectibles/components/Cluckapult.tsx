import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/cluckapult.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Cluckapult: React.FC = () => {
  return (
    <SFTDetailPopover name="Cluckapult">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 31}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Cluckapult"
      />
    </SFTDetailPopover>
  );
};
