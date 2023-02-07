import React from "react";

import flamingo from "assets/events/valentine/sfts/flamingo.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Flamingo: React.FC = () => {
  return (
    <>
      <img
        src={flamingo}
        style={{
          width: `${PIXEL_SCALE * 34}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Flamingo"
      />
    </>
  );
};
