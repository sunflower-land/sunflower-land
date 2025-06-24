import React from "react";

import headCase from "assets/sfts/golden_bear_head_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoldenBearHead: React.FC = () => {
  return (
    <SFTDetailPopover name="Golden Bear Head">
      <>
        <img
          src={headCase}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="GoldenBearHead"
        />
      </>
    </SFTDetailPopover>
  );
};
