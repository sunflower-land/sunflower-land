import React from "react";

import easterBear from "assets/sfts/bears/easter_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const EasterBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Easter Bear">
      <img
        src={easterBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute pointer-events-none"
        alt="Easter Bear"
      />
    </SFTDetailPopover>
  );
};
