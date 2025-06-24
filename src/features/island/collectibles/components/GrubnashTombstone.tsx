import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GrubnashTombstone: React.FC = () => {
  return (
    <SFTDetailPopover name="Grubnash Tombstone">
      <>
        <img
          src={SUNNYSIDE.decorations.grubnashTombstone}
          style={{
            width: `${PIXEL_SCALE * 9}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 3.5}px`,
          }}
          className="absolute"
          alt="Grubnash Tombstone"
        />
      </>
    </SFTDetailPopover>
  );
};
