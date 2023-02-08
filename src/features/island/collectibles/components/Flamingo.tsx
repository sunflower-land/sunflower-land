import React from "react";

import flamingo from "assets/events/valentine/sfts/flamingo.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Flamingo: React.FC = () => {
  return (
    <>
      <img
        src={flamingo}
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * 8}px`,
          left: `${PIXEL_SCALE * 3.5}px`,
        }}
        className="absolute"
        alt="Flamingo"
      />
    </>
  );
};
