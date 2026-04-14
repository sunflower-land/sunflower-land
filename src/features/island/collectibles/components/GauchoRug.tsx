import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import rug from "assets/sfts/gaucho_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GauchoRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Gaucho Rug">
      <>
        <img
          src={rug}
          style={{
            width: `${PIXEL_SCALE * 37}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 5.5}px`,
          }}
          className="absolute"
          alt="Gaucho Rug"
        />
      </>
    </SFTDetailPopover>
  );
};
