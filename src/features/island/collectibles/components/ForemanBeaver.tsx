import React from "react";

import foremanBeaver from "assets/sfts/construction_beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
export const ForemanBeaver: React.FC = () => {
  return (
    <SFTDetailPopover name="Foreman Beaver">
      <>
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left"
        />
        <img
          src={foremanBeaver}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="Foreman Beaver"
        />
      </>
    </SFTDetailPopover>
  );
};
