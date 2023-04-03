import React from "react";

import easterBush from "assets/sfts/easter_bush.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const EasterBush: React.FC = () => {
  return (
    <>
      <img
        src={easterBush}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Easter Bush"
      />
    </>
  );
};
