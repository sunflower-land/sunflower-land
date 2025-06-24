import React from "react";

import cabbageBoy from "assets/sfts/cabbage_boy.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CabbageBoy: React.FC = () => {
  return (
    <SFTDetailPopover name="Cabbage Boy">
      <>
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
          }}
          className="absolute bottom-0 left-0 pointer-events-none"
        />
        <img
          src={cabbageBoy}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-0 pointer-events-none"
          alt="Cabbage Boy"
        />
      </>
    </SFTDetailPopover>
  );
};
