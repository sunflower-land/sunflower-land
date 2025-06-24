import React from "react";

import image from "assets/sfts/bumpkin_nutcracker.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Nutcracker: React.FC = () => {
  return (
    <SFTDetailPopover name="Nutcracker">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
          alt="Nutcracker"
        />
      </>
    </SFTDetailPopover>
  );
};
