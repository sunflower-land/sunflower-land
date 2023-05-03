import React from "react";

import genieLamp from "assets/sfts/genie_lamp.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GenieLamp: React.FC = () => {
  return (
    <>
      <img
        src={genieLamp}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
        className="absolute"
        alt="Genie Lamp"
      />
    </>
  );
};
