import React from "react";

import woodyTheBeaver from "assets/sfts/beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const WoodyTheBeaver: React.FC = () => {
  return (
    <SFTDetailPopover name="Woody the Beaver">
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left"
      />
      <img
        src={woodyTheBeaver}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Woody the Beaver"
      />
    </SFTDetailPopover>
  );
};
