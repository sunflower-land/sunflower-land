import React from "react";

import easterBear from "assets/sfts/bears/easter_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

const EasterBearComponent: React.FC = () => {
  return (
    <img
      src={easterBear}
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute pointer-events-none"
      alt="Easter Bear"
    />
  );
};

export const EasterBear = React.memo(EasterBearComponent);
