import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const WarTombstone: React.FC = () => {
  return (
    <SFTDetailPopover name="War Tombstone">
      <img
        src={SUNNYSIDE.decorations.warTombstone}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          left: `${PIXEL_SCALE * 1}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="War Tombstone"
      />
    </SFTDetailPopover>
  );
};
