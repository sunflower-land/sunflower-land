import React from "react";

import rock from "assets/resources/gold_small.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Gold: React.FC = () => (
  <img
    src={rock}
    style={{
      width: `${PIXEL_SCALE * 14}px`,
      top: `${PIXEL_SCALE * 3}px`,
      left: `${PIXEL_SCALE * 1}px`,
      position: "absolute",
    }}
  />
);
