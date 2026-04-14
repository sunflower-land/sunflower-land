import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/twister_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const TwisterRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Twister Rug">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="TwisterRug"
      />
    </SFTDetailPopover>
  );
};
