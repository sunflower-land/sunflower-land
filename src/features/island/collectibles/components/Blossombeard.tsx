import React from "react";

import image from "assets/sfts/blossom_beard.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Blossombeard: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 1.5}px`,
        }}
        className="absolute"
        alt="Blossombeard"
      />
    </>
  );
};
