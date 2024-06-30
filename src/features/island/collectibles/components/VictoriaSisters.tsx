import React from "react";

import victoriaSisters from "assets/sfts/victoria_sisters.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const VictoriaSisters: React.FC = () => {
  return (
    <img
      src={victoriaSisters}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Victoria Sisters"
      className="absolute"
    />
  );
};
