import React from "react";

import heartOfDavyJones from "assets/sfts/heart_of_davy_jones.gif";
import shadow from "assets/sfts/heart_of_davy_jones_shadow.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const HeartOfDavyJones: React.FC = () => {
  return (
    <>
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 5}px`,
        }}
        className="absolute"
        alt="Shadow"
      />
      <img
        src={heartOfDavyJones}
        style={{
          width: `${PIXEL_SCALE * 23}px`,
          bottom: `${PIXEL_SCALE * 6}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Heart Of Davy Jones"
      />
    </>
  );
};
