import React from "react";

import prizedPotato from "assets/sfts/peeled_potato.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PeeledPotato: React.FC = () => {
  return (
    <SFTDetailPopover name="Peeled Potato">
      <>
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute w-full"
        />
        <img
          src={prizedPotato}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Peeled Potato"
        />
      </>
    </SFTDetailPopover>
  );
};
