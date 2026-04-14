import React from "react";

import image from "assets/decorations/giant_dawn_mushroom.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GiantDawnMushroom: React.FC = () => {
  return (
    <SFTDetailPopover name="Giant Dawn Mushroom">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 28}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="GiantDawnMushroom"
        />
      </>
    </SFTDetailPopover>
  );
};
