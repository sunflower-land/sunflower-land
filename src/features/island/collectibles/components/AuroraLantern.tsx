import React from "react";

import auroraLantern from "assets/decorations/lanterns/aurora_lantern.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const AuroraLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Aurora Lantern">
      <div className="flex justify-center items-center">
        <img
          src={auroraLantern}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          className="paper-floating"
          alt="Aurora Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
