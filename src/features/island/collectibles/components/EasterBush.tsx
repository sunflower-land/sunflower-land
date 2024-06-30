import React from "react";

import easterBush from "assets/sfts/easter_bush.gif";
import easterBushShadow from "assets/sfts/easter_bush_shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const EasterBush: React.FC = () => {
  return (
    <>
      <img
        src={easterBushShadow}
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
        className="absolute pointer-events-none"
        alt="Easter Bush Shadow"
      />
      <img
        src={easterBush}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * -1}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute pointer-events-none"
        alt="Easter Bush"
      />
    </>
  );
};
