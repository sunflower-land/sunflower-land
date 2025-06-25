import React from "react";

import oceanLantern from "assets/decorations/lanterns/ocean_lantern.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const OceanLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Ocean Lantern">
      <div className="flex justify-center items-center">
        <img
          src={oceanLantern}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          className="paper-floating"
          alt="Ocean Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
