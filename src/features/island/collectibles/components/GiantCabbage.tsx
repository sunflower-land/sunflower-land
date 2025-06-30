import React from "react";

import giantCabbage from "assets/sfts/giant_cabbage.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GiantCabbage: React.FC = () => {
  return (
    <SFTDetailPopover name="Giant Cabbage">
      <>
        <img
          src={giantCabbage}
          style={{
            width: `${PIXEL_SCALE * 27}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
          className="absolute"
          alt="Giant Cabbage"
        />
      </>
    </SFTDetailPopover>
  );
};
