import React from "react";

import bale from "assets/sfts/aoe/bale.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Bale: React.FC = () => {
  return (
    <SFTDetailPopover name="Bale">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={bale}
          style={{
            width: `${PIXEL_SCALE * 28}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Bale"
        />
      </div>
    </SFTDetailPopover>
  );
};
