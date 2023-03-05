import React from "react";

import turtleBear from "assets/sfts/bears/turtle_bear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const TurtleBear: React.FC = () => {
  return (
    <>
      <img
        src={turtleBear}
        style={{
          width: `${PIXEL_SCALE * 17}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Turtle Bear"
      />
    </>
  );
};
