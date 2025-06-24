import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Cactus: React.FC = () => {
  return (
    <SFTDetailPopover name="Cactus">
      <>
        <img
          src={SUNNYSIDE.decorations.cactus}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
          className="absolute"
          alt="Cactus"
        />
      </>
    </SFTDetailPopover>
  );
};
