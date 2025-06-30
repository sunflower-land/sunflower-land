import React from "react";

import shiftySheldon from "assets/decorations/shifty_sheldon.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ShiftySheldon: React.FC = () => {
  return (
    <SFTDetailPopover name="Shifty Sheldon">
      <>
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 17}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        >
          <img
            src={shiftySheldon}
            style={{
              width: `${PIXEL_SCALE * 17}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
            }}
            className="absolute"
            alt="Shifty Sheldon"
          />
        </div>
      </>
    </SFTDetailPopover>
  );
};
