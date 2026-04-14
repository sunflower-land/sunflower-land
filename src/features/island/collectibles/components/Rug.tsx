import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Rug: React.FC = () => {
  return (
    <SFTDetailPopover name="Rug">
      <>
        <img
          src={SUNNYSIDE.decorations.rug}
          style={{
            width: `${PIXEL_SCALE * 38}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 5}px`,
          }}
          className="absolute"
          alt="Rug"
        />
      </>
    </SFTDetailPopover>
  );
};
