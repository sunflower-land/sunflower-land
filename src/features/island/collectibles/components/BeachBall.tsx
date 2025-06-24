import React from "react";

import beachBall from "assets/seasons/solar-flare/beach_ball.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BeachBall: React.FC = () => {
  return (
    <SFTDetailPopover name="Beach Ball">
      <>
        <img
          src={beachBall}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Beach Ball"
        />
      </>
    </SFTDetailPopover>
  );
};
