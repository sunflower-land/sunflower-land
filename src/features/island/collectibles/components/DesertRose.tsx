import React from "react";

import image from "assets/sfts/desert_rose.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DesertRose: React.FC = () => {
  return (
    <SFTDetailPopover name="Desert Rose">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="DesertRose"
        />
      </>
    </SFTDetailPopover>
  );
};
