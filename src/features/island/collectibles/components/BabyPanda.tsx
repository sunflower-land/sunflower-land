import React from "react";

import image from "assets/sfts/baby_panda.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BabyPanda: React.FC = () => {
  return (
    <SFTDetailPopover name="Baby Panda">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Baby Panda"
        />
      </>
    </SFTDetailPopover>
  );
};
