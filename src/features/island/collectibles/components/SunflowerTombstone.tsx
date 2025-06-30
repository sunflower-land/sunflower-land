import React from "react";

import sunflowerTombstone from "assets/sfts/sunflower_tombstone.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SunflowerTombstone: React.FC = () => {
  return (
    <SFTDetailPopover name="Sunflower Tombstone">
      <img
        src={sunflowerTombstone}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
        alt="Sunflower Tombstone"
      />
    </SFTDetailPopover>
  );
};
