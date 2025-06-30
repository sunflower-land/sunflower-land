import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SpookyTree: React.FC = () => {
  return (
    <SFTDetailPopover name="Spooky Tree">
      <>
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 26}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            right: `-${PIXEL_SCALE * 4}px`,
          }}
        >
          <img
            src={SUNNYSIDE.decorations.spookyTree}
            style={{
              width: `${PIXEL_SCALE * 26}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
            }}
            className="absolute"
            alt="Spooky Tree"
          />
        </div>
      </>
    </SFTDetailPopover>
  );
};
