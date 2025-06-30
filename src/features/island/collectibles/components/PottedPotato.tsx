import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PottedPotato: React.FC = () => {
  return (
    <SFTDetailPopover name="Potted Potato">
      <>
        <img
          src={SUNNYSIDE.decorations.pottedPotato}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
          alt="Potted Potato"
        />
      </>
    </SFTDetailPopover>
  );
};
