import React from "react";

import cabbageGirl from "assets/sfts/cabbage_girl.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CabbageGirl: React.FC = () => {
  return (
    <>
      <img
        src={cabbageGirl}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Cabbage Girl"
      />
    </>
  );
};
