import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/generosity_flag.png";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GenerosityFlag: React.FC = () => {
  return (
    <SFTDetailPopover name="Generosity Flag">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Generosity Flag"
        />
      </>
    </SFTDetailPopover>
  );
};
