import React from "react";

import image from "assets/sfts/hoot.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Hoot: React.FC = () => {
  return (
    <SFTDetailPopover name="Hoot">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Hoot"
        />
      </>
    </SFTDetailPopover>
  );
};
