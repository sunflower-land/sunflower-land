import React from "react";

import solarLantern from "assets/decorations/lanterns/solar_lantern.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SolarLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Solar Lantern">
      <div className="flex justify-center items-center pointer-events-none">
        <img
          src={solarLantern}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          className="paper-floating"
          alt="Solar Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
