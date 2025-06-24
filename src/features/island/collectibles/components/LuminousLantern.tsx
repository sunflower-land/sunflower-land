import React from "react";

import luminousLantern from "assets/decorations/lanterns/luminous_lantern.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const LuminousLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Luminous Lantern">
      <div className="flex justify-center items-center pointer-events-none">
        <img
          src={luminousLantern}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          className="paper-floating"
          alt="Luminous Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
