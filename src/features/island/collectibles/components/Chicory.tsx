import React from "react";

import image from "assets/sfts/chicory.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Chicory: React.FC = () => {
  return (
    <SFTDetailPopover name="Chicory">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 19}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Chicory"
        />
      </>
    </SFTDetailPopover>
  );
};
