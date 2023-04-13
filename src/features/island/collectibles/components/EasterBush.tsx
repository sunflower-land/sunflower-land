import React from "react";

import easterBush from "assets/sfts/easter_bush.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

const EasterBushComponent: React.FC = () => {
  return (
    <img
      src={easterBush}
      style={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      className="absolute pointer-events-none"
      alt="Easter Bush"
    />
  );
};

export const EasterBush = React.memo(EasterBushComponent);
