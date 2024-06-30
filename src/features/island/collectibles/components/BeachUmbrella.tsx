import React from "react";

import beachUmbrella from "assets/decorations/beach_umbrella.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BeachUmbrella: React.FC = () => {
  return (
    <>
      <img
        src={beachUmbrella}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 5}px`,
        }}
        className="absolute"
        alt="Beach Umbrella"
      />
    </>
  );
};
