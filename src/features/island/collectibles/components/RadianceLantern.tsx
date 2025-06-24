import React from "react";

import radianceLantern from "assets/decorations/lanterns/radiance_lantern.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const RadianceLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Radiance Lantern">
      <div className="flex justify-center items-center pointer-events-none">
        <img
          src={radianceLantern}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          className="paper-floating"
          alt="Radiance Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
