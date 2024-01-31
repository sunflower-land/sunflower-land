import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import sunriseBloomRug from "assets/sfts/sunrise_bloom_rug.webp";

export const SunriseBloomRug: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <img
        src={sunriseBloomRug}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Rug"
      />
    </div>
  );
};
