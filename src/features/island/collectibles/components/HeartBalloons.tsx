import React from "react";

import heartBalloons from "assets/events/valentine/sfts/balloons.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const HeartBalloons: React.FC = () => {
  return (
    <>
      <img
        src={heartBalloons}
        style={{
          width: `${PIXEL_SCALE * 34}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Heart Balloons"
      />
    </>
  );
};
