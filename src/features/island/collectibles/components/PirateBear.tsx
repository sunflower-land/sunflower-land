import React from "react";

import pirateBear from "assets/sfts/bears/pirate_bear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PirateBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Pirate Bear">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={pirateBear}
          style={{
            width: `${PIXEL_SCALE * 19}px`,
          }}
          alt="Pirate Bear"
        />
      </div>
    </SFTDetailPopover>
  );
};
