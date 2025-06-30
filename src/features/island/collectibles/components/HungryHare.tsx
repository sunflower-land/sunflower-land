import React from "react";

import image from "assets/sfts/hungryHare.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const HungryHare: React.FC = () => {
  return (
    <SFTDetailPopover name="Hungry Hare">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 5}px`,
          }}
          className="absolute"
          alt="Basic Bear"
        />
      </>
    </SFTDetailPopover>
  );
};
