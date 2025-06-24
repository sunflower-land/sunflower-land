import React from "react";

import bumpkinLantern from "assets/decorations/lanterns/bumpkin_lantern.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BumpkinLantern: React.FC = () => {
  return (
    <SFTDetailPopover name="Bumpkin Lantern">
      <div className="flex justify-center items-center pointer-events-none">
        <img
          src={bumpkinLantern}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          className="paper-floating"
          alt="Bumpkin Lantern"
        />
      </div>
    </SFTDetailPopover>
  );
};
