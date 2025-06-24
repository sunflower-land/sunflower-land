import React from "react";

import abandonedBear from "assets/sfts/bears/abandoned_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const AbandonedBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Abandoned Bear">
      <img
        src={abandonedBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Abandoned Bear"
      />
    </SFTDetailPopover>
  );
};
