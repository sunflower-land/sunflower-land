import React from "react";

import whiteTulip from "assets/decorations/white_tulips.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const WhiteTulips: React.FC = () => {
  return (
    <>
      <img
        src={whiteTulip}
        style={{
          width: `${PIXEL_SCALE * 8}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="White Tulip"
      />
    </>
  );
};
