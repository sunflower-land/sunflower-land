import React from "react";

import blackBear from "assets/sfts/black_bear.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BlackBear: React.FC = () => {
  return (
    <>
      <img
        src={blackBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Basic Bear"
      />
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute"
        alt="Basic Bear"
      />
    </>
  );
};
