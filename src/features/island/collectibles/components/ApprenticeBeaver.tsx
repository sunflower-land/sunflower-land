import React from "react";

import apprenticeBeaver from "assets/sfts/apprentice_beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
export const ApprenticeBeaver: React.FC = () => {
  return (
    <SFTDetailPopover name="Apprentice Beaver">
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
          src={apprenticeBeaver}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="Apprentice Beaver"
        />
      </>
    </SFTDetailPopover>
  );
};
