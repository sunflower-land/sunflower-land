import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CrowRock: React.FC = () => {
  return (
    <SFTDetailPopover name="Crow Rock">
      <>
        <img
          src={SUNNYSIDE.decorations.crowRock}
          style={{
            width: `${PIXEL_SCALE * 29}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
          alt="Crow Rock"
        />
      </>
    </SFTDetailPopover>
  );
};
