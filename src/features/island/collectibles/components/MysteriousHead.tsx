import React from "react";

import mysteriousHead from "assets/sfts/mysterious_head.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
export const MysteriousHead: React.FC = () => {
  return (
    <SFTDetailPopover name="Mysterious Head">
      <img
        src={mysteriousHead}
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
        className="absolute"
        alt="Mysterious Head"
      />
    </SFTDetailPopover>
  );
};
