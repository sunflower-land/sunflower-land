import React from "react";

import beachBall from "assets/seasons/solar-flare/beach_ball.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BeachBall: React.FC = () => {
  return (
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
  );
};
