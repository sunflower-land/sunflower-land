import React from "react";

import pablo from "assets/sfts/pablo_bunny.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PabloBunny: React.FC = () => {
  return (
    <>
      <img
        src={pablo}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Pablo The Bunny"
      />
    </>
  );
};
