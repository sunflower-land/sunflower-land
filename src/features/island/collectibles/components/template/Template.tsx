import React from "react";

import image from "src/assets/icons/xp.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Template: React.FC = () => {
  return (
    <>
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 9}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Template"
      />
    </>
  );
};
