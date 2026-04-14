import React from "react";

import heartBalloons from "assets/events/valentine/sfts/heart_balloons.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const HeartBalloons: React.FC = () => {
  return (
    <SFTDetailPopover name="Heart Balloons">
      <div style={{ width: `${PIXEL_SCALE * 18}px` }}>
        <img
          src={heartBalloons}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Heart Balloons"
        />
      </div>
    </SFTDetailPopover>
  );
};
