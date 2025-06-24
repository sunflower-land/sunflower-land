import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PineTree: React.FC = () => {
  return (
    <SFTDetailPopover name="Pine Tree">
      <>
        <img
          src={SUNNYSIDE.decorations.pineTree}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Pine Tree"
        />
      </>
    </SFTDetailPopover>
  );
};
