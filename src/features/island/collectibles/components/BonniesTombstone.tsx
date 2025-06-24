import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BonniesTombstone: React.FC = () => {
  return (
    <SFTDetailPopover name="Bonnies Tombstone">
      <>
        <img
          src={SUNNYSIDE.decorations.bonniesTombstone}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
          alt="Bonnies Tombstone"
        />
      </>
    </SFTDetailPopover>
  );
};
