import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PottedPumpkin: React.FC = () => {
  return (
    <SFTDetailPopover name="Potted Pumpkin">
      <>
        <img
          src={SUNNYSIDE.decorations.pottedPumpkin}
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
          alt="Potted Pumpkin"
        />
      </>
    </SFTDetailPopover>
  );
};
