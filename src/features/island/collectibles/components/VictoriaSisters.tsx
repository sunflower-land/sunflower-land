import React from "react";

import victoriaSisters from "assets/sfts/victoria_sisters.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const VictoriaSisters: React.FC = () => {
  return (
    <SFTDetailPopover name="Victoria Sisters">
      <img
        src={victoriaSisters}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
        }}
        alt="Victoria Sisters"
        className="absolute"
      />
    </SFTDetailPopover>
  );
};
