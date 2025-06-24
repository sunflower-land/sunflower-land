import React from "react";

import trophy from "assets/fish/phantom_barracuda_trophy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PhantomBarracuda: React.FC = () => {
  return (
    <SFTDetailPopover name="Phantom Barracuda">
      <>
        <img
          src={trophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Phantom Barracuda"
        />
      </>
    </SFTDetailPopover>
  );
};
