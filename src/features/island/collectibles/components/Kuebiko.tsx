import React from "react";

import kuebiko from "assets/sfts/kuebiko.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Kuebiko: React.FC = () => {
  return (
    <SFTDetailPopover name="Kuebiko">
      <img
        src={kuebiko}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        alt="Kuebiko"
      />
    </SFTDetailPopover>
  );
};
