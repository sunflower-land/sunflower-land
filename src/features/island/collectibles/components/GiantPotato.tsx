import React from "react";

import giantPotato from "assets/sfts/giant_potato.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GiantPotato: React.FC = () => {
  return (
    <SFTDetailPopover name="Giant Potato">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 17}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={giantPotato}
          style={{
            width: `${PIXEL_SCALE * 17}px`,
          }}
          alt="Giant Potato"
        />
      </div>
    </SFTDetailPopover>
  );
};
