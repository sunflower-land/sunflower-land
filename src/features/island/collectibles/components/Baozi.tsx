import React from "react";

import image from "src/assets/sfts/baozi.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Baozi: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Baozi"
      />
    </>
  );
};
